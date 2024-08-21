import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTab from '../stack/MainTab';
import UnauthorizedScreen from '../screens/UnauthorizedScreen';
import ManageCustomerScreen from '../screens/ManageCustomerScreen';
import AddCustomerScreen from '../screens/AddCustomerScreen';
import EditCustomerScreen from '../screens/EditCustomerScreen';
import ManageAccountScreen from '../screens/ManageAccountScreen';
import AddAccountScreen from '../screens/AddAccountScreen';
import EditAccountScreen from '../screens/EditAccountScreen';
import ManageDepositoTypeScreen from '../screens/ManageDepositoTypeScreen';
import AddDepositoTypeScreen from '../screens/AddDepositoTypeScreen';
import EditDepositoTypeScreen from '../screens/EditDepositoTypeScreen';

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainTab" component={MainTab} />
      <Stack.Screen name="Unauthorized" component={UnauthorizedScreen} />
      <Stack.Screen name="ManageCustomer" component={ManageCustomerScreen} />
      <Stack.Screen name="AddCustomer" component={AddCustomerScreen} />
      <Stack.Screen name="EditCustomer" component={EditCustomerScreen} />
      <Stack.Screen name="ManageAccount" component={ManageAccountScreen} />
      <Stack.Screen name="AddAccount" component={AddAccountScreen} />
      <Stack.Screen name="EditAccount" component={EditAccountScreen} />
      <Stack.Screen name="ManageDepositoType" component={ManageDepositoTypeScreen} />
      <Stack.Screen name="AddDepositoType" component={AddDepositoTypeScreen} />
      <Stack.Screen name="EditDepositoType" component={EditDepositoTypeScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
