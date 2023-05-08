import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Linking, StyleSheet, Animated, FlatList, RefreshControl, Alert, ToastAndroid, ImageBackground } from 'react-native';
import { Card, Icon } from '@rneui/themed';
import * as SQLite from 'expo-sqlite';

export default function WelcomePage() {
    const [data, setData] = useState([]); // array to store fetched news articles
    const url = "https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY";
    const [animation] = useState(new Animated.Value(0)); // animation value for card animations
    const db = SQLite.openDatabase('news.db'); // SQLite database instance
    const [isRefreshing, setIsRefreshing] = useState(false); // state variable to control the refresh

    // Function to handle refresh
    const handleRefresh = () => {
        setIsRefreshing(true); // set the state variable to true to show the spinner
        fetchArticles();
        setIsRefreshing(false); // set the state variable to false to hide the spinner
    };

    // Effect hook to create the SQLite database table if it doesn't exist
    useEffect(() => {
        db.transaction(trx => {
            trx.executeSql('create table if not exists article (url text primary key, title text, urlToImage text, description text, publishedAt text);');
        }, errorHandler, null)
    }, []);

    // In the event of successful save on the device
    const showToast = () => {
        ToastAndroid.show('Saved', ToastAndroid.SHORT);
    };

    // Function to save an article to the SQLite database
    const saveArticle = (article) => {
        db.transaction(trx => {
            trx.executeSql('insert into article (url, title, urlToImage, description, publishedAt) values (?, ?, ?, ?, ?);', [article.url, article.title, article.urlToImage, article.description, article.publishedAt]);
        }, errorHandler, showToast)
    };

    // Function to handle database errors
    // If 'UNIQUE' is contained in the error message return, primary key is already present,
    // therefore the article is already present
    const errorHandler = (error) => {
        Alert.alert(
            'Warning',
            error.message.includes('UNIQUE') ? 'Article already saved!' : 'Operation failed:\n' + error,
            [
                {
                    text: 'Nice'
                },
            ],
            {
                cancelable: true // set the ability to dismiss the alert window without having to tap the button
            }
        );
    };

    // Function to fetch news articles from the API
    const fetchArticles = () => {
        setIsRefreshing(true);
        fetch(url)
            .then(res => res.json())
            .then((json) => {
                setData(json);
                setIsRefreshing(false);
            })
            .catch(err => {
                console.error(err);
                setIsRefreshing(false);
            });
    };

    // Effect hook to fetch news articles when the component mounts
    useEffect(() => {
        fetchArticles();
    }, []);

    // Effect hook to animate the cards when they are added to the view
    useEffect(() => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start();
    }, [animation]);

    // Function to share an article via email
    // Providing basic email structure - precompiled template
    // Leaving 'mailto' field empty to defer the authenticity of email provided to the default email client used
    const shareArticle = (article) => {
        Linking.openURL('mailto:?subject=ReadZ News&body=' + article.title + '\n-\n' + article.description + '\n-\n' + article.url);
    };

    // Function to render a news article card
    // Changed default of elements loaded to accomodate more content at once
    const renderCard = ({ item, index }) => {
        const animationValue = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [index * 100, 0],
            extrapolate: 'clamp'
        });
        return (
            <Animated.View style={[styles.animatedView, { transform: [{ translateY: animationValue }] }]}>
                <Card style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.title}>{item.title}</Text>
                        <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                            <Image
                                source={{ uri: item.urlToImage }}
                                style={styles.image}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.description}>{item.description}</Text>
                    <View style={styles.cardFooter}>
                        <Text style={styles.date}>{new Date(item.publishedAt).toLocaleDateString('en-GB')}</Text>
                        <Icon name='favorite' onPress={() => saveArticle(item)} style={styles.icon} />
                        <Icon name='share' onPress={() => shareArticle(item)} style={styles.icon} />
                    </View>
                </Card>
            </Animated.View>
        );
    };

    // background image source
    const image = { uri: 'https://assets.hongkiat.com/uploads/minimalist-mobile-wallpapers/original/28.jpg' };

    return (
        <ImageBackground source={image} resizeMode="cover" style={styles.imageBck}>
            <FlatList
                data={data.articles}
                renderItem={renderCard}
                keyExtractor={(item, index) => index.toString()}
                initialNumToRender={99}
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },
    animatedView: {
        width: '100%',
        alignItems: 'center'
    },
    card: {
        marginHorizontal: 15,
        marginVertical: 10,
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        flex: 1,
        marginRight: 10,
        color: '#555'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333'
    },
    cardFooter: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10
    },
    date: {
        flex: 1,
        color: '#999',
        fontStyle: "italic"
    },
    icon: {
        marginLeft: 15,
        color: '#333'
    },
    imageBck: {
        flex: 1,
        justifyContent: 'center',
    }
});
