import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import * as Animatable from 'react-native-animatable';

export function Chat({ route, navigation }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [chat, setChat] = useState('');
  const [imageStatus, setImageStatus] = useState();
  const [pageId, setPageId] = useState();

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
        // Alert.alert("hee");
      }
    };
    request.open(
      'POST',
      'http://YOUR_LOCAL_IP/geochat/load_chat.php',
      true,
    );
    request.send(form);
  }

  const ui = (
    <SafeAreaView style={chatStyle.chat}>
      <Image
        source={{
          uri: 'http://YOUR_LOCAL_IP/geochat/image/background4.webp',
        }}
        style={StyleSheet.absoluteFill}
        blurRadius={0}
      />

      <StatusBar
        hidden={false}
        backgroundColor="#fffffa"
        barStyle="dark-content"
        translucent={true}
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
              style={{ fontWeight: '200' }}
            />
            <Image
              source={{ uri: 'http://YOUR_LOCAL_IP' + route.params.img }}
              style={chatStyle.chatImage}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={UserProfile}>
            <Text style={chatStyle.chatText2}>{route.params.name}</Text>
          </TouchableOpacity>
        </View>
        <View style={chatStyle.chatView1}>
          <Text style={chatStyle.chatText1}>Online</Text>
        </View>
      </View>
      <View style={chatStyle.chatView3}></View>

      <View
        style={
          chatHistory == ''
            ? { alignSelf: 'center', justifyContent: 'center', height: '10%' }
            : { display: 'none' }
        }>
        <Animatable.Text
          style={{
            fontSize: 25,
            fontFamily: 'Roboto-LightItalic',
            color: '#2e2e2e',
          }}
          animation="zoomInUp"
          duration={1000}
          delay={2800}>
          Start A Conversation
        </Animatable.Text>
      </View>

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
          style={{ position: 'absolute', start: 265 }}>
          <Icon
            name={!imageStatus ? 'images-outline' : 'navigate-sharp'}
            size={30}
            color={'#3a3868'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={saveChat}
          onLongPress={selectProfilePicture}
          style={{ end: -5 }}>
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
        'http://YOUR_LOCAL_IP/geochat/saveChat.php',
        true,
      );
      request.send(formData);
    }
  }

  async function selectProfilePicture() {
    setPageId('1');

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

      setImageStatus(imageObject);
    }
  }

  async function imageChat(imageObject) {
    var userJsonText = await AsyncStorage.getItem('user');
    var fromUserObject = JSON.parse(userJsonText);

    var requsetObject = {
      from_user_id: fromUserObject.id,
      to_user_id: route.params.id,
    };

    const formData = new FormData();
    formData.append('requsetJson', JSON.stringify(requsetObject));
    formData.append('img', imageStatus);
    if (route.params.pageId == '3') {
      formData.append('pageId', pageId);
    } else {
      formData.append('pageId', pageId);
    }

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        setChat('');
        setImageStatus();
      }
    };
    request.open(
      'POST',
      'http://YOUR_LOCAL_IP/geochat/saveImageChat.php',
      true,
    );
    request.send(formData);
  }

  function share() {
    if (route.params.pageId === '3') {
      setImageStatus(route.params.imageUrl);
      setPageId(route.params.pageId);
    }
  }

  function start() {
    sendRequest();
  }

  useEffect(() => {
    if (route.params.pageId == '3') {
      setImageStatus(route.params.imageUrl);
      setPageId(route.params.pageId);
    }
  }, [route.params.imageUrl, route.params.pageId]);

  function home() {
    navigation.navigate('Home');
  }

  useEffect(start, []);

  useEffect(() => {
    const interval = setInterval(() => {
      sendRequest();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function ScrollBottom() {
    listViewRef.scrollToEnd({ animated: true });
  }

  return ui;

  function chatItem({ item, index }) {
    const itemUI = (
      <Animatable.View animation={'fadeInUp'} duration={1000} delay={300}>
        {item.msgStatus == '1' ? (
          <View
            style={
              item.side == 'right'
                ? chatStyle.chatViewRight
                : chatStyle.chatViewLeft
            }>
            <Text style={chatStyle.chatSend}>{item.msg}</Text>
          </View>
        ) : (
          ''
        )}

        {item.msgStatus == '2' ? (
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
                item.side == 'right' ? chatStyle.chatName2 : chatStyle.chatName1
              }>
              {item.side == 'right' ? 'You' : route.params.name}
            </Text>
            <Image
              source={{ uri: 'http://YOUR_LOCAL_IP' + `${item.msg}` }}
              style={{ width: 250, height: 350, borderRadius: 20 }}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
        ) : (
          ''
        )}

        <View
          style={
            item.side == 'right'
              ? { alignSelf: 'flex-end', end: 10 }
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
                name={item.status == 'seen' ? 'checkmark-done' : 'checkmark'}
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
        pageId: '1',
      };
      navigation.navigate('ChatImage', obj);
    }
  }

  function UserProfile() {
    const obj = {
      img: route.params.img,
      mobile: route.params.mobile,
      name: route.params.name,
      country: route.params.country,
      pageId: '2',
      id: route.params.id,
    };

    navigation.navigate('UserProfile', obj);
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
    paddingVertical: 10,
  },
  chatView1: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    maxWidth: '65%',
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
    maxWidth: '65%',
  },
  chatSend: {
    color: '#ffffff',
    fontSize: 20,
  },
  chatSendTime: {
    fontSize: 10,
    color: '#515151',
    textAlign: 'right',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#ffffffff',
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
  chatName1: {
    color: '#ffffff',
    fontSize: 12,
    end: 100,
    fontWeight: '400',
  },
  chatName2: {
    color: '#ffffff',
    fontSize: 12,
    start: 100,
    fontWeight: '400',
  },
});
