import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const AdminDashboardScreen = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const role = await SecureStore.getItemAsync('userRole');
        if (role === 'admin') {
          setIsAdmin(true);
        } else {
          navigation.navigate('Unauthorized');
        }
      } catch (error) {
        console.error('Failed to fetch user role from SecureStore', error);
      }
    };

    checkUserRole();
  }, [navigation]);

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Button
        title="Manage Customers"
        onPress={() => navigation.navigate('ManageCustomer')}
      />
      <Button
        title="Manage Accounts"
        onPress={() => navigation.navigate('ManageAccount')}
      />
      <Button
        title="Manage Deposito Types"
        onPress={() => navigation.navigate('ManageDepositoType')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AdminDashboardScreen;
