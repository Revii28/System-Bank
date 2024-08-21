import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import CustomerDashboardScreen from '../screens/CustomerDashboardScreen';
import LogoutButton from '../components/LogoutButton'; 

const Tab = createBottomTabNavigator();

const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => <LogoutButton />,
      }}
    >
      <Tab.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="CustomerDashboard" component={CustomerDashboardScreen} />
    </Tab.Navigator>
  );
};

export default MainTab;
