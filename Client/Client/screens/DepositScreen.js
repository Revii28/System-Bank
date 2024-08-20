import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useMutation } from '@apollo/client';
import { DEPOSIT_MUTATION } from '../graphql/mutations';

const DepositScreen = ({ route, navigation }) => {
  const { accountId } = route.params;
  const [amount, setAmount] = useState('');

  const [depositToAccount] = useMutation(DEPOSIT_MUTATION);

  const handleDeposit = async () => {
    await depositToAccount({
      variables: { accountId, amount: parseFloat(amount) },
    });
    setAmount('');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Deposit Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Button title="Deposit" onPress={handleDeposit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    width: '80%',
    paddingHorizontal: 10,
  },
});

export default DepositScreen;
