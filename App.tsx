import React, { useState } from 'react';
import { Home } from './src/screens/home';
import { SignIn } from './src/screens/SignIn';
import { SignUp } from './src/screens/signUp';
import { Chat } from './src/screens/chat';
import { Search } from './src/screens/search';
import { Group } from './src/screens/Group';
import { GroupChat } from './src/screens/GroupChat';
import { GroupUserDetails } from './src/screens/GroupUserDetails';
import { GroupSearch } from './src/screens/GroupSearch';
import { AddUSer } from './src/screens/addUser';
import { LoadPage } from './src/screens/loadPage';
import { CreateGroup } from './src/screens/CreateGroup';
import { PostView } from './src/screens/PostView';
import { AddPost } from './src/screens/AddPost';
import { PostChat } from './src/screens/PostChat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatImage } from './src/screens/imageView';
import { UserProfile } from './src/screens/userProfile';
import { Setting } from './src/screens/setting';
import { UserProvider } from './src/api/UserContext';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <UserProvider>
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
            options={{ headerShown: false }}
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
    </UserProvider>
  );
}

export default App;
