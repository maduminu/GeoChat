import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { StatusBar } from 'react-native';

export function AddPost({ navigation }) {
  const [img, setImg] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [name, setname] = useState(null);

  const [jsObject, setJsObject] = useState([1]);

  const ui = (
    <SafeAreaView style={Style.home}>
      <StatusBar
        hidden={false}
        backgroundColor="#fffffa"
        barStyle="dark-content"
        translucent={true}
      />
      <View style={Style.Container}>
        <View style={Style.View2}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={PostView}>
            <Icon
              name="md-arrow-back-outline"
              size={25}
              color={'#2e2e2e'}
              style={{ fontWeight: '200' }}
            />
          </TouchableOpacity>
          <Text style={Style.Text1}>{'Back'}</Text>
        </View>
      </View>
      <FlatList data={jsObject} renderItem={postItem} />
      <View style={Style.View}>
        <TextInput
          style={Style.Input1}
          placeholder={'Discription'}
          placeholderTextColor={'#5a6b75'}
          onChangeText={setname}
        />
        <TouchableOpacity onPress={sendPost}>
          <Text style={{ color: '#0000f0', fontSize: 20 }}>Post</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return ui;

  function postItem() {
    const itemUI = (
      <View
        style={{ height: 550, justifyContent: 'center', alignItems: 'center' }}>
        <View style={Style.PostView}>
          {img == '' ? (
            <TouchableOpacity onPress={selectProfilePicture}>
              <Text style={Style.Text2}>Click here to Select</Text>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                width: '100%',
                height: 500,
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: 500,
                  alignSelf: 'center',
                  alignItems: 'center',
                }}
                TouchableOpacity={0}
                activeOpacity={1}
                onPress={selectProfilePicture}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    backgroundColor: '#00000080',
                    width: '95%',
                    height: 500,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      color: '#f9f9f9',
                      fontSize: 35,
                      position: 'absolute',
                      top: 200,
                    }}>
                    Click here to change
                  </Text>
                </View>
                <Image
                  source={{ uri: img }}
                  style={Style.PostImg}
                // resizeMode={'cover'}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
    return itemUI;
  }

  async function selectProfilePicture() {
    const options = {
      mediaType: 'photo',
    };
    const result = await launchImageLibrary(options);

    if (result.didCancel) {
      Alert.alert('Message', 'No Image Selecteed');
    } else {
      const imageObject = {
        uri: result.assets[0].uri,
        name: 'profile.png',
        type: 'image/png',
      };
      setProfileImage(imageObject);
      setImg(imageObject.uri);
    }
  }

  async function sendPost() {
    const formData = new FormData();
    var userJsonText = await AsyncStorage.getItem('user');
    var userJsonObject = JSON.parse(userJsonText);
    formData.append('userId', userJsonObject.id);
    formData.append('name', name);
    formData.append('profile_picture', profileImage);

    if (!profileImage) {
      Alert.alert('Message', 'Please select a picture');
    } else {
      if (!name) {
        Alert.alert('Message', 'Please enter a name');
      } else {
        var request = new XMLHttpRequest();
        request.open(
          'POST',
          'http://YOUR_LOCAL_IP/geochat/add_post.php',
          true,
        );

        request.onreadystatechange = function () {
          if (request.readyState === 4 && request.status === 200) {
            navigation.goBack();
            setImg('');
            setname('');
          }
        };
        request.send(formData);
      }
    }
  }

  function PostView() {
    navigation.goBack();
  }
}

const Style = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 10,
  },
  Text1: {
    color: '#2e2e2e',
    fontSize: 20,
    start: 15,
  },
  Text2: {
    color: '#2e2e2e',
    fontSize: 20,
  },
  Container: {
    flexDirection: 'row',
    backgroundColor: '#fffffa',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
    marginTop: 22,
  },
  View2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '60%',
  },
  View: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#fffffa',
    paddingHorizontal: 10,
    gap: 10,
  },
  Input1: {
    width: '80%',
    height: 100,
    backgroundColor: '#f3f3f3',
    fontSize: 15,
    borderRadius: 20,
    paddingLeft: 10,
    paddingStart: 20,
    color: '#2e2e2e',
  },
  Btn: {
    color: '#0000f0',
    paddingHorizontal: 10,
    fontSize: 40,
  },
  PostView: {
    width: '100%',
    // height: 560,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  PostImg: {
    width: '95%',
    borderRadius: 10,
    maxHeight: 500,
    height: '100%',
    zIndex: -1,
  },
  SelectText: {},
});
