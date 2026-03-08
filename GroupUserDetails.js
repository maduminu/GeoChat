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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {StatusBar} from 'react-native';
import * as Animatable from 'react-native-animatable';

export function GroupUserDetails({navigation, route}) {
  const [items, setItems] = useState([]);

  async function loadGroupUser() {
    const formData = new FormData();
    var userJsonText = await AsyncStorage.getItem('user');
    var userJsonObject = JSON.parse(userJsonText);
    formData.append('logUer', userJsonObject.id);
    formData.append('Groupid', route.params.id);

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
      'http://YOUR_LOCAL_IP/geochat/group_user_details.php',
      true,
    );
    request.send(formData);
  }
  const ui = (
    <SafeAreaView style={styles.home}>
      <StatusBar
        hidden={false}
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent={true}
      />
      <Image
        source={{uri: 'http://YOUR_LOCAL_IP/geochat/image/background5.jpg'}}
        style={StyleSheet.absoluteFill}
        blurRadius={0}
      />
      <View style={styles.homeView1}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backIcon}>
          <Icon name="md-arrow-back-outline" size={25} color="black" />
        </TouchableOpacity>
        <Image
          source={{uri: 'http://YOUR_LOCAL_IP' + route.params.img}}
          style={styles.homeImg1}
        />
        <Text style={styles.homeText}>{route.params.name}</Text>
      </View>
      <TouchableOpacity
        style={{
          width: '100%',
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          borderBottomWidth: 0.2,
        }}
        onPress={Adduser}>
        <Animatable.View
          style={styles.item2}
          animation={'zoomInUp'}
          duration={1200}
          delay={500}>
          <View
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#2D86FF',
              borderRadius: 100,
            }}>
            <Icon
              name="person-add-outline"
              size={25}
              color="#ffffffff"
              style={{end: 1}}
            />
          </View>
          <View style={styles.itemView1}>
            <Text style={styles.itemText1}>Add New Participants</Text>
          </View>
        </Animatable.View>
      </TouchableOpacity>
      <FlatList
        data={items}
        renderItem={ItemUI}
        style={{width: '100%', borderRadius: 50}}
      />
    </SafeAreaView>
  );

  function ItemUI({item, index}) {
    const ui = (
      <TouchableOpacity onPress={m}>
        <Animatable.View
          style={styles.item}
          animation={'fadeInUp'}
          duration={1000}
          delay={index * 300}>
          <Image
            source={{uri: 'http://YOUR_LOCAL_IP' + `${item.pic}`}}
            style={styles.itemImage}
          />
          <View style={styles.itemView1}>
            <Text style={styles.itemText1}>{item.name}</Text>
          </View>
        </Animatable.View>
      </TouchableOpacity>
    );

    return ui;

    function m() {
      const obj = {
        name: item.name,
        id: item.id,
        img: item.pic,
      };
      navigation.navigate('Chat', obj);
    }
  }

  function start() {
    loadGroupUser();
  }

  function Adduser() {
    const obj = {
      name: route.params.name,
      id: route.params.id,
      img: route.params.img,
    };

    navigation.navigate('AddUSer', obj);
  }

  useEffect(start, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadGroupUser();
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
    gap: 20,
    // marginTop: 30,
  },
  homeView1: {
    width: '100%',
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'transparent',
  },
  homeText: {
    color: '#2e2e2e',
    fontSize: 20,
    fontWeight: '300',
  },
  homeImg1: {
    width: 95,
    height: 95,
    borderRadius: 50,
  },
  homeView3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 60,
    backgroundColor: '#061720',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  homeView4: {
    width: '32%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 10,
    width: '100%',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    start: 10,
  },
  item2: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: '100%',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    // borderRadius: 22,
    // borderWidth: 0.1,
  },
  itemImage: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  itemText1: {
    fontSize: 18,
    color: '#2e2e2e',
    paddingBottom: 5,
  },
  itemView1: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '60%',
  },
  backIcon: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    height: 25,
    alignItems: 'center',
    start: 10,
  },
});
