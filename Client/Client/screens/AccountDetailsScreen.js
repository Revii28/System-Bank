import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { useMutation } from '@apollo/client';
import { DEPOSIT_MUTATION, WITHDRAW_MUTATION } from '../graphql/mutations';

const AccountDetailsScreen = ({ route, navigation }) => {
  const { account } = route.params;
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const [depositToAccount] = useMutation(DEPOSIT_MUTATION);
  const [withdrawFromAccount] = useMutation(WITHDRAW_MUTATION);

  const handleDeposit = async () => {
    await depositToAccount({
      variables: { accountId: account._id, amount: parseFloat(depositAmount) },
    });
    setDepositAmount('');
  };

  const handleWithdraw = async () => {
    await withdrawFromAccount({
      variables: { accountId: account._id, amount: parseFloat(withdrawAmount) },
    });
    setWithdrawAmount('');
  };

  return (
    <View style={styles.container}>
      <Text>Account Packet: {account.packet}</Text>
      <Text>Balance: {account.balance}</Text>
      <TextInput
        style={styles.input}
        placeholder="Deposit Amount"
        keyboardType="numeric"
        value={depositAmount}
        onChangeText={setDepositAmount}
      />
      <Button title="Deposit" onPress={handleDeposit} />
      <TextInput
        style={styles.input}
        placeholder="Withdraw Amount"
        keyboardType="numeric"
        value={withdrawAmount}
        onChangeText={setWithdrawAmount}
      />
      <Button title="Withdraw" onPress={handleWithdraw} />
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

export default AccountDetailsScreen;
