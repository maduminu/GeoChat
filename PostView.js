import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusBar} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Lottie from 'lottie-react-native';

export function PostView({navigation, route}) {
  StatusBar.setHidden(false, 'slide');

  const [items, setItems] = useState([]);

  async function loadPost(text) {
    var userJsonText = await AsyncStorage.getItem('user');
    var userJsonObject = JSON.parse(userJsonText);
    const formData = new FormData();
    formData.append('userId', userJsonObject.id);
    formData.append('pageId', '1');
    formData.append('id', '1');

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        setItems(JSON.parse(request.responseText));
        // Alert.alert(request.responseText);
      }
      {
      }
    };
    request.open('POST', 'http://YOUR_LOCAL_IP/geochat/post.php', true);
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
      <View style={styles.homeView1}>
        <Animatable.Text
          style={styles.homeText}
          animation="zoomInUp"
          duration={1200}
          delay={0}>
          Posts
        </Animatable.Text>
      </View>
      <FlatList
        data={items}
        renderItem={ItemUI}
        contentContainerStyle={{gap: 10}}
      />
      <View style={styles.groupCreateView}>
        <TouchableOpacity style={styles.PostPageBtn} onPress={AddPostPage}>
          <Icon name="add" size={30} color="#fffffa" />
        </TouchableOpacity>
      </View>
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.homeView4}>
          <Lottie
            source={require('./android/app/src/main/assets/Lottie/home.json')}
            autoPlay={true}
            style={{height: 35}}
            loop={false}
            duration={2000}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeView4} onPress={HomePage}>
          <Lottie
            source={require('./android/app/src/main/assets/Lottie/chat-icon.json')}
            autoPlay={true}
            style={{height: 35}}
            loop={false}
            duration={500}
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
      <Animatable.View
        style={{width: '100%', gap: 10, alignItems: 'center'}}
        animation={'fadeInUp'}
        duration={1000}
        delay={index * 400}>
        <View
          style={{width: '95%', flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              width: 250,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <Image
              source={{uri: 'http://YOUR_LOCAL_IP' + `${item.profilePic}`}}
              style={styles.userImage}
            />

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: '100%',
              }}>
              <Text style={styles.itemText1}>{item.useName}</Text>
            </View>

            <TouchableOpacity onPress={share}>
              <Icon
                name="share-social-outline"
                size={25}
                color="black"
                style={{start: 20}}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={img}
          style={{width: '100%', height: 450}}
          TouchableOpacity={0}
          activeOpacity={1}>
          <Image
            source={{uri: 'http://YOUR_LOCAL_IP' + `${item.pic}`}}
            style={styles.itemImage}
            resizeMode={'cover'}
          />
        </TouchableOpacity>

        <View style={styles.homeView3}>
          <TouchableOpacity
            style={styles.homeView5}
            onPress={postStatusLike}
            onLongPress={postStatusHeart}>
            {item.postStatus == '1' ? (
              <Lottie
                source={require('./android/app/src/main/assets/Lottie/facebook-like.json')}
                autoPlay={true}
                style={{
                  height: 30,
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
                loop={false}
                duration={2000}
              />
            ) : item.postStatus == '3' ? (
              <Lottie
                source={require('./android/app/src/main/assets/Lottie/heart.json')}
                autoPlay={true}
                style={{
                  height: 60,
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
                loop={false}
                duration={2000}
              />
            ) : (
              <Icon
                name={'thumbs-up-outline'}
                size={25}
                color={'black'}
                style={{start: 10}}
              />
            )}
            <Text
              style={{
                textAlign: 'center',
                fontSize: 15,
                color:
                  item.postStatus == '1'
                    ? '#2D86FF'
                    : item.postStatus == '3'
                    ? '#FD607A'
                    : 'black',
                end:
                  item.postStatus == '1' ? 10 : item.postStatus == 3 ? 10 : -10,
              }}>
              {item.PostLikeCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeView5} onPress={m}>
            <Icon
              name="chatbubble-ellipses-outline"
              size={25}
              color={
                item.postStatus == '1'
                  ? '#2D86FF'
                  : item.postStatus == '3'
                  ? '#FD607A'
                  : '#2e2e2e'
              }
              style={{
                end:
                  item.postStatus == '1' ? 0 : item.postStatus == 3 ? 0 : -25,
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={{width: '95%', justifyContent: 'center', bottom: 28}}>
          <Text style={styles.itemText2}>{'#' + item.name}</Text>
          <Text style={{color: 'black', fontSize: 10}}>{item.time}</Text>
        </View>
      </Animatable.View>
    );

    return ui;

    function m() {
      const obj = {
        postId: item.id,
      };
      navigation.navigate('PostChat', obj);
    }

    function share() {
      const obj = {
        img: item.pic,
        pageId: '3',
      };
      navigation.navigate('Search', obj);

      // Alert.alert(item.pic);
    }

    async function postStatusLike() {
      var userJsonText = await AsyncStorage.getItem('user');
      var userJsonObject = JSON.parse(userJsonText);
      const formData = new FormData();
      formData.append('userId', userJsonObject.id);
      formData.append('postId', item.id);
      formData.append('postStatus', item.postStatus);
      formData.append('longPress', '1');

      var request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
        }
        {
        }
      };
      request.open(
        'POST',
        'http://YOUR_LOCAL_IP/geochat/postStatus.php',
        true,
      );
      request.send(formData);
    }

    async function postStatusHeart() {
      var userJsonText = await AsyncStorage.getItem('user');
      var userJsonObject = JSON.parse(userJsonText);
      const formData = new FormData();
      formData.append('userId', userJsonObject.id);
      formData.append('postId', item.id);
      formData.append('postStatus', item.postStatus);
      formData.append('longPress', '2');

      var request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
        }
        {
        }
      };
      request.open(
        'POST',
        'http://YOUR_LOCAL_IP/geochat/postStatus.php',
        true,
      );
      request.send(formData);
    }

    function img() {
      // Alert.alert("Message","Success");
      const obj = {
        imgage: item.pic,
        pageId: '3',
      };
      navigation.navigate('ChatImage', obj);
    }
  }

  function start() {
    loadPost();
  }

  function HomePage() {
    navigation.navigate('Home');
  }

  function GroupPage() {
    navigation.navigate('Group');
  }

  function AddPostPage() {
    navigation.navigate('AddPost');
  }

  useEffect(start, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadPost();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return ui;
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
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
    fontSize: 20,
    paddingStart: 5,
  },
  homeView2: {
    width: '95%',
    height: 50,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    borderRadius: 20,
    alignItems: 'center',
  },
  homeView3: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    backgroundColor: '#fffffa',
    paddingHorizontal: 20,
    paddingVertical: 10,
    // justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
    // start:10
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 60,
    backgroundColor: '#fffffa',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  homeView4: {
    width: '32%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 0,
    // start:-20
  },
  homeView5: {
    // width: '32%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 0,
    // start:-20
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  itemImage: {
    flex: 1,
  },
  itemText1: {
    fontSize: 18,
    color: '#2e2e2e',
    paddingHorizontal: 5,
  },
  itemText2: {
    fontSize: 20,
    color: '#2e2e2e',
    fontFamily: 'Dancing Script',
  },
  PostPageBtn: {
    width: 50,
    height: 50,
    backgroundColor: '#2D86FF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupCreateView: {
    width: '100%',
    height: 50,
    alignItems: 'flex-end',
    end: 15,
  },
});
