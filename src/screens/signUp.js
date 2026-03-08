import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Image,
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
  LogBox,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SelectDropdown from 'react-native-select-dropdown';
import { API_BASE_URL } from '../api/config';
import api from '../api/api';
import { theme } from '../theme';
import ThemedText from '../components/ThemedText';
import ThemedInput from '../components/ThemedInput';
import ThemedButton from '../components/ThemedButton';

export function SignUp({ navigation }) {
  LogBox.ignoreAllLogs(true);

  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setname] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setverifyPassword] = useState('');
  const [country, setContry] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [countries, setCountries] = useState(['Sri Lanka', 'India', 'America', 'Dubai']);
  const [userImage, setUserImage] = useState(`${API_BASE_URL}/image/user.png`);
  const [loading, setLoading] = useState(false);

  async function loadCountries() {
    try {
      const countryArray = await api.get('loadCountry.php');
      // We'll keep our hardcoded list for now as the server might return IDs we need to map
      // but let's assume the previous SelectDropdown logic worked with the text
      // setCountries(countryArray); 
    } catch (error) {
      console.error('Failed to load countries:', error);
    }
  }

  useEffect(() => {
    loadCountries();
  }, []);

  const selectProfilePicture = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets) {
      const imageObject = {
        uri: result.assets[0].uri,
        name: 'profile.png',
        type: 'image/png',
      };
      setProfileImage(imageObject);
      setUserImage(imageObject.uri);
    }
  };

  const signUprequest = async () => {
    if (!profileImage) {
      Alert.alert('Error', 'Please select a profile picture');
      return;
    }
    if (!name || !mobileNumber || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== verifyPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!country) {
      Alert.alert('Error', 'Please select a country');
      return;
    }

    setLoading(true);
    try {
      const result = await api.upload('signUp.php', {
        mobile: mobileNumber,
        profile_picture: profileImage,
        name: name,
        password: password,
        verifyPassword: verifyPassword,
        country: country === 'Sri Lanka' ? '1' : country === 'India' ? '2' : country === 'America' ? '3' : '4',
      });

      if (result === 'success') {
        Alert.alert('Success', 'Account created! Please sign in.');
        navigation.navigate('Sign In');
      } else {
        Alert.alert('Message', result);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to complete sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{ uri: `${API_BASE_URL}/image/background2.jpg` }}
        style={StyleSheet.absoluteFill}
        blurRadius={20}
      />
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <ThemedText type="title" color="primary" style={styles.title}>Create Account</ThemedText>
          <ThemedText color="textSecondary" style={styles.subtitle}>Join GeoChat and start connecting</ThemedText>

          <TouchableOpacity style={styles.imageContainer} onPress={selectProfilePicture}>
            <Image source={{ uri: userImage }} style={styles.profileImg} />
            <View style={styles.cameraBtn}>

            </View>
          </TouchableOpacity>

          <ThemedInput icon="person-outline" placeholder="Full Name" onChangeText={setname} />
          <ThemedInput icon="phone-portrait-outline" placeholder="Mobile Number" keyboardType="numeric" maxLength={10} onChangeText={setMobileNumber} />
          <ThemedInput icon="lock-closed-outline" placeholder="Password" secureTextEntry onChangeText={setPassword} />
          <ThemedInput icon="shield-checkmark-outline" placeholder="Verify Password" secureTextEntry onChangeText={setverifyPassword} />

          <View style={styles.dropdownContainer}>
            <SelectDropdown
              data={countries}
              onSelect={setContry}
              defaultButtonText="Select Country"
              buttonStyle={styles.dropdown}
              buttonTextStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownPopup}
            />
          </View>

          <ThemedButton title="Create Account" onPress={signUprequest} loading={loading} style={styles.signUpBtn} />

          <View style={styles.footer}>
            <ThemedText color="textSecondary">Already have an account? </ThemedText>
            <TouchableOpacity onPress={() => navigation.navigate('Sign In')}>
              <ThemedText color="primary" weight="bold">Sign In</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.m,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.spacing.borderRadiusLarge * 1.5,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    marginBottom: theme.spacing.xxs,
  },
  subtitle: {
    marginBottom: theme.spacing.l,
    textAlign: 'center',
  },
  imageContainer: {
    width: 110,
    height: 110,
    marginBottom: theme.spacing.l,
  },
  profileImg: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
    backgroundColor: theme.colors.inputBackground,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  dropdownContainer: {
    width: '100%',
    marginVertical: theme.spacing.s,
  },
  dropdown: {
    width: '100%',
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.spacing.borderRadiusLarge,
    height: 55,
  },
  dropdownText: {
    fontSize: 16,
    color: theme.colors.textMain,
    textAlign: 'left',
  },
  dropdownPopup: {
    borderRadius: theme.spacing.borderRadiusMedium,
  },
  signUpBtn: {
    marginTop: theme.spacing.m,
  },
  footer: {
    flexDirection: 'row',
    marginTop: theme.spacing.xl,
  },
});
