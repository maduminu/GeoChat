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

export function GroupChat({route, navigation}) {
  const [chatHistory, setChatHistory] = useState([]);
  const [chat, setChat] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imageStatus, setImageStatus] = useState();

  async function sendRequest() {
    const form = new FormData();
    var userJsonText = await AsyncStorage.getItem('user');
    var userJsonObject = JSON.parse(userJsonText);
    form.append('id1', userJsonObject.id);
    form.append('id2', route.params.id);

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        var responceText = request.responseText;
        var responceArray = JSON.parse(responceText);
        setChatHistory(responceArray);
        // Alert.alert(request.responseText);
      }
    };
    request.open(
      'POST',
      'http://YOUR_LOCAL_IP/geochat/group_chat.php',
      true,
    );
    request.send(form);
  }

  const ui = (
    <SafeAreaView style={chatStyle.chat}>
      <StatusBar
        hidden={false}
        backgroundColor="#fffffa"
        barStyle="dark-content"
        translucent={true}
      />
      <Image
        source={{
          uri: 'http://YOUR_LOCAL_IP/geochat/image/background4.webp',
        }}
        style={StyleSheet.absoluteFill}
        blurRadius={0}
      />
      <View style={chatStyle.chatInfoContainer}>
        <View style={chatStyle.chatView2}>
          <TouchableOpacity
            onPress={home}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name="md-arrow-back-outline"
              size={25}
              color={'#2e2e2e'}
              style={{fontWeight: '200'}}
            />
            <Image
              source={{uri: 'http://YOUR_LOCAL_IP' + route.params.img}}
              style={chatStyle.chatImage}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={GroupDetails}>
            <Text style={chatStyle.chatText2}>{route.params.name}</Text>
          </TouchableOpacity>
        </View>
        <View style={chatStyle.chatView1}>
          <Text style={chatStyle.chatText1}>Online</Text>
        </View>
      </View>

      <View style={chatStyle.chatView3}></View>

      <FlatList
        data={chatHistory}
        renderItem={chatItem}
        style={chatStyle.flatList}
        ref={ref => {
          listViewRef = ref;
        }}
      />

      {chatHistory != '' ? (
        <View style={chatStyle.scrollBottomView}>
          <TouchableOpacity onPress={ScrollBottom}>
            <Icon name="arrow-down-circle-sharp" size={32} color="#3a4649" />
          </TouchableOpacity>
        </View>
      ) : (
        ''
      )}

      <View style={chatStyle.chatSendView}>
        <TextInput
          style={chatStyle.chatInput1}
          placeholder={'Type Your Massage Here'}
          placeholderTextColor={'#5a6b75'}
          onChangeText={setChat}
          value={chat}
        />
        <TouchableOpacity
          onPress={!imageStatus ? selectProfilePicture : imageChat}
          style={{position: 'absolute', start: 265}}>
          <Icon
            name={!imageStatus ? 'images-outline' : 'navigate'}
            size={30}
            color={'#3a3868'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={saveChat} onLongPress={selectProfilePicture}>
          <Icon name="md-navigate-circle" style={chatStyle.chatSendBtn} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  async function saveChat() {
    if (!chat) {
    } else {
      var userJsonText = await AsyncStorage.getItem('user');
      var fromUserObject = JSON.parse(userJsonText);

      var requsetObject = {
        from_user_id: fromUserObject.id,
        to_user_id: route.params.id,
        message: chat,
      };

      const formData = new FormData();
      formData.append('requsetJson', JSON.stringify(requsetObject));

      var request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          setChat('');
        }
      };
      request.open(
        'POST',
        'http://YOUR_LOCAL_IP/geochat/saveGroupChat.php',
        true,
      );
      request.send(formData);
    }
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

      setImageStatus(imageObject);
    }
  }

  async function imageChat() {
    var userJsonText = await AsyncStorage.getItem('user');
    var fromUserObject = JSON.parse(userJsonText);

    var requsetObject = {
      from_user_id: fromUserObject.id,
      to_user_id: route.params.id,
    };

    const formData = new FormData();
    formData.append('requsetJson', JSON.stringify(requsetObject));
    formData.append('img', imageStatus);

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        setChat('');
        setImageStatus();
      }
    };
    request.open(
      'POST',
      'http://YOUR_LOCAL_IP/geochat/saveGroupImgChat.php',
      true,
    );
    request.send(formData);
  }

  function start() {
    sendRequest();
  }

  function home() {
    navigation.navigate('Group');
  }

  function GroupDetails() {
    const obj = {
      name: route.params.name,
      id: route.params.id,
      img: route.params.img,
    };

    navigation.navigate('GroupUserDetails', obj);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      sendRequest();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(start, []);

  function ScrollBottom() {
    listViewRef.scrollToEnd({animated: true});
  }

  return ui;

  function chatItem({item, index}) {
    const itemUI = (
      <Animatable.View
        style={{gap: -5}}
        animation={'fadeInUp'}
        duration={1000}
        delay={300}>
        {item.chatStatusId == '1' ? (
          <View
            style={
              item.side == 'right'
                ? chatStyle.chatViewRight
                : chatStyle.chatViewLeft
            }>
            <Text
              style={
                item.name == 'You' ? {display: 'none'} : chatStyle.chatName
              }>
              {item.name == 'You' ? '' : item.name}
            </Text>
            <Text style={chatStyle.chatSend}>{item.msg}</Text>
          </View>
        ) : (
          ''
        )}

        {item.chatStatusId == '2' ? (
          <TouchableOpacity
            onPress={img}
            style={
              item.side == 'right'
                ? {
                    alignSelf: 'flex-end',
                    end: 10,
                    width: 260,
                    height: 390,
                    backgroundColor: '#0070ee',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 15,
                    gap: 5,
                  }
                : {
                    alignSelf: 'flex-start',
                    start: 10,
                    width: 260,
                    height: 390,
                    backgroundColor: '#3a4649',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 15,
                    gap: 5,
                  }
            }
            activeOpacity={1}>
            <Text
              style={
                item.name == 'You' ? chatStyle.chatName2 : chatStyle.chatName1
              }>
              {item.name == 'You' ? 'You' : item.name}
            </Text>
            <Image
              source={{uri: 'http://YOUR_LOCAL_IP' + `${item.msg}`}}
              style={{width: 250, height: 350, borderRadius: 15}}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
        ) : (
          ''
        )}

        <View
          style={
            item.side == 'right'
              ? {alignSelf: 'flex-end', end: 10}
              : {
                  alignSelf: 'flex-start',
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                }
          }>
          <View style={chatStyle.chatView1}>
            <Text style={chatStyle.chatSendTime}>{item.time}</Text>
            {item.side == 'right' ? (
              <Icon
                name={item.status == '2' ? 'checkmark-done' : 'checkmark'}
                size={20}
                style={
                  item.status == 'seen'
                    ? chatStyle.chatIconSeen
                    : chatStyle.chatIconSend
                }
              />
            ) : null}
          </View>
        </View>
      </Animatable.View>
    );

    return itemUI;

    function img() {
      // Alert.alert("Message","Success");
      const obj = {
        imgage: item.msg,
        name: route.params.name,
        id: route.params.id,
        img: route.params.img,
        pageId: '2',
      };
      navigation.navigate('ChatImage', obj);
    }
  }
}

const chatStyle = StyleSheet.create({
  chat: {
    flex: 1,
    backgroundColor: '#fffffa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  chatInfoContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffffff',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
    marginTop: '10%',
  },
  chatImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  chatText1: {
    fontSize: 15,
    // fontFamily: 'Arial',
    color: '#fbfffd',
  },
  chatImg: {
    width: 65,
    height: 65,
    borderRadius: 50,
  },
  chatView2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '60%',
  },
  chatView3: {
    flexDirection: 'row',
    width: '90%',
    height: 0.5,
    backgroundColor: '#9E9F9F',
    alignSelf: 'center',
    borderRadius: 20,
  },
  chatText2: {
    fontSize: 20,
    color: '#2e2e2e',
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  chatView1: {
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    alignItems: 'center',
  },
  chatViewLeft: {
    backgroundColor: '#3a4649',
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 10,
  },
  chatViewRight: {
    backgroundColor: '#0070ee',
    borderRadius: 15,
    borderBottomRightRadius: 0,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: 'flex-end',
    marginRight: 15,
    marginTop: 10,
  },
  chatSend: {
    color: '#dee6e7',
    fontSize: 17,
  },
  chatName: {
    color: '#b7b7b7',
    fontSize: 12,
  },
  chatName1: {
    color: '#b7b7b7',
    fontSize: 12,
    end: 100,
  },
  chatName2: {
    color: '#ffffff',
    fontSize: 12,
    start: 100,
  },
  chatSendTime: {
    fontSize: 10,
    color: '#515151',
    // end: 20
  },
  chatList: {
    width: '100%',
  },
  chatIconSeen: {
    color: '#0070ee',
  },
  chatIconSend: {
    color: '#0070ee',
  },
  chatSendView: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#ffffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 10,
  },
  chatInput1: {
    width: '86%',
    height: 50,
    backgroundColor: '#f3f3f3',
    fontSize: 15,
    borderRadius: 20,
    paddingLeft: 10,
    paddingStart: 20,
    paddingEnd: 45,
    color: '#2e2e2e',
  },
  chatSendBtn: {
    color: '#0070ee',
    paddingHorizontal: -10,
    fontSize: 40,
  },
  scrollBottomView: {
    width: '100%',
    height: 30,
    alignItems: 'flex-end',
    end: 15,
  },
});
