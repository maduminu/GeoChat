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
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {StatusBar} from 'react-native';
import * as Animatable from 'react-native-animatable';

export function GroupSearch({navigation}) {
  StatusBar.setHidden(false, 'slide');

  const [items, setItems] = useState([]);

  async function loadFriendList(text) {
    var userJsonText = await AsyncStorage.getItem('user');
    const formData = new FormData();
    formData.append('userJSONText', userJsonText);
    formData.append('text', text);

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        setItems(JSON.parse(request.responseText));
        // Alert.alert(request.responseText);
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
        style={styles.homeView2}
        animation={'zoomInUp'}
        duration={1000}
        delay={400}>
        <TouchableOpacity
          onPress={Group}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: 50,
            height: 50,
            borderRadius: 50,
          }}>
          <Icon name="md-arrow-back-outline" size={25} color={'#2e2e2e'} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="search" size={20} color="#e9e9e9" />
        </TouchableOpacity>
        <TextInput
          autoCorrect={false}
          style={styles.homeTextInput1}
          onChangeText={loadFriendList}
          placeholder={'Search'}
          placeholderTextColor={'#8e99a1'}
        />
      </Animatable.View>
      <FlatList data={items} renderItem={ItemUI} />
    </SafeAreaView>
  );

  function ItemUI({item, index}) {
    const ui = (
      <Animatable.View animation={'fadeInUp'} duration={1000} delay={300}>
        <TouchableOpacity onPress={m}>
          <View style={styles.item}>
            <Image
              source={{uri: 'http://YOUR_LOCAL_IP' + `${item.pic}`}}
              style={styles.itemImage}
              resizeMode={'contain'}
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
      };
      navigation.navigate('GroupChat', obj);
    }
  }

  function start() {
    loadFriendList('');
  }

  useEffect(start, []);

  function Group() {
    navigation.navigate('Group');
  }

  return ui;
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fffffa',
    gap: 15,
    // marginTop: '10%',
  },
  homeTextInput1: {
    width: '80%',
    color: '#2e2e2e',
    height: 50,
    fontSize: 20,
    paddingStart: 5,
  },
  homeView2: {
    width: '100%',
    height: 100,
    top: 0,
    backgroundColor: '#fffffa',
    flexDirection: 'row',
    color: 'red',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
    width: 55,
    height: 55,
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
});
