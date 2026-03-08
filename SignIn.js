import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useState} from 'react';
import {StatusBar} from 'react-native';
import {LogBox} from 'react-native';

export function SignIn({navigation}) {
  LogBox.ignoreAllLogs(true);

  const [mobile, setMobile] = useState(null);
  const [password, setPassword] = useState(null);

  const ui = (
    <SafeAreaView style={signInStyle.signInMain}>
      <Image
        source={{uri: 'http://YOUR_LOCAL_IP/geochat/image/background2.jpg'}}
        style={StyleSheet.absoluteFill}
        blurRadius={15}
      />

      <StatusBar
        hidden={false}
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent={true}
      />
      <Image
        source={{uri: 'http://YOUR_LOCAL_IP/geochat/image/chat.png'}}
        style={signInStyle.signInImg}
      />

      <View style={signInStyle.signInView1}>
        <Icon name="mobile" color="red" style={signInStyle.signInItem} />
        <TextInput
          style={signInStyle.signInInput1}
          autoCorrect={false}
          inputMode={'numeric'}
          maxLength={10}
          placeholder={'your Mobile'}
          placeholderTextColor={'#9d9d9d'}
          onChangeText={setMobile}
          value={mobile}
        />
      </View>

      <View style={signInStyle.signInView1}>
        <Icon name="lock" style={signInStyle.signInItem} color={'black'} />
        <TextInput
          style={signInStyle.signInInput1}
          secureTextEntry={true}
          placeholder={'your Password'}
          placeholderTextColor={'#9d9d9d'}
          onChangeText={setPassword}
          value={password}
        />
      </View>

      <TouchableOpacity
        style={signInStyle.signInButton1}
        activeOpacity={0.7}
        onPress={signInProcess}>
        <Text style={signInStyle.signInButtonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={signInStyle.signInButton2}
        activeOpacity={0.7}
        onPress={SignUp}>
        <Text style={signInStyle.signInButton2Text}>
          <Text style={signInStyle.signInButtonText2}>
            Don't have an account ?
          </Text>
          Sign Up
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  return ui;

  function SignUp() {
    navigation.navigate('Sign Up');
  }

  function signInProcess() {
    var jsRequestObject = {mobile: mobile, password: password};
    var jsonRequestText = JSON.stringify(jsRequestObject);

    var formData = new FormData();
    formData.append('jsonRequsetText', jsonRequestText);

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        var jsonResponceText = request.responseText;
        var jsResponceObject = JSON.parse(jsonResponceText);

        if (jsResponceObject.msg === 'Error') {
          Alert.alert('Message', 'Ivalid delails');
        } else {
          var userObject = jsResponceObject.user;
          AsyncStorage.setItem('user', JSON.stringify(userObject));

          navigation.navigate('Home');
          setPassword('');
          setMobile('');
        }
      }
    };
    request.open('POST', 'http://YOUR_LOCAL_IP/geochat/signin.php', true);
    request.send(formData);
  }
}

const signInStyle = StyleSheet.create({
  signInMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffffc',
    gap: 25,
  },
  signInImg: {
    width: 200,
    height: 200,
    borderRadius: 50,
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  signInView1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffffc',
    borderRadius: 20,
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
    // borderColor: 'black',
    // borderBottomWidth: 0.8,
    borderBottomColor: 'black',
    borderRadius: 25,
    paddingStart: 30,
    fontSize: 20,
  },
  signInButton1: {
    width: '50%',
    height: 40,
    borderRadius: 15,
    backgroundColor: '#2D86FF',
    justifyContent: 'center',
    alignItems: 'center',
    // zIndex: -1,
  },
  signInButton2: {
    width: '85%',
    height: 40,
    color: 'black',
    borderRadius: 20,
    backgroundColor: 'transparent',
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
    zIndex: -1,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  signInButton2Text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#061720',
  },
  signInButtonText2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8f8f8',
  },
});
