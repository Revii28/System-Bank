import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Button, Alert } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ACCOUNTS } from '../graphql/queries';
import {
  CREATE_ACCOUNT,
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
} from '../graphql/mutations';

const formatCurrencyIDR = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

const calculateBalanceWithInterest = (balance, yearlyReturn, months) => {
  const monthlyReturn = yearlyReturn / 12 / 100;
  const endingBalance = balance * (1 + monthlyReturn) ** months;
  return endingBalance;
};

const ManageAccountScreen = () => {
  const { data: accountsData, loading: accountsLoading, error: accountsError, refetch } = useQuery(GET_ACCOUNTS);
  const [createAccount] = useMutation(CREATE_ACCOUNT);
  const [updateAccount] = useMutation(UPDATE_ACCOUNT);
  const [deleteAccount] = useMutation(DELETE_ACCOUNT);

  const [editingAccount, setEditingAccount] = useState(null);
  const [packet, setPacket] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [balance, setBalance] = useState('');
  const [depositoTypeId, setDepositoTypeId] = useState('');

  const handleCreateAccount = async () => {
    try {
      await createAccount({
        variables: { packet, customerId, balance: parseFloat(balance), depositoTypeId },
      });
      setPacket('');
      setCustomerId('');
      setBalance('');
      setDepositoTypeId('');
      refetch();
    } catch (err) {
      console.error('Failed to create account:', err);
    }
  };

  const handleUpdateAccount = async () => {
    if (editingAccount) {
      try {
        await updateAccount({
          variables: { id: editingAccount._id, packet, balance: parseFloat(balance), depositoTypeId },
        });
        setEditingAccount(null);
        setPacket('');
        setBalance('');
        setDepositoTypeId('');
        refetch();
      } catch (err) {
        console.error('Failed to update account:', err);
      }
    }
  };

  const handleDeleteAccount = async (id) => {
    try {
      await deleteAccount({ variables: { id } });
      refetch();
    } catch (err) {
      console.error('Failed to delete account:', err);
    }
  };

  const startEdit = (account) => {
    setEditingAccount(account);
    setPacket(account.packet);
    setBalance(account.balance.toString());
    setDepositoTypeId(account.depositoType._id);
  };

  if (accountsLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (accountsError) {
    console.error('Error fetching accounts:', accountsError.message);
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error fetching accounts: {accountsError.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Accounts</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Packet"
          value={packet}
          onChangeText={setPacket}
        />
        <TextInput
          style={styles.input}
          placeholder="Customer ID"
          value={customerId}
          onChangeText={setCustomerId}
        />
        <TextInput
          style={styles.input}
          placeholder="Balance"
          value={balance}
          keyboardType="numeric"
          onChangeText={setBalance}
        />
        <TextInput
          style={styles.input}
          placeholder="Deposito Type ID"
          value={depositoTypeId}
          onChangeText={setDepositoTypeId}
        />
        <Button
          title={editingAccount ? "Update Account" : "Create Account"}
          onPress={editingAccount ? handleUpdateAccount : handleCreateAccount}
        />
        {editingAccount && (
          <Button
            title="Cancel"
            onPress={() => {
              setEditingAccount(null);
              setPacket('');
              setBalance('');
              setDepositoTypeId('');
            }}
          />
        )}
      </View>

      <FlatList
        data={accountsData?.accounts || []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const endingBalance = calculateBalanceWithInterest(item.balance, item.depositoType.yearlyReturn, 12); // Example: 12 months
          
          return (
            <View style={styles.itemContainer}>
              <View style={styles.item}>
                <Text style={styles.itemText}><Text style={styles.label}>Packet:</Text> {item.packet}</Text>
                <Text style={styles.itemText}><Text style={styles.label}>Customer:</Text> {item.customer.name}</Text>
                <Text style={styles.itemText}><Text style={styles.label}>Balance:</Text> {formatCurrencyIDR(item.balance)}</Text>
                <Text style={styles.itemText}><Text style={styles.label}>Deposito Type:</Text> {item.depositoType.name}</Text>
                <Text style={styles.itemText}><Text style={styles.label}>Yearly Return:</Text> {item.depositoType.yearlyReturn}%</Text>
                <Text style={styles.itemText}><Text style={styles.label}>Balance with Interest (12 months):</Text> {formatCurrencyIDR(endingBalance)}</Text>
                <View style={styles.buttonContainer}>
                  <Button title="Edit" onPress={() => startEdit(item)} />
                  <Button title="Delete" onPress={() => {
                    Alert.alert(
                      'Confirm Deletion',
                      'Are you sure you want to delete this account?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'OK', onPress: () => handleDeleteAccount(item._id) }
                      ]
                    );
                  }} color="red" />
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  itemContainer: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  item: {
    padding: 16,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  form: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ManageAccountScreen;
