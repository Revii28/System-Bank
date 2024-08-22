import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LogoutButton from '../components/LogoutButton';

const CustomerDashboardScreen = ({ route }) => {
  const navigation = useNavigation();
  const { accountId } = route.params || {};

  const handleViewAccountDetails = () => {
    if (accountId) {
      navigation.navigate('AccountDetailsUser', { accountId });
    } else {
      Alert.alert('Error', 'No accountId provided. Please select an account first.');
    }
  };

  const handleDeposit = () => {
    navigation.navigate('Deposit', { accountId });
  };

  const handleWithdraw = () => {
    navigation.navigate('Withdraw', { accountId });
  };

  const handleCreateAccount = () => {
    navigation.navigate('CreateAccountUser');
  };

  const handleAddCustomer = () => {
    navigation.navigate('AddCustomer');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Dashboard</Text>
      <View style={styles.buttonContainer}>
        <Button title="View Account Details" onPress={handleViewAccountDetails} />
        <Button title="Deposit" onPress={handleDeposit} />
        <Button title="Withdraw" onPress={handleWithdraw} />
        <Button title="Create Account" onPress={handleCreateAccount} />
        <Button title="Create Customer Account" onPress={handleAddCustomer} />
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
