// MainTab.js
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import ManageCustomerScreen from '../screens/ManageCustomerScreen';
import ManageDepositoTypeScreen from '../screens/ManageDepositoTypeScreen';
import ManageAccountScreen from '../screens/ManageAccountScreen';
import CustomerDashboardScreen from '../screens/CustomerDashboardScreen'; 
import LogoutButton from '../components/LogoutButton'; 

const Tab = createBottomTabNavigator();

const MainTab = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const storedRole = await SecureStore.getItemAsync('userRole');
        setRole(storedRole);
      } catch (e) {
        setError('Failed to load role');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <Tab.Navigator>
      {role === 'admin' ? (
        <>
          <Tab.Screen 
            name="AdminDashboard" 
            component={AdminDashboardScreen}
            options={{
              headerRight: () => <LogoutButton />
            }}
          />
          <Tab.Screen 
            name="ManageCustomers" 
            component={ManageCustomerScreen}
            options={{
              headerRight: () => <LogoutButton />
            }}
          />
          <Tab.Screen 
            name="ManageDepositoTypes" 
            component={ManageDepositoTypeScreen}
            options={{
              headerRight: () => <LogoutButton />
            }}
          />
          <Tab.Screen 
            name="ManageAccounts" 
            component={ManageAccountScreen}
            options={{
              headerRight: () => <LogoutButton />
            }}
          />
        </>
      ) : (
        <Tab.Screen 
          name="CustomerDashboard" 
          component={CustomerDashboardScreen}
          options={{
            headerRight: () => <LogoutButton />
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default MainTab;
