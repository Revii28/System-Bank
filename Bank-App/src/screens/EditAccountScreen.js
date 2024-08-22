import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker, ActivityIndicator } from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_ACCOUNT } from '../graphql/mutations';
import { GET_ACCOUNT } from '../graphql/queries';
import { GET_CUSTOMERS } from '../graphql/queries';
import { GET_DEPOSITO_TYPES } from '../graphql/queries';

const EditAccountScreen = ({ route, navigation }) => {
  const { accountId } = route.params; 
  const [packet, setPacket] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [balance, setBalance] = useState('');
  const [depositoTypeId, setDepositoTypeId] = useState('');
  const [customers, setCustomers] = useState([]);
  const [depositoTypes, setDepositoTypes] = useState([]);
  const { data: accountData, loading: accountLoading, error: accountError } = useQuery(GET_ACCOUNT, {
    variables: { id: accountId },
  });
  const { data: customerData, loading: customerLoading } = useQuery(GET_CUSTOMERS);
  const { data: depositoData, loading: depositoLoading } = useQuery(GET_DEPOSITO_TYPES);
  const [updateAccount, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_ACCOUNT);

  useEffect(() => {
    if (accountData) {
      const { packet, customer, balance, depositoType } = accountData.account;
      setPacket(packet);
      setCustomerId(customer._id);
      setBalance(balance.toString());
      setDepositoTypeId(depositoType._id);
    }

    if (customerData) {
      setCustomers(customerData.customers);
    }

    if (depositoData) {
      setDepositoTypes(depositoData.depositoTypes);
    }
  }, [accountData, customerData, depositoData]);

  const handleSubmit = async () => {
    try {
      await updateAccount({
        variables: {
          id: accountId,
          packet,
          balance: parseFloat(balance),
          depositoTypeId,
        },
      });
      navigation.goBack(); 
    } catch (e) {
      console.error('Failed to update account', e);
    }
  };

  if (accountLoading || customerLoading || depositoLoading || updateLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (accountError || updateError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {accountError?.message || updateError?.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Packet"
        value={packet}
        onChangeText={setPacket}
      />
      <Picker
        selectedValue={customerId}
        style={styles.input}
        onValueChange={(itemValue) => setCustomerId(itemValue)}
      >
        {customers.map((customer) => (
          <Picker.Item key={customer._id} label={customer.name} value={customer._id} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Balance"
        keyboardType="numeric"
        value={balance}
        onChangeText={setBalance}
      />
      <Picker
        selectedValue={depositoTypeId}
        style={styles.input}
        onValueChange={(itemValue) => setDepositoTypeId(itemValue)}
      >
        {depositoTypes.map((deposito) => (
          <Picker.Item key={deposito._id} label={deposito.name} value={deposito._id} />
        ))}
      </Picker>
      <Button title="Update Account" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default EditAccountScreen;
