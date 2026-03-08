import React, {useState, useEffect} from 'react';
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
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import SelectDropdown from 'react-native-select-dropdown';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import * as Animatable from 'react-native-animatable';

export function PostChat({route, navigation}) {
  const [chatHistory, setChatHistory] = useState([]);
  const [chat, setChat] = useState('');

  async function sendRequest() {
    const form = new FormData();
    var userJsonText = await AsyncStorage.getItem('user');
    var userJsonObject = JSON.parse(userJsonText);
    form.append('userId', userJsonObject.id);
    form.append('postId', route.params.postId);

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
      'http://YOUR_LOCAL_IP/geochat/post_chat.php',
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
      <View style={chatStyle.chatInfoContainer}>
        <View style={chatStyle.chatView2}>
          <TouchableOpacity
            onPress={PostView}
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
            <Text style={{fontSize: 18, color: 'black'}}>Go back</Text>
          </TouchableOpacity>
        </View>
      </View>

      {chatHistory == '' ? (
        <Animatable.Text
          style={{fontSize: 20, color: '#2e2e2e', textAlign: 'center'}}
          animation="zoomInUp"
          duration={1000}
          delay={2600}>
          No Comments yet
        </Animatable.Text>
      ) : (
        ''
      )}

      <FlatList
        data={chatHistory}
        renderItem={chatItem}
        style={chatStyle.flatList}
      />

      <View style={chatStyle.chatSendView}>
        <TextInput
          style={chatStyle.chatInput1}
          placeholder={'Type Your Massage Here'}
          placeholderTextColor={'#5a6b75'}
          onChangeText={setChat}
          value={chat}
        />
        <TouchableOpacity onPress={saveChat}>
          <Icon name="md-navigate-circle" style={chatStyle.chatSendBtn} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  async function saveChat() {
    if (!chat) {
    } else {
      var userJsonText = await AsyncStorage.getItem('user');
      var UserObject = JSON.parse(userJsonText);

      var requsetObject = {
        userId: UserObject.id,
        postId: route.params.postId,
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
        'http://YOUR_LOCAL_IP/geochat/savePostChat.php',
        true,
      );
      request.send(formData);
    }
  }

  function start() {
    sendRequest();
  }
  function PostView() {
    navigation.goBack();
  }

  useEffect(() => {
    const interval = setInterval(() => {
      sendRequest();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(start, []);

  return ui;
}

function chatItem({item, index}) {
  const itemUI = (
    <Animatable.View animation={'fadeInUp'} duration={1000} delay={300}>
      <View
        style={
          item.side == 'right'
            ? chatStyle.chatViewRight
            : chatStyle.chatViewLeft
        }>
        <Text
          style={item.name == 'You' ? {display: 'none'} : chatStyle.chatName}>
          {item.name == 'You' ? '' : item.name}
        </Text>
        <Text style={chatStyle.chatSend}>{item.msg}</Text>
      </View>
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
              size={16}
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
    backgroundColor: '#fffffa',
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
    color: '#dee6e7',
    fontSize: 12,
  },
  chatSendTime: {
    fontSize: 8,
    color: '#c4c4c4',
    // end: 20
  },
  chatList: {
    width: '100%',
  },
  chatIconSeen: {
    color: '#dee6e7',
  },
  chatIconSend: {
    color: '#dee6e7',
  },
  chatSendView: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#fffffa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 10,
  },
  chatInput1: {
    width: '80%',
    height: 50,
    backgroundColor: '#f3f3f3',
    fontSize: 15,
    borderRadius: 20,
    paddingLeft: 10,
    paddingStart: 20,
    color: '#2e2e2e',
  },
  chatSendBtn: {
    color: '#0070ee',
    paddingHorizontal: 10,
    fontSize: 40,
  },
});
