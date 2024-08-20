import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bank Saving System</Text>
      <Button title="Customers" onPress={() => navigation.navigate('Customers')} />
      <Button title="Accounts" onPress={() => navigation.navigate('Accounts')} />
      <Button title="Deposito Types" onPress={() => navigation.navigate('DepositoTypes')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;
