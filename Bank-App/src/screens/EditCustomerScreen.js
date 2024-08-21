import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CUSTOMER } from '../graphql/queries';
import { UPDATE_CUSTOMER } from '../graphql/mutations';

const EditCustomerScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { data, loading, error } = useQuery(GET_CUSTOMER, { variables: { id } });
  const [updateCustomer] = useMutation(UPDATE_CUSTOMER);
  const [name, setName] = useState('');

  useEffect(() => {
    if (data) {
      setName(data.customer.name);
    }
  }, [data]);

  const handleUpdateCustomer = async () => {
    try {
      await updateCustomer({ variables: { id, name } });
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update customer');
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error fetching customer data</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Customer</Text>
      <TextInput
        style={styles.input}
        placeholder="Customer Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Update Customer" onPress={handleUpdateCustomer} />
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

export default EditCustomerScreen;
