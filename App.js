import WelcomePage from "./src/comps/WelcomePage";
import UserPage from "./src/comps/UserPage";
import SavePage from "./src/comps/SavePage";
import { Tab, TabView, Header, Icon } from '@rneui/themed';
import React, { useState, useEffect, useRef } from "react";
import { Animated, TouchableOpacity, Alert, Image, ToastAndroid } from 'react-native';

export default function App() {
  const [index, setIndex] = useState(0);
  const [headerTitle, setHeaderTitle] = useState('ReadZ');
  const colorAnim = useRef(new Animated.Value(0)).current;

  // Change the header title every two seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setHeaderTitle((prevTitle) => {
        const newTitle = prevTitle === 'ReadZ' ? 'News, made for you!' : 'ReadZ';
        return newTitle;
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  // Create a looped animation of changing color for the header text
  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(
        colorAnim,
        {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }
      )
    );

    animation.start();

    return () => animation.stop(); // add a stop function call to prevent infinite loop in case of error
  }, [colorAnim]);

  // Color range for header
  const color = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['white', 'yellow']
  });

  // toast showing while looking for a joke to display
  const showToast = () => {
    ToastAndroid.show('Fetching...', ToastAndroid.SHORT);
  };

  // Function makes a request to an external API and retrieves a random joke from it. 
  // If successful, it displays the joke in an Alert popup.
  const fetchJoke = async () => {
    try {
      showToast();
      const response = await fetch('https://official-joke-api.appspot.com/random_joke');
      const data = await response.json();
      const { setup, punchline } = data;
      Alert.alert('Not responsible for sad jokes', `${setup} ${punchline}`, [
        {
          text: 'Haha'
        },
      ],
        {
          cancelable: true
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header
        leftComponent={<Image source={require('./assets/icon.png')}
          style={{
            width: 30,
            height: 30,
            marginLeft: 10,
            resizeMode: 'contain',
          }} />}
        centerComponent={
          <Animated.Text style={{ color: color, fontSize: 20, fontWeight: 'bold' }}>
            {headerTitle}
          </Animated.Text>
        }
        rightComponent={<TouchableOpacity onPress={fetchJoke}>
          <Icon name="mood" color="#fff" />
        </TouchableOpacity>}
        containerStyle={{
          justifyContent: 'space-around',
          borderBottomWidth: 0,
          elevation: 0,
        }}
      />

      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: '#fff',
          height: 3,
        }}
        variant="primary"
        containerStyle={{
          backgroundColor: '#0066cc',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 3,
        }}
      >
        <Tab.Item
          title="General"
          titleStyle={{ fontSize: 12 }}
          icon={{
            name: 'newspaper',
            type: 'ionicon',
            color: index === 0 ? '#fff' : 'rgba(255,255,255,0.7)',
            size: 20,
          }}
          containerStyle={{
            paddingBottom: 10,
            borderTopWidth: index === 0 ? 3 : 0,
            borderTopColor: '#fff',
          }}
        />
        <Tab.Item
          title="User"
          titleStyle={{ fontSize: 12 }}
          icon={{
            name: 'star',
            type: 'ionicon',
            color: index === 1 ? '#fff' : 'rgba(255,255,255,0.7)',
            size: 20,
          }}
          containerStyle={{
            paddingBottom: 10,
            borderTopWidth: index === 1 ? 3 : 0,
            borderTopColor: '#fff',
          }}
        />
        <Tab.Item
          title="Saved"
          titleStyle={{ fontSize: 12 }}
          icon={{
            name: 'heart',
            type: 'ionicon',
            color: index === 2 ? '#fff' : 'rgba(255,255,255,0.7)',
            size: 20,
          }}
          containerStyle={{
            paddingBottom: 10,
            borderTopWidth: index === 2 ? 3 : 0,
            borderTopColor: '#fff',
          }}
        />
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={{ width: '100%', backgroundColor: '#f4f4f4' }}>
          <WelcomePage />
        </TabView.Item>
        <TabView.Item style={{ width: '100%', backgroundColor: '#f4f4f4' }}>
          <UserPage />
        </TabView.Item>
        <TabView.Item style={{ width: '100%', backgroundColor: '#f4f4f4' }}>
          <SavePage />
        </TabView.Item>
      </TabView>
    </>
  );
}
