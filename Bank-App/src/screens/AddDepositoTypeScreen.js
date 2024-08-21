import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useMutation } from '@apollo/client';
import { CREATE_DEPOSITO_TYPE } from '../graphql/mutations';

const AddDepositoTypeScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [yearlyReturn, setYearlyReturn] = useState('');
  const [createDepositoType, { loading, error }] = useMutation(CREATE_DEPOSITO_TYPE);

  const handleSubmit = async () => {
    try {
      await createDepositoType({
        variables: {
          name,
          yearlyReturn: parseFloat(yearlyReturn),
        },
      });
      navigation.goBack(); // Navigate back after successful creation
    } catch (e) {
      console.error('Failed to create deposito type', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Deposito Type</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Yearly Return (%)"
        keyboardType="numeric"
        value={yearlyReturn}
        onChangeText={setYearlyReturn}
      />
      <Button
        title="Add Deposito Type"
        onPress={handleSubmit}
        disabled={loading}
      />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
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

export default AddDepositoTypeScreen;
