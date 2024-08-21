import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTab from '../stack/MainTab';
import UnauthorizedScreen from '../screens/UnauthorizedScreen';

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainTab" component={MainTab} />
      <Stack.Screen name="Unauthorized" component={UnauthorizedScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
