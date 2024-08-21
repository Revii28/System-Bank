import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import { GET_DEPOSITO_TYPE } from '../graphql/queries';
import { UPDATE_DEPOSITO_TYPE } from '../graphql/mutations';

const EditDepositoTypeScreen = ({ route, navigation }) => {
  const { id } = route.params; 
  const [name, setName] = useState('');
  const [yearlyReturn, setYearlyReturn] = useState('');
  const [updateDepositoType, { loading: updating, error: updateError }] = useMutation(UPDATE_DEPOSITO_TYPE);
  const { data, loading: fetching, error: fetchError } = useQuery(GET_DEPOSITO_TYPE, {
    variables: { id },
    skip: !id,
  });

  useEffect(() => {
    if (data) {
      setName(data.depositoType.name);
      setYearlyReturn(data.depositoType.yearlyReturn.toString());
    }
  }, [data]);

  const handleSubmit = async () => {
    try {
      await updateDepositoType({
        variables: {
          id,
          name,
          yearlyReturn: parseFloat(yearlyReturn),
        },
      });
      navigation.goBack(); 
    } catch (e) {
      console.error('Failed to update deposito type', e);
    }
  };

  if (fetching || updating) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (fetchError || updateError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {fetchError?.message || updateError?.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Deposito Type</Text>
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
        title="Update Deposito Type"
        onPress={handleSubmit}
        disabled={updating}
      />
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

export default EditDepositoTypeScreen;
