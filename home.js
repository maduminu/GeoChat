import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {StatusBar} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Lottie from 'lottie-react-native';

const ImgPopUp = ({visible, children}) => {
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
        style={{alignSelf: 'center', end: 5, width: '100%', height: '100%'}}>
        <View>{children}</View>
      </View>
    </Modal>
  );
};

export function Home({navigation, route}) {
  StatusBar.setHidden(false, 'slide');

  async function n() {
    var userJsonText = await AsyncStorage.getItem('user');
    var fromUserObject = JSON.parse(userJsonText);
    setUserImage(fromUserObject.profile_url);
    setMobileNumber(fromUserObject.mobile);
    setName(fromUserObject.name);
    setLoguserContry(fromUserObject.country_id);
    setUserId(fromUserObject.id);
    setAbout(fromUserObject.about);
    // Alert.alert(name);
  }

  function profile_url() {
    setInterval(n, 2000);
  }

  useEffect(profile_url, []);

  const [userImage, setUserImage] = useState(
    'http://YOUR_LOCAL_IP/geochat/upload/0771112223.jpeg',
  );

  const [mobileNumber, setMobileNumber] = useState();
  const [mobileNumber2, setMobileNumber2] = useState();

  const [name, setName] = useState('0');
  const [name2, setName2] = useState('0');
  const [id, setId] = useState('0');
  const [userId, setUserId] = useState();
  const [logUserCountry, setLoguserContry] = useState();
  const [visible, setVisible] = React.useState('0');
  const [about, setAbout] = useState('0');
  const [about2, setAbout2] = useState('0');

  const [Contry, setContry] = useState();

  const [items, setItems] = useState([]);

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
      'http://YOUR_LOCAL_IP/geochat/load_user.php',
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
        delay={500}>
        <Text style={styles.homeText}>Message</Text>
        <Image
          source={{uri: 'http://YOUR_LOCAL_IP' + userImage}}
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
          <Icon name="search" size={20} color="#464646" style={{start: 20}} />
          <Text style={{start: 20, color: '#464646'}}>Search</Text>
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
                source={{uri: 'http://YOUR_LOCAL_IP' + visible}}
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
                  style={{height: 35}}
                  loop={false}
                  duration={4000}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.imgPopUpBnt}
                onPress={UserProfile}>
                <Lottie
                  source={require('./android/app/src/main/assets/Lottie/12469-information-icon.json')}
                  autoPlay={true}
                  style={{height: 40}}
                  loop={false}
                  duration={2000}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </ImgPopUp>

      <Animated.FlatList
        data={items}
        renderItem={ItemUI}
        contentContainerStyle={{gap: 0}}
        decelerationRate={0}
        bounces={false}
        scrollEventThrottle={16}
      />

      <View style={styles.groupCreateView}>
        <TouchableOpacity style={styles.groupCreateBtn} onPress={s}>
          <Icon name="settings-outline" size={28} color="#fffffa" />
        </TouchableOpacity>
      </View>

      <View style={styles.homeView3}>
        <TouchableOpacity style={styles.homeView4} onPress={PostPage}>
          <Lottie
            source={require('./android/app/src/main/assets/Lottie/home.json')}
            autoPlay={false}
            style={{height: 35}}
            loop={false}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeView4}>
          <Lottie
            source={require('./android/app/src/main/assets/Lottie/chat-icon.json')}
            autoPlay={true}
            style={{height: 35}}
            loop={false}
            duration={4000}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeView4} onPress={GroupPage}>
          <Lottie
            source={require('./android/app/src/main/assets/Lottie/group.json')}
            autoPlay={true}
            style={{height: 35}}
            loop={false}
            duration={100}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  function ItemUI({item, index}) {
    const ui = (
      <Animatable.View animation={'fadeInUp'} duration={1500} delay={500}>
        <TouchableOpacity onPress={m}>
          <View style={styles.item}>
            <TouchableOpacity onPress={pic}>
              <Image
                source={{uri: 'http://YOUR_LOCAL_IP' + `${item.pic}`}}
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
      // Alert.alert("Message","Success");
      const obj = {
        name: item.name,
        id: item.id,
        img: item.pic,
        msg: item.msg,
        mobile: item.mobile,
        country: item.country,
      };
      navigation.navigate('Chat', obj);
    }

    function pic() {
      setVisible(item.pic);
      setName2(item.name);
      setId(item.id);
      setMobileNumber2(item.mobile);
      setContry(item.country);
      setAbout2(item.about);
    }
  }

  function UserProfile() {
    const obj = {
      img: visible,
      mobile: mobileNumber2,
      name: name2,
      country: Contry,
      pageId: '2',
      id: id,
      about: about2,
    };

    navigation.navigate('UserProfile', obj);

    setVisible('0');
  }

  function start() {
    loadFriendList();
  }

  function m() {
    const obj = {
      pageId: '1',
    };

    navigation.navigate('Search', obj);
  }

  function imgPopUpChat() {
    const obj = {
      name: name2,
      id: id,
      img: visible,
    };
    navigation.navigate('Chat', obj);

    setVisible('0');
  }

  function imgView() {
    // Alert.alert("Message","Success");
    const obj = {
      imgage: visible,
    };
    navigation.navigate('ChatImage', obj);
    setVisible('0');
  }

  function s() {
    const obj = {
      img: userImage,
      mobile: mobileNumber,
      name: name,
      country: logUserCountry,
      userId: userId,
      about: about,
    };

    navigation.navigate('Setting', obj);
  }

  function GroupPage() {
    navigation.navigate('Group');
  }

  function PostPage() {
    navigation.navigate('PostView');
  }

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
    // marginTop: '10%',
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
  homeImg2: {
    width: 250,
    height: 250,
    // borderRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
  imgPopUpBnt: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
