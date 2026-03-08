import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import SelectDropdown from 'react-native-select-dropdown';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';

export function SignUp({navigation}) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setname] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setverifyPassword] = useState('');
  const [country, setContry] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [countries, setCountries] = useState(['']);
  const [userImage, setUserImage] = useState(
    'http://YOUR_LOCAL_IP/geochat/image/user.png',
  );

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

  function start() {
    loadCountries();
  }

  useEffect(start, []);

  const ui = (
    <SafeAreaView style={SignUpStyle.main}>
      <StatusBar
        hidden={false}
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent={true}
      />
      <Image
        source={{uri: 'http://YOUR_LOCAL_IP/geochat/image/background2.jpg'}}
        style={StyleSheet.absoluteFill}
        blurRadius={20}
      />

      <TouchableOpacity
        style={signInStyle.signInButton3}
        activeOpacity={0.7}
        onPress={selectProfilePicture}>
        <Image source={{uri: userImage}} style={signInStyle.profileImg} />
      </TouchableOpacity>

      <View style={SignUpStyle.SignUpView1}>
        <Icon name="user" style={SignUpStyle.SignUpIcon} />
        <TextInput
          style={SignUpStyle.SignUpInput1}
          placeholder={'Type your name'}
          placeholderTextColor={'#9d9d9d'}
          onChangeText={setname}
        />
      </View>

      <View style={SignUpStyle.SignUpView1}>
        <Icon name="mobile" style={SignUpStyle.SignUpIcon} />
        <TextInput
          style={SignUpStyle.SignUpInput1}
          placeholder={'Type Mobile'}
          placeholderTextColor={'#9d9d9d'}
          inputMode={'numeric'}
          maxLength={10}
          autoCorrect={false}
          onChangeText={setMobileNumber}
        />
      </View>

      <View style={SignUpStyle.SignUpView1}>
        <Icon name="lock" style={SignUpStyle.SignUpIcon} />
        <TextInput
          style={SignUpStyle.SignUpInput1}
          secureTextEntry={true}
          placeholder={'Type Password'}
          placeholderTextColor={'#9d9d9d'}
          onChangeText={setPassword}
        />
      </View>

      <View style={SignUpStyle.SignUpView1}>
        <Icon
          name="lock"
          style={SignUpStyle.SignUpIcon}
          secureTextEntry={true}
        />
        <TextInput
          style={SignUpStyle.SignUpInput1}
          secureTextEntry={true}
          placeholder={'Re enter Your Password'}
          placeholderTextColor={'#9d9d9d'}
          onChangeText={setverifyPassword}
        />
      </View>

      <View style={SignUpStyle.SignUpView1}>
        <SelectDropdown
          data={countries}
          onSelect={setContry}
          dropdownStyle={{borderRadius: 20}}
          buttonStyle={{borderRadius: 20, width: '85%'}}
          searchInputStyle={{backgroundColor: 'red'}}
          defaultButtonText="Select Country"
        />
      </View>

      <TouchableOpacity
        style={signInStyle.signInButton2}
        activeOpacity={0.7}
        onPress={signUprequest}>
        <Text style={signInStyle.signInButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={signInStyle.signInButton1}
        activeOpacity={0.7}
        onPress={signIn}>
        <Text style={signInStyle.signInButton2Text}>
          <Text style={signInStyle.signInButtonText2}>
            Already have an account ?
          </Text>{' '}
          Sign In
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
  return ui;

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
      setUserImage(imageObject.uri);
    }
  }

  function signUprequest(imageObject) {
    if (!profileImage) {
      Alert.alert('Please select a profileImage');
    } else {
      if (!name) {
        Alert.alert('Please enter a name');
      } else {
        if (!mobileNumber) {
          Alert.alert('Please enter a mobile');
        } else {
          if (!password) {
            Alert.alert('Please enter a password');
          } else {
            if (password == verifyPassword) {
              if (!country) {
                Alert.alert('Please select a country');
              } else {
                var form = new FormData();
                form.append('mobile', mobileNumber);
                form.append('profile_picture', profileImage);
                form.append('name', name);
                form.append('password', password);
                form.append('verifyPassword', verifyPassword);
                form.append('country', country);

                var request = new XMLHttpRequest();

                request.onreadystatechange = function () {
                  if (request.readyState === 4 && request.status == 200) {
                    if (request.responseText == 'success') {
                      navigation.navigate('Sign In');
                    } else {
                      Alert.alert('Message', request.responseText);
                    }
                  }
                };
                request.open(
                  'POST',
                  'http://YOUR_LOCAL_IP/geochat/signUp.php',
                  true,
                );
                request.send(form);
              }
            } else {
              Alert.alert('Please check your password');
            }
          }
        }
      }
    }
  }

  function signIn() {
    navigation.navigate('Sign In');
  }
}

const SignUpStyle = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fffffc',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    overflow: 'scroll',
  },
  SignUpView1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffffc',
    borderRadius: 20,
  },
  SignUpIcon: {
    fontSize: 18,
    color: 'black',
    position: 'absolute',
    start: 15,
  },
  SignUpInput1: {
    width: '85%',
    height: 50,
    color: 'black',
    borderStyle: 'solid',
    borderBottomColor: 'black',
    borderRadius: 25,
    paddingStart: 30,
    fontSize: 18,
  },
  SignDropDown: {
    borderRadius: 20,
    backgroundColor: '#ebebeb',
    borderWidth: 0,
  },
  SignDropDownText: {
    borderWidth: 0,
  },
  dropDownContainer: {
    width: '85%',
    borderWidth: 0,
  },
  dropDownDisabled: {
    opacity: 0,
  },
  doropDownLable: {
    fontWeight: 'bold',
  },
  dropDownText: {
    fontSize: 18,
  },
});

const signInStyle = StyleSheet.create({
  signInMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    gap: 25,
  },
  signInImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  signInView1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInItem: {
    fontSize: 25,
    color: 'black',
    position: 'absolute',
    start: 10,
  },
  signInInput1: {
    width: '85%',
    height: 50,
    color: 'black',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 25,
    paddingStart: 30,
    fontSize: 20,
  },
  signInButton1: {
    width: '85%',
    height: 40,
    color: 'black',
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    // zIndex: -1,
  },
  signInButton2: {
    width: '50%',
    height: 40,
    borderRadius: 15,
    backgroundColor: '#2D86FF',
    justifyContent: 'center',
    alignItems: 'center',
    // zIndex: -1,
  },
  signInButton3: {
    width: 80,
    height: 80,
    color: 'black',
    borderRadius: 100,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    // zIndex: -1,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  signInButtonText2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8f8f8',
  },
  signInButton2Text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#061720',
  },
});
