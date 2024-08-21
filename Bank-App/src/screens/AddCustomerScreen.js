import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useMutation } from '@apollo/client';
import { CREATE_CUSTOMER } from '../graphql/mutations';

const AddCustomerScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [createCustomer] = useMutation(CREATE_CUSTOMER);

  const handleAddCustomer = async () => {
    try {
      await createCustomer({ variables: { name } });
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create customer');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Customer</Text>
      <TextInput
        style={styles.input}
        placeholder="Customer Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Add Customer" onPress={handleAddCustomer} />
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
});

export default AddCustomerScreen;
