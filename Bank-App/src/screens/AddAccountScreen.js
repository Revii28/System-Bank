import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker, ActivityIndicator } from 'react-native';
import { useMutation } from '@apollo/client';
import { CREATE_ACCOUNT } from '../graphql/mutations';
import { GET_CUSTOMERS } from '../graphql/queries';
import { GET_DEPOSITO_TYPES } from '../graphql/queries';

const AddAccountScreen = ({ navigation }) => {
  const [packet, setPacket] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [balance, setBalance] = useState('');
  const [depositoTypeId, setDepositoTypeId] = useState('');
  const [customers, setCustomers] = useState([]);
  const [depositoTypes, setDepositoTypes] = useState([]);
  const [createAccount, { loading, error }] = useMutation(CREATE_ACCOUNT);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: customerData } = await client.query({ query: GET_CUSTOMERS });
        const { data: depositoTypeData } = await client.query({ query: GET_DEPOSITO_TYPES });

        setCustomers(customerData.customers);
        setDepositoTypes(depositoTypeData.depositoTypes);
      } catch (e) {
        console.error('Failed to fetch data', e);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      await createAccount({
        variables: {
          packet,
          customerId,
          balance: parseFloat(balance),
          depositoTypeId,
        },
      });
      navigation.goBack(); 
    } catch (e) {
      console.error('Failed to create account', e);
    }
  };

  if (loading || loadingData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Account</Text>
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
        <Picker.Item label="Select Customer" value="" />
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
        <Picker.Item label="Select Deposito Type" value="" />
        {depositoTypes.map((deposito) => (
          <Picker.Item key={deposito._id} label={deposito.name} value={deposito._id} />
        ))}
      </Picker>
      <Button title="Add Account" onPress={handleSubmit} />
      {error && <Text style={styles.errorText}>{error.message}</Text>}
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

export default AddAccountScreen;
