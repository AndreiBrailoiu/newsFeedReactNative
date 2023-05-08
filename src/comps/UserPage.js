import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, StyleSheet, Alert, ToastAndroid, ImageBackground } from 'react-native';
import { Card, SearchBar, Icon, ButtonGroup } from '@rneui/themed';
import * as Location from 'expo-location';
import * as SQLite from 'expo-sqlite';

export default function UserPage() {
    const db = SQLite.openDatabase('news.db');
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const url = "https://newsapi.org/v2/everything?q=" + search + "&apiKey=c807b57a2ab640b9a970a74077ad864c";
    const urlCat = "https://newsapi.org/v2/top-headlines?country=us&category=" + search + "&apiKey=c807b57a2ab640b9a970a74077ad864c";
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const [showWeather, setShowWeather] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(2);
    const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + (location ? location.coords.latitude : '') + "&lon=" + (location ? location.coords.longitude : '') + "&units=metric&appid=fa8990163c56563bbb857c2ca0cca830";

    useEffect(() => {
        db.transaction(trx => {
            trx.executeSql('create table if not exists article (url text primary key, title text, urlToImage text, description text, publishedAt text);');
        }, errorHandler, null)
    }, []);

    const showToast = () => {
        ToastAndroid.show('Saved', ToastAndroid.SHORT);
    };

    const saveArticle = (article) => {
        db.transaction(trx => {
            trx.executeSql('insert into article (url, title, urlToImage, description, publishedAt) values (?, ?, ?, ?, ?);', [article.url, article.title, article.urlToImage, article.description, article.publishedAt]);
        }, errorHandler, showToast)
    };

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
                cancelable: true
            }
        );
    };

    const updateSearch = (search) => {
        setSearch(search);
    };

    const showToastFetch = () => {
        ToastAndroid.show('Fetching...', ToastAndroid.SHORT);
    };

    const fetchArticles = () => {
        showToastFetch();
        fetch(url)
            .then(res => res.json())
            .then((json) => setData(json))
            .catch(err => console.error(err))
    };

    // Function handling the category selection.
    const fetchArticlesCat = () => {
        showToastFetch();
        switch (selectedIndex) {
            case 0:
                updateSearch("business");
                break;
            case 1:
                updateSearch("entertainment");
                break;
            case 2:
                updateSearch("general");
                break;
            case 3:
                updateSearch("health");
                break;
            case 4:
                updateSearch("science");
                break;
            case 5:
                updateSearch("sports");
                break;
            case 6:
                updateSearch("technology");
                break;
            default:
                ToastAndroid.show('Selection mismatch, general class selected...', ToastAndroid.SHORT);
                updateSearch("general");
                break;
        }
        fetch(urlCat)
            .then(res => res.json())
            .then((json) => setData(json))
            .catch(err => console.error(err))
    };

    const shareArticle = (article) => {
        Linking.openURL('mailto:?subject=ReadZ News&body=' + article.title + '\n-\n' + article.description + '\n-\n' + article.url);
    };

    // Function to obtain Location permission
    // Fetch current location
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('No permission to get location')
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    // Function to obtain weather info when location is provided
    // Using only one useEffect instead of two would make the app hang in some occasion
    useEffect(() => {
        if (location) {
            fetch(weatherUrl)
                .then(res => res.json())
                .then((json) => setWeather(json))
                .catch(err => console.error(err));
        }
    }, [location]);

    // Weather card is shown in three different ways (handled in the return)
    // Basic text is displayed while waiting for the data
    // Large card displayed initially
    // Reduced dimensions on tap to free screen space
    const toggleWeather = () => {
        setShowWeather(!showWeather);
    };

    // background image source
    const image = { uri: 'https://assets.hongkiat.com/uploads/minimalist-mobile-wallpapers/original/03.jpg' };

    return (
        <View style={styles.container}>
            <ImageBackground source={image} resizeMode="cover" style={styles.imageBck}>
                <TouchableOpacity onPress={() => toggleWeather()}>
                    {weather ? (
                        <Card containerStyle={styles.cardContainer}>
                            {showWeather ? (
                                <>
                                    <Text style={styles.cardTitle}>Weather in {weather.name}</Text>
                                    <Image
                                        source={{
                                            uri: `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`,
                                        }}
                                        style={styles.cardImage}
                                    />
                                    <Text style={styles.cardDescription}>
                                        {Math.round(weather.main.temp)}°C, {weather.weather[0].description}
                                    </Text>
                                    <Text style={styles.cardDetails}>
                                        Feels like: {Math.round(weather.main.feels_like)}°C | Humidity: {weather.main.humidity}%
                                    </Text>
                                </>
                            ) : (
                                <Text style={styles.weatherTemperature}>
                                    {weather.name}, {weather.weather[0].description}: {Math.round(weather.main.temp)}°C <Image
                                        source={{
                                            uri: `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`,
                                        }}
                                        style={styles.weatherImage}
                                    />
                                </Text>
                            )}
                        </Card>
                    ) : (
                        <Text style={styles.loadingMessage}>Loading weather information...</Text>
                    )}
                </TouchableOpacity>
                <ButtonGroup containerStyle={{ marginVertical: 10, borderRadius: 20 }}
                    buttonContainerStyle={{ borderRadius: 20 }}
                    selectedButtonStyle={{ backgroundColor: '#FFFFFF00' }} //Setting the selected button's background color to transparent
                    selectedTextStyle={{ color: 'white' }}
                    buttons={[<Icon
                        name='work' style={{}} />, <Icon
                        name='celebration' style={{}} />, <Icon
                        name='grade' style={{}} />, <Icon
                        name='spa' style={{}} />, <Icon
                        name='science' style={{}} />, <Icon
                        name='pool' style={{}} />, <Icon
                        name='memory' style={{}} />]}
                    selectedIndex={selectedIndex}
                    onPress={(index) => {
                        console.log(index);
                        setSelectedIndex(index);
                        console.log(selectedIndex);
                        fetchArticlesCat();
                    }}
                />
                <SearchBar
                    round
                    lightTheme
                    placeholder="Search for news..."
                    onChangeText={updateSearch}
                    value={search}
                    onClear={fetchArticles}
                    searchIcon=""
                    containerStyle={styles.searchBarContainer}
                    inputStyle={styles.searchBarInput}
                />
                {Object.keys(data).length > 0 && (
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.articlesContainer}>
                            {data.articles.map((article, index) => (
                                <Card key={index} containerStyle={styles.cardContainer}>
                                    <TouchableOpacity onPress={() => Linking.openURL(article.url)}>
                                        <Image source={{ uri: article.urlToImage }} style={styles.cardImage} />
                                    </TouchableOpacity>
                                    <View style={styles.cardDetailsContainer}>
                                        <Text style={styles.cardTitle}>{article.title}</Text>
                                        <Text style={styles.cardDescription}>{article.description}</Text>
                                        <Text style={styles.cardPublishedAt}>
                                            {new Date(article.publishedAt).toLocaleDateString("en-GB")}
                                            <Icon name="favorite" onPress={() => saveArticle(article)} style={styles.icon} />
                                            <Icon name="share" onPress={() => shareArticle(article)} style={styles.icon} />
                                        </Text>
                                    </View>
                                </Card>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    searchBarContainer: {
        borderRadius: 10,
        height: 50,
        borderWidth: 0,
        marginHorizontal: 10,
        marginBottom: 10,
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent'
    },
    searchBarInput: {
        fontSize: 18,
    },
    scrollView: {
        marginBottom: 10,
    },
    articlesContainer: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
    },
    cardContainer: {
        borderRadius: 10,
        borderWidth: 0,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
    },
    cardImage: {
        width: "100%",
        height: 180,
        borderRadius: 10,
        marginBottom: 5,
    },
    cardDescription: {
        fontSize: 16,
        marginBottom: 5,
    },
    cardPublishedAt: {
        fontSize: 14,
        fontStyle: "italic",
        marginTop: 5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardDetailsContainer: {
        paddingHorizontal: 10,
    },
    cardDetails: {
        fontSize: 14,
        marginTop: 5,
    },
    icon: {
        marginLeft: 10,
        fontSize: 16,
        color: "gray",
    },
    weatherTemperature: {
        fontSize: 16,
        fontWeight: "bold",
    },
    weatherImage: {
        width: 30,
        height: 20
    },
    imageBck: {
        flex: 1,
        justifyContent: 'center',
    },
});
