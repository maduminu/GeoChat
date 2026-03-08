import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Lottie from 'lottie-react-native';

const ImgPopUp = ({ visible, children }) => {
  React.useEffect(() => {
    toggleModel();
  }, [visible]);

  const toggleModel = () => {
    if (visible == '0') {
      setWarningModel(false);
    } else {
      setWarningModel(true);
    }
  };

  const [warningModel, setWarningModel] = useState(visible);

  return (
    <Modal transparent visible={warningModel} animationType="fade">
      <View
        style={{ alignSelf: 'center', end: 5, width: '100%', height: '100%' }}>
        <View>{children}</View>
      </View>
    </Modal>
  );
};

export function Group({ navigation }) {
  async function n() {
    var userJsonText = await AsyncStorage.getItem('user');
    var fromUserObject = JSON.parse(userJsonText);
    setUserImage(fromUserObject.profile_url);
  }
  const [userImage, setUserImage] = useState(
    'http://YOUR_LOCAL_IP/geochat/upload/0771112223.jpeg',
  );

  const [items, setItems] = useState([]);

  const [name, setName] = useState('0');
  const [id, setId] = useState('0');
  const [visible, setVisible] = React.useState('0');

  async function loadFriendList(text) {
    var userJsonText = await AsyncStorage.getItem('user');
    const formData = new FormData();
    formData.append('userJSONText', userJsonText);
    formData.append('text', '');

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        setItems(JSON.parse(request.responseText));
      }
      {
      }
    };
    request.open(
      'POST',
      'http://YOUR_LOCAL_IP/geochat/load_group.php',
      true,
    );
    request.send(formData);
  }
  const ui = (
    <SafeAreaView style={styles.home}>
      <StatusBar
        hidden={false}
        backgroundColor="#fffffa"
        barStyle="dark-content"
        translucent={true}
      />
      <Animatable.View
        style={styles.homeView1}
        animation={'zoomInUp'}
        duration={1200}
        delay={500}>
        <Text style={styles.homeText}>Group</Text>
        <Image
          source={{ uri: 'http://YOUR_LOCAL_IP' + userImage }}
          style={styles.homeImg1}
          resizeMode={'contain'}
        />
      </Animatable.View>
      <Animatable.View
        style={styles.homeView2}
        animation={'zoomInUp'}
        delay={500}>
        <TouchableOpacity
          onPress={m}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
          }}>
          <Icon name="search" size={20} color="#464646" style={{ start: 20 }} />
          <Text style={{ start: 20, color: '#464646' }}>Search</Text>
        </TouchableOpacity>
      </Animatable.View>

      <ImgPopUp visible={visible}>
        <StatusBar
          hidden={false}
          backgroundColor="#00000080"
          barStyle="dark-content"
          translucent={true}
        />

        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            start: 5,
            width: '100%',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#00000080',
              width: '100%',
              height: '100%',
              alignItems: 'center',
            }}
            onPress={() => setVisible('0')}
            TouchableOpacity={0}
            activeOpacity={1}>
            <TouchableOpacity
              onPress={imgView}
              style={{
                alignItems: 'center',
                start: 15,
                top: 150,
                width: 250,
                height: 250,
              }}
              TouchableOpacity={0}
              activeOpacity={1}>
              <Image
                source={{ uri: 'http://YOUR_LOCAL_IP' + visible }}
                style={styles.homeImg2}
                resizeMode={'contain'}
              />
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: '#fffffa',
                width: 250,
                height: 40,
                alignSelf: 'center',
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                top: 150,
              }}>
              <TouchableOpacity
                onPress={imgPopUpChat}
                style={styles.imgPopUpBnt}>
                <Lottie
                  source={require('./android/app/src/main/assets/Lottie/chat-icon.json')}
                  autoPlay={true}
                  style={{ height: 35 }}
                  loop={false}
                  duration={4000}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.imgPopUpBnt}
                onPress={GroupDetails}>
                <Lottie
                  source={require('./android/app/src/main/assets/Lottie/12469-information-icon.json')}
                  autoPlay={true}
                  style={{ height: 40 }}
                  loop={false}
                  duration={2000}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </ImgPopUp>

      <View
        style={
          items == ''
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
          delay={2000}>
          You are not in any Groups
        </Animatable.Text>
      </View>

      <FlatList data={items} renderItem={ItemUI} />

      <View style={styles.groupCreateView}>
        <TouchableOpacity
          style={styles.groupCreateBtn}
          onPress={groupCreatePage}>
          <Icon name="add-outline" size={30} color="#fffffa" />
        </TouchableOpacity>
      </View>

      <View style={styles.homeView3}>
        <TouchableOpacity style={styles.homeView4} onPress={PostPage}>
          <Lottie
            source={require('./android/app/src/main/assets/Lottie/home.json')}
            autoPlay={false}
            style={{ height: 35 }}
            loop={false}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeView4} onPress={HomePage}>
          <Lottie
            source={require('./android/app/src/main/assets/Lottie/chat-icon.json')}
            autoPlay={true}
            style={{ height: 35 }}
            loop={false}
            duration={500}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeView4}>
          <Lottie
            source={require('./android/app/src/main/assets/Lottie/group.json')}
            autoPlay={true}
            style={{ height: 35 }}
            loop={false}
            duration={3500}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  function ItemUI({ item, index }) {
    const ui = (
      <Animatable.View animation={'fadeInUp'} duration={1500} delay={500}>
        <TouchableOpacity onPress={m}>
          <View style={styles.item}>
            <TouchableOpacity onPress={pic}>
              <Image
                source={{ uri: 'http://YOUR_LOCAL_IP' + `${item.pic}` }}
                style={styles.itemImage}
                resizeMode={'contain'}
              />
            </TouchableOpacity>

            <View style={styles.itemView1}>
              <Text style={styles.itemText1}>{item.name}</Text>
              {item.msgStatus == '1' ? (
                <Text style={styles.itemText2}>{item.msg}</Text>
              ) : item.msgStatus == '2' ? (
                <Icon name="image" size={15} color="black" />
              ) : (
                ''
              )}
            </View>
            <View style={styles.itemView2}>
              <Text style={styles.itemText3}>{item.time}</Text>
              <View
                style={0 < item.count ? styles.itemShape1 : styles.itemShape2}>
                <Text style={styles.itemText4}>{item.count}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );

    return ui;

    function m() {
      const obj = {
        name: item.name,
        id: item.id,
        img: item.pic,
      };
      navigation.navigate('GroupChat', obj);
    }

    function pic() {
      setVisible(item.pic);
      setName(item.name);
      setId(item.id);
    }
  }

  function start() {
    loadFriendList();
  }

  function GroupDetails() {
    const obj = {
      name: name,
      id: id,
      img: visible,
    };

    navigation.navigate('GroupUserDetails', obj);
    setVisible('0');
  }

  function m() {
    navigation.navigate('GroupSearch');
  }

  function HomePage() {
    navigation.navigate('Home');
  }

  function userimg() {
    n();
  }

  function groupCreatePage() {
    navigation.navigate('CreateGroup');
  }

  function PostPage() {
    navigation.navigate('PostView');
  }

  function imgView() {
    // Alert.alert("Message","Success");
    const obj = {
      imgage: visible,
    };
    navigation.navigate('ChatImage', obj);
    setVisible('0');
  }

  function imgPopUpChat() {
    const obj = {
      name: name,
      id: id,
      img: visible,
    };
    navigation.navigate('GroupChat', obj);

    setVisible('0');
  }

  useEffect(userimg, []);

  useEffect(start, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadFriendList();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return ui;
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fffffa',
    gap: 10,
  },
  homeView1: {
    flexDirection: 'row',
    width: '100%',
    height: 65,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  homeText: {
    color: '#2e2e2e',
    fontSize: 20,
    start: 15,
  },
  homeImg1: {
    width: 45,
    height: 45,
    borderRadius: 50,
    end: 15,
  },
  homeTextInput1: {
    width: '80%',
    height: 50,
    // backgroundColor: 'red',
    fontSize: 20,
    paddingStart: 5,
  },
  homeView2: {
    width: '95%',
    height: 50,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    borderRadius: 20,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  homeView3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 60,
    backgroundColor: '#fffffa',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  homeView4: {
    // backgroundColor: 'red',
    width: '32%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBar: {
    backgroundColor: 'red',
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 10,
    width: '100%',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  itemText1: {
    fontSize: 18,
    color: '#2e2e2e',
    paddingBottom: 5,
  },
  itemText2: {
    fontSize: 16,
    color: '#9E9F9F',
  },
  itemText3: {
    fontSize: 14,
    color: '#5a6b75',
    paddingBottom: 5,
  },
  itemText4: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  itemShape1: {
    width: 24,
    height: 24,
    backgroundColor: '#2675EC',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemShape2: {
    width: 0,
    height: 0,
  },
  itemView1: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '56%',
  },
  itemView2: {
    alignItems: 'flex-end',
    width: '26%',
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
  groupCreateView: {
    width: '100%',
    height: 50,
    alignItems: 'flex-end',
    end: 15,
  },
  groupCreateBtn: {
    width: 50,
    height: 50,
    backgroundColor: '#2D86FF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeImg2: {
    width: 250,
    height: 250,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    end: 15,
  },
  imgPopUpBnt: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
