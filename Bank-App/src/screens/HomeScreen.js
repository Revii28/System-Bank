import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const navigateToAdminDashboard = () => {
    navigation.navigate('MainTab', { screen: 'AdminDashboard' });
  };

  const navigateToCustomerDashboard = () => {
    navigation.navigate('MainTab', { screen: 'CustomerDashboard' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pilih Dashboard</Text>
      <Button
        title="Admin Dashboard"
        onPress={navigateToAdminDashboard}
        style={styles.button}
      />
      <Button
        title="Customer Dashboard"
        onPress={navigateToCustomerDashboard}
        style={styles.button}
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
    marginBottom: 20,
  },
  button: {
    margin: 10,
  },
});

export default HomeScreen;
