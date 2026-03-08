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
  Modal,
  BackHandler,
  ImageBackground,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {StatusBar} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Lottie from 'lottie-react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {LogBox} from 'react-native';

const Up = ({visible, children, setVisible}) => {
  React.useEffect(() => {
    toggleModel();
  }, [visible]);

  const toggleModel = () => {
    if (visible == '2') {
      setWarningModel(true);
    } else {
      setWarningModel(false);
    }
  };

  const [warningModel, setWarningModel] = useState(visible);

  return (
    <Modal transparent visible={warningModel} animationType="slide">
      <View style={{alignSelf: 'center', width: '100%', height: 680, top: 110}}>
        <View>{children}</View>
      </View>
    </Modal>
  );
};

const UseDetails = ({visible, children, setVisible}) => {
  React.useEffect(() => {
    toggleModel();
  }, [visible]);

  const toggleModel = () => {
    if (visible == '2') {
      if (detailsModel) {
        setDetailsModel(true);
      } else {
        setDetailsModel(false);
      }
    } else {
      if (visible == '1') {
        setDetailsModel(true);
      } else {
        setDetailsModel(false);
      }
    }
  };

  const [detailsModel, setDetailsModel] = useState(visible);

  return (
    <Modal transparent visible={detailsModel} animationType="fade">
      <View style={{alignSelf: 'center', top: 10, width: '100%', height: 680}}>
        <View>{children}</View>
      </View>
    </Modal>
  );
};

export function UserProfile({navigation, route}) {
  LogBox.ignoreAllLogs(true);
  const [items, setItems] = useState([]);
  const [mobile, setMobile] = useState('null');
  const [about, setAbout] = useState('null');
  const [name, setName] = useState('null');
  const [profileImage, setProfileImage] = useState(route.params.img);
  const [profileImageUrl, setProfileImageUrl] = useState(
    'http://YOUR_LOCAL_IP' + route.params.img,
  );
  const [country, setContry] = useState('');
  const [countries, setCountries] = useState(['']);
  const [postCount, setPostCount] = useState();
  const [likeCount, setLikeCount] = useState();

  const [visible, setVisible] = React.useState('0');

  const image = {uri: 'http://YOUR_LOCAL_IP/geochat/upload/background.jpg'};

  async function loadPost(text) {
    var userJsonText = await AsyncStorage.getItem('user');
    var userJsonObject = JSON.parse(userJsonText);
    const formData = new FormData();

    if (route.params.pageId == '1') {
      formData.append('userId', userJsonObject.id);
      formData.append('id', '1');
    } else {
      formData.append('userId', route.params.id);
      formData.append('userId2', userJsonObject.id);
      formData.append('id', '2');
    }

    formData.append('pageId', '2');

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        setItems(JSON.parse(request.responseText));
        // Alert.alert("",request.responseText);
        // Alert.alert('', items[0].post);
        // let numeroRandomico = items[0].post;
        // numeroRandomico = Math.floor(numeroRandomico * 10);
        // numeroRandomico = String(numeroRandomico);
        // Alert.alert(numeroRandomico);
        // setPostCount(numeroRandomico);
      }
      {
      }
    };
    request.open('POST', 'http://YOUR_LOCAL_IP/geochat/post.php', true);
    request.send(formData);
  }

  function loadCountries() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        var countryArray = JSON.parse(request.responseText);
        setCountries(countryArray);
      }
    };
    request.open(
      'GET',
      'http://YOUR_LOCAL_IP/geochat/loadCountry.php',
      true,
    );
    request.send();
  }

  const ui = (
    <SafeAreaView style={styles.home}>
      <StatusBar
        hidden={false}
        backgroundColor="#fffffc"
        barStyle="dark-content"
        translucent={true}
      />
      <View style={styles.homeView1}>
        <View
          style={{
            height: 25,
            bottom: 22,
            flexDirection: 'row',
            justifyContent: 'space-between',
            end: 5,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="md-arrow-back-outline" size={22} color="black" />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 22,
              color: 'black',
              end: route.params.pageId == '1' ? 0 : 155,
            }}>
            profile
          </Text>

          {route.params.pageId == '1' ? (
            <TouchableOpacity onPress={() => setVisible('2')}>
              <Text style={{color: '#2D86FF', fontSize: 20, end: 20}}>
                Edit
              </Text>
            </TouchableOpacity>
          ) : (
            ''
          )}
        </View>

        <View
          style={{
            backgroundColor: '#ffffff',
            width: '100%',
            height: 140,
            top: -5,
          }}>
          <View>
            <ImageBackground
              source={image}
              resizeMode="cover"
              style={{
                width: '100%',
                height: 140,
                borderRadius: 20,
                end: 10,
                bottom: 20,
              }}
              imageStyle={{
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
              }}></ImageBackground>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0,
            top: 125,
            position: 'absolute',
            start: 10,
          }}>
          <Animatable.View
            style={{
              backgroundColor: '#fffffc',
              borderRadius: 50,
              width: 84,
              height: 84,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={{uri: 'http://YOUR_LOCAL_IP' + route.params.img}}
              style={styles.homeImg1}
            />
          </Animatable.View>

          <Animatable.View>
            <Text style={styles.text2}>{route.params.name}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <Text style={styles.text5}>Post</Text>
              <Text style={styles.text5}>{postCount}</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <Text style={styles.text5}>Like</Text>
              <Text style={styles.text5}>{likeCount}</Text>
            </View>
          </Animatable.View>
        </View>
      </View>

      <UseDetails visible={visible}>
        <View
          style={{
            width: 360,
            height: 50,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{width: 40, height: 30}}
            onPress={() => (
              setVisible('1'), navigation.goBack()
            )}></TouchableOpacity>

          <TouchableOpacity
            style={{width: 40, height: 30}}
            onPress={() => setVisible('2')}></TouchableOpacity>
        </View>

        <View
          style={{backgroundColor: 'white', height: '100%', top: 200, gap: 10}}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', bottom: 32}}>
            <Animatable.Text duration={1500} style={styles.postTitleText}>
              User Details
            </Animatable.Text>

            <TouchableOpacity>
              <Animatable.Text
                duration={1500}
                style={styles.postTitleText3}
                onPress={() => setVisible('3')}>
                Post
              </Animatable.Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{width: '100%', backgroundColor: '#f9f9f9', gap: 5}}
            contentContainerStyle={{justifyContent: 'center'}}>
            <View style={styles.userDetailsView} elevation={5}>
              <View style={styles.userDetailsView2}>
                <View style={styles.iconShape2} elevation={4}>
                  <Icon name="person-outline" size={25} color="white" />
                </View>

                <Text style={styles.userDetailsText}>{route.params.name}</Text>
              </View>
            </View>

            <View style={styles.userDetailsView} elevation={5}>
              <View style={styles.userDetailsView2}>
                <View style={styles.iconShape2} elevation={4}>
                  <Icon name="phone-portrait-outline" size={20} color="white" />
                </View>

                <Text style={styles.userDetailsText}>
                  {route.params.mobile}
                </Text>
              </View>
            </View>

            <View style={styles.userDetailsView} elevation={5}>
              <View style={styles.userDetailsView2}>
                <View style={styles.iconShape2} elevation={4}>
                  <Icon name="flag-outline" size={20} color="white" />
                </View>

                <Text style={styles.userDetailsText}>
                  {route.params.country == '1'
                    ? 'Sri Lanka'
                    : route.params.country == '2'
                    ? 'India'
                    : route.params.country == '3'
                    ? 'America'
                    : route.params.country == '4'
                    ? 'Dubai'
                    : ''}
                </Text>
              </View>
            </View>

            <View style={styles.userDetailsView} elevation={5}>
              <View style={styles.userDetailsView2}>
                <View style={styles.iconShape2} elevation={4}>
                  <Icon name="information-outline" size={25} color="white" />
                </View>

                <Text style={styles.userDetailsText}>{route.params.about}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </UseDetails>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row', gap: 15}}>
          <TouchableOpacity onPress={() => setVisible('1')}>
            <Animatable.Text duration={1500} style={styles.postTitleText4}>
              User Details
            </Animatable.Text>
          </TouchableOpacity>
          <Animatable.Text duration={1500} style={styles.postTitleText}>
            Post
          </Animatable.Text>
        </View>

        {route.params.pageId == '1' ? (
          <TouchableOpacity onPress={AddPostPage}>
            <Text style={styles.postTitleText2}>Add New</Text>
          </TouchableOpacity>
        ) : (
          ''
        )}
      </View>

      <Up visible={visible}>
        <View
          style={{
            alignSelf: 'center',
            width: '100%',
            height: 680,
            backgroundColor: '#ffffff',
            borderRadius: 20,
            gap: 10,
            paddingTop: 15,
          }}
          elevation={7}>
          <Image
            source={{
              uri: 'http://YOUR_LOCAL_IP/react_chat/image/background5.jpg',
            }}
            style={[StyleSheet.absoluteFill, {borderRadius: 20}]}
            blurRadius={0}
          />

          <View
            style={{
              height: 30,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Icon
                name="md-arrow-back-outline"
                size={22}
                color="black"
                style={{start: 10}}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={updateUser}>
              <Text style={{color: '#2D86FF', fontSize: 20, end: 20}}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              width: 150,
              height: 150,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}
            activeOpacity={0.7}
            onPress={selectProfilePicture}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                backgroundColor: '#00000080',
                width: 120,
                height: 120,
                borderRadius: 100,
              }}>
              <Icon name="camera-outline" size={40} color="#ffffff" />
            </View>

            {route.params.img == profileImage ? (
              <Image
                source={{uri: 'http://YOUR_LOCAL_IP' + profileImage}}
                style={{width: 120, height: 120, borderRadius: 100, zIndex: -1}}
              />
            ) : (
              <Image
                source={{uri: profileImageUrl}}
                style={{width: 120, height: 120, borderRadius: 100, zIndex: -1}}
              />
            )}
          </TouchableOpacity>

          <View style={styles.textinputView}>
            <Icon
              name="person-outline"
              size={20}
              secureTextEntry={true}
              color={'#555555'}
            />
            <TextInput
              style={styles.textInput}
              placeholder={route.params.name}
              placeholderTextColor={'#9d9d9d'}
              onChangeText={setName}
            />
          </View>

          <View style={styles.textinputView}>
            <Icon
              name="phone-portrait-outline"
              size={20}
              secureTextEntry={true}
              color={'#555555'}
            />
            <TextInput
              style={styles.textInput}
              placeholder={route.params.mobile}
              placeholderTextColor={'#9d9d9d'}
              onChangeText={setMobile}
              autoCorrect={false}
              inputMode={'numeric'}
              maxLength={10}
            />
          </View>

          <View style={styles.textinputView}>
            <Icon
              name="information-outline"
              size={22}
              secureTextEntry={true}
              color={'#555555'}
            />
            <TextInput
              style={styles.textInput}
              placeholder={route.params.about}
              placeholderTextColor={'#9d9d9d'}
              onChangeText={setAbout}
              autoCorrect={false}
            />
          </View>

          <View style={styles.textinputView}>
            <SelectDropdown
              data={countries}
              onSelect={setContry}
              dropdownStyle={{borderRadius: 20}}
              buttonStyle={{
                borderRadius: 20,
                width: '85%',
                backgroundColor: '#f3f3f3',
              }}
            />
          </View>
        </View>
      </Up>

      <FlatList
        data={items}
        renderItem={ItemUI}
        contentContainerStyle={{gap: 10}}
        style={{}}
      />
    </SafeAreaView>
  );

  function ItemUI({item, index}) {
    const ui = (
      <Animatable.View
        style={{width: '100%', gap: 10, alignItems: 'center'}}
        animation={'fadeInUp'}
        duration={1500}>
        {setPostCount(item.post)}
        {setLikeCount(item.like)}
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
              <Text style={styles.itemText1}>{route.params.name}</Text>
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
          // Alert.alert(request.responseText);
        }
        {
        }
      };
      request.open(
        'POST',
        'http://YOUR_LOCAL_IP/react_chat/postStatus.php',
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
          // Alert.alert(request.responseText);
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
      setProfileImageUrl(imageObject.uri);
    }
  }

  async function updateUser() {
    const formData = new FormData();
    var userJsonText = await AsyncStorage.getItem('user');
    var userJsonObject = JSON.parse(userJsonText);
    formData.append('userId', userJsonObject.id);
    formData.append('name', name);
    formData.append('mobile', mobile);
    formData.append('about', about);

    if (country) {
      formData.append('Contry', country);
      formData.append('countryType', '1');
    } else {
      formData.append('Contry', userJsonObject.country_id);
      formData.append('countryType', '2');
    }

    if (profileImage == route.params.img) {
      formData.append('img', profileImage);
      formData.append('imgType', '1');
    } else {
      formData.append('img', profileImage);
      formData.append('imgType', '2');
    }

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        var jsonResponceText = request.responseText;
        var jsResponceObject = JSON.parse(jsonResponceText);
        var userObject = jsResponceObject.user;
        AsyncStorage.setItem('user', JSON.stringify(userObject));

        setVisible(false);

        navigation.navigate('Home');
      }
    };
    request.open(
      'POST',
      'http://YOUR_LOCAL_IP/geochat/profileUpdate.php',
      true,
    );
    request.send(formData);
  }

  function AddPostPage() {
    navigation.navigate('AddPost');
  }

  function start() {
    loadPost();
  }

  function loadCountrieStart() {
    loadCountries();
  }
  useEffect(loadCountrieStart, []);

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
    backgroundColor: '#ffffff',
    gap: 45,
  },
  homeView1: {
    width: '100%',
    height: 220,
    paddingBottom: 40,
    alignSelf: 'center',
    borderRadius: 10,
    top: 70,
    gap: 15,
    start: 10,
  },
  homeImg1: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  backIcon: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    height: 25,
    alignItems: 'center',
    start: 10,
    flexDirection: 'row',
  },
  logOutButton: {
    alignItems: 'center',
    start: 10,
    backgroundColor: '#ffffff',
    width: 120,
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#2D86FF',
    top: 10,
  },
  profileButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: '100%',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 18,
    color: '#555555',
  },
  text1: {
    fontSize: 15,
    color: '#2D86FF',
  },
  text2: {
    fontSize: 20,
    color: 'black',
    top: 12,
    fontWeight: '500',
  },
  text3: {
    fontSize: 35,
    color: 'black',
    start: 10,
    top: 10,
  },
  text4: {
    fontSize: 18,
    color: 'red',
  },
  text5: {
    fontSize: 12,
    color: '#555555',
    top: 10,
  },
  iconShape: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#cdcdcd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconShape2: {
    backgroundColor: '#2D86FF',
    borderRadius: 100,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 34,
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
  itemText2: {
    fontSize: 20,
    color: '#2e2e2e',
    fontFamily: 'Dancing Script',
  },
  textinputView: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 25,
    width: '95%',
    alignSelf: 'center',
  },
  textInput: {
    width: '85%',
    height: 50,
    color: 'black',
    borderStyle: 'solid',
    borderBottomColor: 'black',
    borderRadius: 25,
    paddingStart: 30,
    fontSize: 18,
  },
  postTitleText: {
    alignSelf: 'flex-start',
    fontSize: 22,
    color: 'black',
    fontWeight: '400',
    top: 28,
    start: 5,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 0,
    borderBottomColor: '#2D86FF',
  },
  postTitleText2: {
    fontSize: 22,
    color: 'black',
    fontWeight: '400',
    top: 28,
    end: 10,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 0,
    borderBottomColor: '#2D86FF',
  },
  postTitleText3: {
    alignSelf: 'flex-start',
    fontSize: 22,
    color: 'black',
    fontWeight: '400',
    top: 28,
    start: 20,
  },
  postTitleText4: {
    alignSelf: 'flex-start',
    fontSize: 22,
    color: 'black',
    fontWeight: '400',
    top: 28,
    start: 4,
  },
  userDetailsText: {
    fontSize: 22,
    color: '#737373',
  },
  userDetailsView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'white',
    height: 80,
  },
  userDetailsView2: {
    flexDirection: 'row',
    start: 5,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
