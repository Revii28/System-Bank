import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import ManageCustomerScreen from '../screens/ManageCustomerScreen';
import ManageAccountScreen from '../screens/ManageAccountScreen';
import ManageDepositoScreen from '../screens/ManageDepositoScreen';

const Tab = createBottomTabNavigator();

const MainTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="ManageCustomers" component={ManageCustomerScreen} />
      <Tab.Screen name="ManageAccounts" component={ManageAccountScreen} />
      <Tab.Screen name="ManageDepositos" component={ManageDepositoScreen} />
    </Tab.Navigator>
  );
};

export default MainTab;
