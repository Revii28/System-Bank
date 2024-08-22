import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_ACCOUNT_DETAILS } from '../graphql/queries';

const AccountDetailsUser = ({ route }) => {
  const { accountId } = route.params;
  const { data, loading, error } = useQuery(GET_ACCOUNT_DETAILS, { variables: { accountId } });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const { getAccountDetails } = data;
  const { balance, depositoType } = getAccountDetails;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Details</Text>
      <Text style={styles.text}>Balance: {balance.toFixed(2)}</Text>
      <Text style={styles.text}>Deposito Type: {depositoType.name}</Text>
      <Text style={styles.text}>Yearly Return: {depositoType.yearlyReturn}%</Text>
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
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default AccountDetailsUser;
