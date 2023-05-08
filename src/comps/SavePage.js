import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, StyleSheet, Animated, RefreshControl, Alert, ImageBackground } from 'react-native';
import { Card, Icon } from '@rneui/themed';
import * as SQLite from 'expo-sqlite';

export default function SavePage() {
    const [data, setData] = useState([]);
    const [animation] = useState(new Animated.Value(0));
    const db = SQLite.openDatabase('news.db');
    const [refreshing, setRefreshing] = useState(false);

    // Defines a callback function for refreshing the list
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        updateList();
        setRefreshing(false);
    }, [updateList]);

    useEffect(() => {
        db.transaction(trx => {
            trx.executeSql('create table if not exists article (url text primary key, title text, urlToImage text, description text, publishedAt text);', [], () => { }, errorHandler);
        }, errorHandler, null)
    }, []);

    const errorHandler = (error) => {
        Alert.alert('Operation failed:\n' + error.message);
    }

    const updateList = useCallback(() => {
        db.transaction(trx => {
            trx.executeSql('SELECT * FROM article;', [], (_, { rows }) => setData(rows._array), errorHandler);
        }, errorHandler, updateList)
    }, []);

    useEffect(() => {
        updateList();
    }, [updateList]);

    useEffect(() => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start();
    }, [animation]);

    // Defines a function for deleting an article from the database
    const deleteArticle = (article) => {
        db.transaction(trx => {
            trx.executeSql('DELETE FROM article WHERE url = ?;', [article.url], () => { }, errorHandler)
        }, errorHandler, updateList)
    };

    const shareArticle = (article) => {
        Linking.openURL(`mailto:?subject=ReadZ News&body=${article.title}%0A-%0A${article.description}%0A-%0A${article.url}`);
    };

    // background image source
    const image = { uri: 'https://assets.hongkiat.com/uploads/minimalist-mobile-wallpapers/original/29.jpg' };

    return (
        <>
            <ImageBackground source={image} resizeMode="cover" style={styles.imageBck}>
                {data.length > 0 ? (
                    <ScrollView style={styles.scrollView} refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }>
                        <View style={styles.container}>
                            {data.map((article, index) => {
                                const animationValue = animation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [(index * 100), 0],
                                    extrapolate: 'clamp'
                                });
                                return (
                                    <Animated.View key={index} style={[styles.animatedView, { transform: [{ translateY: animationValue }] }]}>
                                        <Card style={styles.card}>
                                            <View style={styles.cardHeader}>
                                                <Text style={styles.title}>{article.title}</Text>
                                                <TouchableOpacity onPress={() => Linking.openURL(article.url)}>
                                                    <Image
                                                        source={{ uri: article.urlToImage }}
                                                        style={styles.image}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.description}>{article.description}</Text>
                                            <View style={styles.cardFooter}>
                                                <Text style={styles.date}>{new Date(article.publishedAt).toLocaleDateString('en-GB')}</Text>
                                                <Icon name='delete' onPress={() => deleteArticle(article)} style={styles.icon} />
                                                <Icon name='share' onPress={() => shareArticle(article)} style={styles.icon} />
                                            </View>
                                        </Card>
                                    </Animated.View>
                                )
                            })}
                        </View>
                    </ScrollView>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No saved articles</Text>
                    </View>
                )}
            </ImageBackground>
        </>
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