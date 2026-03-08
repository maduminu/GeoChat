import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Alert,
  LogBox,
} from 'react-native';
import { useUser } from '../api/UserContext';
import { API_BASE_URL } from '../api/config';
import api from '../api/api';
import { theme } from '../theme';
import ThemedText from '../components/ThemedText';
import ThemedInput from '../components/ThemedInput';
import ThemedButton from '../components/ThemedButton';

export function SignIn({ navigation }) {
  LogBox.ignoreAllLogs(true);
  const { login } = useUser();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const SignUp = () => {
    navigation.navigate('Sign Up');
  };

  const signInProcess = async () => {
    if (!mobile || !password) {
      Alert.alert('Message', 'Please enter your mobile number and password');
      return;
    }

    setLoading(true);
    try {
      const jsResponceObject = await api.post('signin.php', {
        jsonRequestText: JSON.stringify({ mobile, password }),
      });

      if (jsResponceObject.msg === 'Error') {
        Alert.alert('Error', 'Invalid credentials or connection issue');
      } else {
        const userObject = jsResponceObject.user;
        await login(userObject);

        navigation.navigate('Home');
        setPassword('');
        setMobile('');
      }
    } catch (e) {
      Alert.alert('Network error', 'Unable to connect to the server');
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

      <StatusBar
        hidden={false}
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent={true}
      />

      <View style={styles.card}>
        <Image
          source={{ uri: `${API_BASE_URL}/image/chat.png` }}
          style={styles.logo}
        />

        <ThemedText type="title" color="primary" style={styles.title}>
          Welcome Back
        </ThemedText>

        <ThemedText type="body" color="textSecondary" style={styles.subtitle}>
          Sign in to continue your conversations
        </ThemedText>

        <View style={styles.form}>
          <ThemedInput
            icon="phone-portrait-outline"
            placeholder="Mobile Number"
            keyboardType="numeric"
            maxLength={10}
            onChangeText={setMobile}
            value={mobile}
          />

          <ThemedInput
            icon="lock-closed-outline"
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
          />

          <ThemedButton
            title="Sign In"
            onPress={signInProcess}
            loading={loading}
            style={styles.signInBtn}
          />

          <View style={styles.footer}>
            <ThemedText type="body" color="textSecondary">
              Don't have an account?{' '}
            </ThemedText>
            <ThemedText
              type="body"
              weight="bold"
              color="primary"
              onPress={SignUp}
            >
              Sign Up
            </ThemedText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  card: {
    width: '88%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: theme.spacing.xl,
    borderRadius: theme.spacing.borderRadiusLarge * 1.5,
    alignItems: 'center',
    // Glassmorphism effect
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: theme.spacing.m,
    borderRadius: theme.spacing.borderRadiusLarge,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  form: {
    width: '100%',
  },
  signInBtn: {
    marginTop: theme.spacing.l,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
});
