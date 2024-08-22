import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useMutation, useApolloClient } from '@apollo/client'; 
import { CREATE_ACCOUNT } from '../graphql/mutations';
import { GET_CUSTOMERS, GET_DEPOSITO_TYPES } from '../graphql/queries';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';

const CreateAccountUser = ({ navigation }) => {
  const [packet, setPacket] = useState('');
  const [balance, setBalance] = useState('');
  const [depositoTypeId, setDepositoTypeId] = useState('');
  const [customers, setCustomers] = useState([]);
  const [depositoTypes, setDepositoTypes] = useState([]);
  const [createAccount, { loading, error }] = useMutation(CREATE_ACCOUNT);
  const [loadingData, setLoadingData] = useState(true);
  const [customerId, setCustomerId] = useState('');

  const client = useApolloClient(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
   
        const { data: customerData } = await client.query({ query: GET_CUSTOMERS });
        const { data: depositoTypeData } = await client.query({ query: GET_DEPOSITO_TYPES });

        if (customerData && customerData.customers) {
          setCustomers(customerData.customers);
        } else {
          console.warn('No customers data found');
        }

        if (depositoTypeData && depositoTypeData.depositoTypes) {
          setDepositoTypes(depositoTypeData.depositoTypes);
        } else {
          console.warn('No deposito types data found');
        }

       
        const userId = await SecureStore.getItemAsync('_id');
        if (userId) {
          setCustomerId(userId);
        } else {
          console.warn('No userId found in SecureStore');
        }
      } catch (e) {
        console.error('Failed to fetch data', e);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [client]);

  const handleSubmit = async () => {
    if (!customerId || !depositoTypeId) {
      Alert.alert('Error', 'Please select a deposito type.');
      return;
    }
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

export default CreateAccountUser;
