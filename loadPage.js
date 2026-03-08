import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, Image, SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import * as Animatable from 'react-native-animatable';
import Lottie from 'lottie-react-native';
import {LogBox} from 'react-native';

export function LoadPage({navigation}) {
  LogBox.ignoreAllLogs(true);

  async function checkUser() {
    const user = await AsyncStorage.getItem('user');

    if (user != null) {
      navigation.navigate('Home');
    } else {
      navigation.navigate('Sign In');
    }
  }

  function start() {
    setTimeout(checkUser, 3000);
  }

  useEffect(start, []);

  const ui = (
    <SafeAreaView style={signInStyle.signInMain}>
      <StatusBar
        hidden={false}
        backgroundColor="#fffffa"
        barStyle="dark-content"
        translucent={true}
      />

      <Animatable.View
        animation={'fadeInUp'}
        duration={1000}
        delay={500}
        style={{
          width: 150,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{
            uri: 'http://YOUR_LOCAL_IP/geochat/image/loadPageIcon.png',
          }}
          style={signInStyle.signInImg}
        />
      </Animatable.View>
      <Animatable.View
        animation={'fadeInUp'}
        duration={1000}
        delay={1000}
        style={{top: 220, alignSelf: 'center'}}>
        <View style={{start: 8}}>
          <Lottie
            source={require('./android/app/src/main/assets/Lottie/loadIcon.json')}
            autoPlay={true}
            style={{height: 50}}
            loop={true}
          />
        </View>

        <Text
          style={{
            color: '#2D86FF',
            fontWeight: '400',
            fontSize: 20,
            fontFamily: 'Dancing Script',
          }}>
          Geo chat
        </Text>
      </Animatable.View>
    </SafeAreaView>
  );

  return ui;
}

const signInStyle = StyleSheet.create({
  signInMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffffc',
    gap: 25,
  },
  signInImg: {
    width: 160,
    height: 160,
  },
});
