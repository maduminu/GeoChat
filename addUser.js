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
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';

export function AddUSer({ navigation, route }) {
  StatusBar.setHidden(false, 'slide');

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
        // navigation.navigate('Home');
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
      <TouchableOpacity
        onPress={GroupDetails}
        style={{
          flexDirection: 'row',
          width: '100%',
          height: 100,
          alignItems: 'center',
          gap: 5,
          start: 10,
          marginTop: 20,
        }}>
        <Icon name="md-arrow-back-outline" size={25} color={'black'} />
        <Image
          source={{ uri: 'http://YOUR_LOCAL_IP' + route.params.img }}
          style={styles.itemImage}
        />
        <Text style={styles.itemText1}>{route.params.name}(Add new Users)</Text>
      </TouchableOpacity>

      <FlatList data={items} renderItem={ItemUI} />
    </SafeAreaView>
  );

  function ItemUI({ item, index }) {
    const ui = (
      <TouchableOpacity onPress={m}>
        <Animatable.View
          style={styles.item}
          animation={'fadeInUp'}
          duration={1000}
          delay={index * 300}>
          <Image
            source={{ uri: 'http://YOUR_LOCAL_IP' + `${item.pic}` }}
            style={styles.itemImage}
          />
          <View style={styles.itemView1}>
            <Text style={styles.itemText1}>{item.name}</Text>
            {item.msgStatus == '1' ? (
              <Text style={styles.itemText2}>{item.msg}</Text>
            ) : (
              <Icon name="image" size={15} color="black" />
            )}
          </View>
          <View style={styles.itemView2}>
            <Text style={styles.itemText3}>{item.time}</Text>
            <View
              style={0 < item.count ? styles.itemShape1 : styles.itemShape2}>
              <Text style={styles.itemText4}>{item.count}</Text>
            </View>
          </View>
        </Animatable.View>
      </TouchableOpacity>
    );

    return ui;

    function m() {
      var form = new FormData();
      form.append('userId', item.id);
      form.append('groupId', route.params.id);

      var request = new XMLHttpRequest();

      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          if (request.responseText == 'This User is Already in the group') {
            Alert.alert('Message', request.responseText);
          } else {
            const obj = {
              name: route.params.name,
              id: route.params.id,
              img: route.params.img,
            };

            navigation.navigate('GroupUserDetails', obj);
          }
        }
      };
      request.open(
        'POST',
        'http://YOUR_LOCAL_IP/geochat/addUser.php',
        true,
      );
      request.send(form);
    }
  }

  function start() {
    loadFriendList();
  }

  function GroupDetails() {
    const obj = {
      name: route.params.name,
      id: route.params.id,
      img: route.params.img,
    };

    navigation.navigate('GroupUserDetails', obj);
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
    backgroundColor: '#fffffa',
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
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
  },
});
