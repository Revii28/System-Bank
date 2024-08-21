import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LogoutButton from '../components/LogoutButton'; // Pastikan path ini benar

const CustomerDashboardScreen = () => {
  const navigation = useNavigation();

  const handleViewAccountDetails = () => {
    navigation.navigate('AccountDetails'); 
  };

  const handleDeposit = () => {
    navigation.navigate('Deposit'); 
  };

  const handleWithdraw = () => {
    navigation.navigate('Withdraw'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Dashboard</Text>
      <View style={styles.buttonContainer}>
        <Button title="View Account Details" onPress={handleViewAccountDetails} />
        <Button title="Deposit" onPress={handleDeposit} />
        <Button title="Withdraw" onPress={handleWithdraw} />
      </View>
      <LogoutButton /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 20,
  },
});

export default CustomerDashboardScreen;
