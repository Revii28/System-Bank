import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import { WITHDRAW_FROM_ACCOUNT } from '../graphql/mutations';
import { GET_ACCOUNT } from '../graphql/queries';

const WithdrawScreen = ({ route, navigation }) => {
  const [amount, setAmount] = useState('');
  const [withdrawDate, setWithdrawDate] = useState('');
  const [endingBalance, setEndingBalance] = useState(null);
  const { accountId } = route.params;

  const { data: accountData } = useQuery(GET_ACCOUNT, { variables: { id: accountId } });
  const [withdrawFromAccount] = useMutation(WITHDRAW_FROM_ACCOUNT);

  useEffect(() => {
    if (accountData) {
      const { balance, depositoType } = accountData.account;
      const months = Math.floor((new Date().getTime() - new Date(depositoType.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30));
      const monthlyReturn = depositoType.yearlyReturn / 12 / 100;
      const calculatedEndingBalance = balance * (1 + monthlyReturn) ** months;
      setEndingBalance(calculatedEndingBalance);
    }
  }, [accountData]);

  const handleWithdraw = async () => {
    try {
      await withdrawFromAccount({ variables: { accountId, amount: parseFloat(amount) } });
      Alert.alert('Success', 'Withdrawal successful');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to withdraw');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Withdraw Funds</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Withdrawal Date (YYYY-MM-DD)"
        value={withdrawDate}
        onChangeText={setWithdrawDate}
      />
      <Button title="Withdraw" onPress={handleWithdraw} />
      {endingBalance !== null && (
        <Text style={styles.result}>Ending Balance: {endingBalance.toFixed(2)}</Text>
      )}
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
  result: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WithdrawScreen;
