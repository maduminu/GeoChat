import React, {useState} from 'react';
import {Home} from './home';
import {SignIn} from './SignIn';
import {SignUp} from './signUp';
import {Chat} from './chat';
import {Search} from './search';
import {Group} from './Group';
import {GroupChat} from './GroupChat';
import {GroupUserDetails} from './GroupUserDetails';
import {GroupSearch} from './GroupSearch';
import {AddUSer} from './addUser';
import {LoadPage} from './loadPage';
import {CreateGroup} from './CreateGroup';
import {PostView} from './PostView';
import {AddPost} from './AddPost';
import {PostChat} from './PostChat';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ChatImage} from './imageView';
import {UserProfile} from './userProfile';
import {Setting} from './setting';

const Stack = createNativeStackNavigator();

function App() {
  async function checkUser() {
    const user = await AsyncStorage.getItem('user');
    return user;
  }
  const ui = (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'LoadPage'}>
        <Stack.Screen
          name="Sign In"
          component={SignIn}
          options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Sign Up"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'flip',
          }}
        />
        <Stack.Screen
          name="Group"
          component={Group}
          options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="GroupChat"
          component={GroupChat}
          options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'flip',
          }}
        />
        <Stack.Screen
          name="GroupSearch"
          component={GroupSearch}
          options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'pop',
            animation: 'flip',
          }}
        />
        <Stack.Screen
          name="AddUSer"
          component={AddUSer}
          options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen
          name="GroupUserDetails"
          component={GroupUserDetails}
          options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'flip',
          }}
        />
        <Stack.Screen
          name="LoadPage"
          component={LoadPage}
          options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'pop',
            animation: 'flip',
          }}
        />
        <Stack.Screen
          name="CreateGroup"
          component={CreateGroup}
          options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="PostView"
          component={PostView}
          options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_left',
          }}
        />
        <Stack.Screen
          name="AddPost"
          component={AddPost}
          options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="PostChat"
          component={PostChat}
          options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'pop',
            animation: 'flip',
          }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'pop',
            animation: 'flip',
          }}
        />
        <Stack.Screen
          name="Setting"
          component={Setting}
          options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'pop',
            animation: 'flip',
          }}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'pop',
            animation: 'flip',
          }}
        />
        <Stack.Screen
          name="ChatImage"
          component={ChatImage}
          options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'pop',
            animation: 'flip',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
  return ui;
}

export default App;
