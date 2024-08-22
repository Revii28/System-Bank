import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useMutation } from '@apollo/client';
import { CREATE_DEPOSITO_TYPE } from '../graphql/mutations';
import { useNavigation } from '@react-navigation/native';

const AddDepositoTypeScreen = ({ route }) => {
  const [name, setName] = useState('');
  const [yearlyReturn, setYearlyReturn] = useState('');
  const [createDepositoType] = useMutation(CREATE_DEPOSITO_TYPE, {
    onCompleted: () => {
      if (route.params?.refetch) {
        route.params.refetch();
      }
      Alert.alert('Success', 'Deposito type added successfully');
      navigation.goBack();
    },
    onError: () => {
      Alert.alert('Error', 'Failed to add deposito type');
    }
  });
  const navigation = useNavigation();

  const handleAdd = async () => {
    if (!name || !yearlyReturn) {
      Alert.alert('Validation Error', 'Please provide both name and yearly return.');
      return;
    }

    try {
      await createDepositoType({
        variables: { name, yearlyReturn: parseFloat(yearlyReturn) },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to add deposito type');
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
      <Button title="Add" onPress={handleAdd} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});

export default AddDepositoTypeScreen;
