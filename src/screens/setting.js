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
  BackHandler,
  TextInput,
  ImageBackground,
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../api/UserContext';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { API_BASE_URL, HOST_BASE_URL } from '../api/config';
import api from '../api/api';
import { StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';

const WarningPopUp = ({ visible, children, setVisible }) => {
  React.useEffect(() => {
    toggleModel();
  }, [visible]);

  const toggleModel = () => {
    if (visible == '1') {
      setWarningModel(true);
    } else {
      setWarningModel(false);
    }
  };

  const [warningModel, setWarningModel] = useState(visible);

  return (
    <Modal transparent visible={warningModel} animationType="slide">
      <View
        style={{
          alignSelf: 'center',
          top: 250,
          end: 5,
          width: 250,
          height: 150,
        }}>
        <View>{children}</View>
      </View>
    </Modal>
  );
};

const PasswordPopup = ({ visible, children, setVisible }) => {
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
      <View
        style={{
          alignSelf: 'center',
          top: 200,
          end: 5,
          width: 320,
          height: 325,
        }}>
        <View>{children}</View>
      </View>
    </Modal>
  );
};

export function Setting({ navigation, route }) {
  const { logout } = useUser();
  const [visible, setVisible] = React.useState(false);
  const [currentPassword, setCurrentPassword] = useState();
  const [NewPassword, setNewPassword] = useState();
  const [reTypeNewPassword, setReTypeNewPassword] = useState();
  const image = { uri: `${API_BASE_URL}/upload/background.jpg` };

  const ui = (
    <SafeAreaView style={styles.home}>
      <Image
        source={{ uri: `${API_BASE_URL}/image/background5.jpg` }}
        style={StyleSheet.absoluteFill}
        blurRadius={0.5}
      />

      <StatusBar
        hidden={false}
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent={true}
      />
      <View style={styles.homeView1}>
        <View
          style={{
            backgroundColor: 'transparent',
            width: '100%',
            height: 60,
            end: 9,
            flexDirection: 'row',
            alignItems: 'center',
            top: 20,
          }}>
          <TouchableOpacity onPress={GroupChat} style={styles.backIcon}>
            <Icon
              name="md-arrow-back-outline"
              size={25}
              color="black"
              style={{ top: 15 }}
            />
          </TouchableOpacity>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              start: 120,
            }}>
            <Image
              source={{ uri: HOST_BASE_URL + route.params.img }}
              style={styles.homeImg1}
            />
          </View>
        </View>

        <View style={{ justifyContent: 'flex-start', width: '100%' }}>
          <Text style={styles.text3}>Settings</Text>
        </View>
      </View>

      <WarningPopUp visible={visible}>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            width: 280,
            height: 150,
            backgroundColor: '#ffffff',
            borderRadius: 20,
          }}
          elevation={2}>
          <View style={{ alignSelf: 'center', bottom: 20 }}>
            <Icon name="warning" size={40} color="red" />
          </View>

          <View style={{ alignSelf: 'center', bottom: 15 }}>
            <Text style={{ fontSize: 15, color: 'red' }}>
              Do you want to Log Out
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'center',
              top: 10,
            }}>
            <TouchableOpacity
              onPress={logOut}
              style={{
                width: 100,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#ff4242',
              }}>
              <Text style={{ fontSize: 18, color: '#ff4242' }}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={{
                width: 100,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#2D86FF',
              }}>
              <Text style={{ fontSize: 18, color: '#2D86FF' }}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </WarningPopUp>

      <PasswordPopup visible={visible}>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            width: 320,
            height: '100%',
            backgroundColor: '#ffffff',
            borderRadius: 20,
            gap: 20,
            start: 5,
          }}
          elevation={2}>
          <TouchableOpacity onPress={() => setVisible(false)}>
            <Icon
              name="close-sharp"
              size={20}
              secureTextEntry={true}
              color={'#555555'}
              style={{ start: 10 }}
            />
          </TouchableOpacity>

          <View style={styles.textinputView}>
            <Icon
              name="lock-closed-outline"
              size={20}
              secureTextEntry={true}
              color={'#555555'}
            />
            <TextInput
              style={styles.textInput}
              secureTextEntry={true}
              placeholder={'Current password'}
              placeholderTextColor={'#9d9d9d'}
              onChangeText={setCurrentPassword}
            />
          </View>

          <View style={styles.textinputView}>
            <Icon
              name="lock-closed-outline"
              size={20}
              secureTextEntry={true}
              color={'#555555'}
            />
            <TextInput
              style={styles.textInput}
              secureTextEntry={true}
              placeholder={'New Password'}
              placeholderTextColor={'#9d9d9d'}
              onChangeText={setNewPassword}
            />
          </View>

          <View style={styles.textinputView}>
            <Icon
              name="lock-closed-outline"
              size={20}
              secureTextEntry={true}
              color={'#555555'}
            />
            <TextInput
              style={styles.textInput}
              secureTextEntry={true}
              placeholder={'Re enter password'}
              placeholderTextColor={'#9d9d9d'}
              onChangeText={setReTypeNewPassword}
            />
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: '#2D86FF',
              width: 200,
              height: 40,
              alignSelf: 'center',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={updatePassword}>
            <Text style={{ color: '#ffffff', fontSize: 18 }}>Update</Text>
          </TouchableOpacity>
        </View>
      </PasswordPopup>

      <View style={{ gap: 15 }}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={UserProfile}
          activeOpacity={1}>
          <View style={styles.iconShape} elevation={4}>
            <Icon name="person-outline" size={25} color="white" />
          </View>

          <View style={{ width: '68%' }}>
            <Text style={styles.text}>Account</Text>
          </View>

          <Icon name="chevron-forward" size={25} color="#cdcdcd" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileButton}
          activeOpacity={1}
          onPress={() => setVisible('2')}
          elevation={7}>
          <View style={styles.iconShape} elevation={4}>
            <Icon name="lock-closed" size={25} color="white" />
          </View>

          <View style={{ width: '68%' }}>
            <Text style={styles.text}>Password and security</Text>
          </View>

          <Icon name="chevron-forward" size={25} color="#cdcdcd" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileButton} activeOpacity={1}>
          <View style={styles.iconShape} elevation={4}>
            <Icon name="information" size={25} color="white" />
          </View>

          <View style={{ width: '68%' }}>
            <Text style={styles.text}>About</Text>
          </View>

          <Icon name="chevron-forward" size={25} color="#cdcdcd" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileButton}
          activeOpacity={1}
          onPress={() => setVisible('1')}>
          <View style={styles.iconShape2} elevation={4}>
            <Icon
              name="log-in-outline"
              size={25}
              color="white"
              style={{ end: 2 }}
            />
          </View>

          <View style={{ width: '68%' }}>
            <Text style={styles.text}>Log Out</Text>
          </View>

          <Icon name="chevron-forward" size={25} color="#cdcdcd" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
  async function updateUser() {
    try {
      const formData = new FormData();
      var userJsonText = await AsyncStorage.getItem('user');
      var userJsonObject = JSON.parse(userJsonText);
      formData.append('userId', userJsonObject.id);
      formData.append('name', name);
      formData.append('mobile', mobile);
      formData.append('about', about);

      if (profileImage != null) {
        formData.append('img', profileImage);
        formData.append('imgType', '2');
      } else {
        formData.append('img', null);
        formData.append('imgType', '1');
      }

      const jsResponceObject = await api.upload('update_user.php', formData);
      const userObject = jsResponceObject.user;
      await AsyncStorage.setItem('user', JSON.stringify(userObject));

      navigation.navigate('Home');
    } catch (error) {
      console.error('Failed to update user profile in settings:', error);
      Alert.alert('Error', 'Unable to update profile');
    }
  }

  async function updatePassword() {
    if (NewPassword !== reTypeNewPassword) {
      Alert.alert('Message', 'Please check your password');
      return;
    }

    try {
      const jsResponceObject = await api.post('passwordUpdate.php', {
        id: route.params.userId,
        currentPassword: currentPassword,
        newPassword: NewPassword,
      });

      if (jsResponceObject.msg === 'Error') {
        Alert.alert('Message', jsResponceObject.data || 'Error occurred');
      } else {
        const userObject = jsResponceObject.user;
        await AsyncStorage.setItem('user', JSON.stringify(userObject));
        setVisible(false);
        Alert.alert('Success', 'Password updated successfully');
      }
    } catch (error) {
      console.error('Failed to update password:', error);
      Alert.alert('Error', 'Unable to update password');
    }
  }

  async function logOut() {
    await logout();
    BackHandler.exitApp();
  }

  function GroupChat() {
    navigation.navigate('Home');
  }

  function UserProfile() {
    const obj = {
      img: route.params.img,
      mobile: route.params.mobile,
      name: route.params.name,
      country: route.params.country,
      pageId: '1',
      about: route.params.about,
    };

    navigation.navigate('UserProfile', obj);
  }

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
    height: 180,
    paddingBottom: 40,
    alignSelf: 'center',
    borderRadius: 10,
    top: '3%',
    gap: 65,
    start: 10,
  },
  homeImg1: {
    width: 60,
    height: 60,
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
    backgroundColor: 'transparent',
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
    fontSize: 22,
    color: '#ffffffc',
    start: 55,
    top: 48,
  },
  text3: {
    fontSize: 30,
    color: 'black',
    start: 5,
  },
  text4: {
    fontSize: 18,
    color: 'red',
  },
  iconShape: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#2D86FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconShape2: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#ff4242',
    justifyContent: 'center',
    alignItems: 'center',
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
});
