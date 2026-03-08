import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import SelectDropdown from 'react-native-select-dropdown';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import * as Animatable from 'react-native-animatable';

export function ChatImage({route, navigation}) {
  const ui = (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <StatusBar
        hidden={false}
        backgroundColor="black"
        barStyle="light-content"
        translucent={true}
      />
      <View
        style={{
          gap: 10,
          width: '90%',
          height: '90%',
          top: 50,
          maxHeight: '100%',
          maxWidth: '100%',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignSelf: 'flex-start',
            alignItems: 'center',
            end: 10,
          }}
          onPress={Goback}>
          <Icon
            name="md-arrow-back-outline"
            size={25}
            color={'#fffffc'}
            style={{fontWeight: '200'}}
          />
        </TouchableOpacity>
        <Image
          source={{uri: 'http://YOUR_LOCAL_IP' + route.params.imgage}}
          style={chatStyle.img}
          resizeMode={'contain'}
        />
      </View>
    </SafeAreaView>
  );

  return ui;

  function Goback() {
    // const obj = {
    //     "name": route.params.name,
    //     "id": route.params.id,
    //     "img": route.params.img,
    // };

    // { route.params.pageId == "1" ? navigation.navigate("Chat", obj) : route.params.pageId == "2" ? navigation.navigate("GroupChat", obj) : route.params.pageId == "3" ? navigation.navigate("PostView", obj):""; }
    navigation.goBack();
  }
}

const chatStyle = StyleSheet.create({
  img: {
    width: 420,
    height: 600,
  },
});
