import { useUser } from '../api/UserContext';
import { Alert, Image, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import Lottie from 'lottie-react-native';
import { LogBox } from 'react-native';
import { API_BASE_URL } from '../api/config';

export function LoadPage({ navigation }) {
  LogBox.ignoreAllLogs(true);
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (user) {
          navigation.navigate('Home');
        } else {
          navigation.navigate('Sign In');
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, loading, navigation]);

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
            uri: `${API_BASE_URL}/image/loadPageIcon.png`,
          }}
          style={signInStyle.signInImg}
        />
      </Animatable.View>
      <Animatable.View
        animation={'fadeInUp'}
        duration={1000}
        delay={1000}
        style={{ top: 220, alignSelf: 'center' }}>
        <View style={{ start: 8 }}>
          <Lottie
            source={require('../assets/lottie/loadIcon.json')}
            autoPlay={true}
            style={{ height: 50 }}
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
