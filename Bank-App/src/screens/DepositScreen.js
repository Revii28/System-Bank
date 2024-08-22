import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useMutation } from '@apollo/client';
import { DEPOSIT_TO_ACCOUNT } from '../graphql/mutations';

const DepositScreen = ({ route, navigation }) => {
  const [amount, setAmount] = useState('');
  const [depositDate, setDepositDate] = useState('');
  const [depositToAccount] = useMutation(DEPOSIT_TO_ACCOUNT);
  const { accountId } = route.params;

  const handleDeposit = async () => {
    try {
      await depositToAccount({ variables: { accountId, amount: parseFloat(amount) } });
      Alert.alert('Success', 'Deposit successful');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to deposit');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deposit Funds</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Deposit Date (YYYY-MM-DD)"
        value={depositDate}
        onChangeText={setDepositDate}
      />
      <Button title="Deposit" onPress={handleDeposit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default DepositScreen;
