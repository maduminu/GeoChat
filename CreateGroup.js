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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { StatusBar } from 'react-native';

export function CreateGroup({ route, navigation }) {
  const [img, setImg] = useState(
    'http://YOUR_LOCAL_IP/geochat/image/addPic.png',
  );
  const [profileImage, setProfileImage] = useState(null);
  const [name, setname] = useState(null);

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
            onPress={group}>
            <Icon
              name="md-arrow-back-outline"
              size={25}
              color={'#2e2e2e'}
              style={{ fontWeight: '200' }}
            />
          </TouchableOpacity>
          <Text style={Style.Text2}>{'Back'}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={{ width: 80, height: 80, alignSelf: 'center', borderRadius: 50 }}
        onPress={selectProfilePicture}>
        <Image
          source={{ uri: img }}
          style={{ width: 70, height: 70, borderRadius: 50 }}
        />
      </TouchableOpacity>

      <View style={Style.View}>
        <TextInput
          style={Style.Input1}
          placeholder={'Type Your Group Name'}
          placeholderTextColor={'#5a6b75'}
          onChangeText={setname}
        />
        <TouchableOpacity onPress={createGroup}>
          <Icon name="checkmark-circle-outline" style={Style.Btn} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return ui;

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

  async function createGroup() {
    const formData = new FormData();
    var userJsonText = await AsyncStorage.getItem('user');
    var userJsonObject = JSON.parse(userJsonText);
    formData.append('userId', userJsonObject.id);
    formData.append('name', name);
    formData.append('profile_picture', profileImage);

    if (!name) {
      Alert.alert('Message', 'Please enter a name');
    } else {
      if (!profileImage) {
        Alert.alert('Message', 'Please select a profile picture');
      } else {
        var request = new XMLHttpRequest();
        request.open(
          'POST',
          'http://YOUR_LOCAL_IP/geochat/createGroup.php',
          true,
        );

        request.onreadystatechange = function () {
          if (request.readyState === 4 && request.status === 200) {
            navigation.navigate('Group');
          }
          {
          }
        };
        request.send(formData);
      }
    }
  }

  function group() {
    navigation.navigate('Group');
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
  View3: {
    flexDirection: 'row',
    width: '90%',
    height: 0.5,
    backgroundColor: '#9E9F9F',
    alignSelf: 'center',
    borderRadius: 20,
  },
  Text2: {
    fontSize: 20,
    color: '#2e2e2e',
    paddingVertical: 10,
  },
  View1: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  View: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#fffffa',
    paddingHorizontal: 10,
  },
  Input1: {
    width: '80%',
    height: 50,
    backgroundColor: '#f3f3f3',
    fontSize: 15,
    borderRadius: 20,
    paddingLeft: 10,
    paddingStart: 20,
    color: '#2e2e2e',
  },
  Btn: {
    color: '#2D86FF',
    paddingHorizontal: 10,
    fontSize: 40,
  },
});
