import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CUSTOMERS } from '../graphql/queries';
import { DELETE_CUSTOMER, CREATE_CUSTOMER, UPDATE_CUSTOMER } from '../graphql/mutations';

const ManageCustomerScreen = ({ navigation }) => {
  const { data, loading, error, refetch } = useQuery(GET_CUSTOMERS);
  const [deleteCustomer] = useMutation(DELETE_CUSTOMER);
  const [createCustomer] = useMutation(CREATE_CUSTOMER);
  const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

  const [formVisible, setFormVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerName, setCustomerName] = useState('');

  const handleDelete = async (id) => {
    Alert.alert(
      'Delete Customer',
      'Are you sure you want to delete this customer?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await deleteCustomer({ variables: { id } });
              refetch();
            } catch (err) {
              console.error('Error deleting customer:', err);
              Alert.alert('Error', 'Failed to delete customer');
            }
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    if (editingCustomer) {
     
      try {
        await updateCustomer({ variables: { id: editingCustomer._id, name: customerName } });
        setEditingCustomer(null);
      } catch (err) {
        console.error('Error updating customer:', err);
        Alert.alert('Error', 'Failed to update customer');
      }
    } else {
    
      try {
        await createCustomer({ variables: { name: customerName } });
      } catch (err) {
        console.error('Error creating customer:', err);
        Alert.alert('Error', 'Failed to create customer');
      }
    }
    setCustomerName('');
    setFormVisible(false);
    refetch(); 
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) {
    console.error('Error fetching customers:', error);
    return <Text>Error fetching customers</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Customers</Text>
      <Button title="Add Customer" onPress={() => { setFormVisible(true); setEditingCustomer(null); }} />
      
      {formVisible && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Customer Name"
            value={customerName}
            onChangeText={setCustomerName}
          />
          <Button title={editingCustomer ? "Update Customer" : "Create Customer"} onPress={handleSave} />
          <Button title="Cancel" onPress={() => { setFormVisible(false); setCustomerName(''); }} color="gray" />
        </View>
      )}

      <FlatList
        data={data.customers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.customerName}>{item.name}</Text>
            <View style={styles.buttons}>
              <Button
                title="Edit"
                onPress={() => { setCustomerName(item.name); setEditingCustomer(item); setFormVisible(true); }}
              />
              <Button title="Delete" onPress={() => handleDelete(item._id)} color="red" />
            </View>
          </View>
        )}
      />
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
  item: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
    paddingTop: 8,
  },
  customerName: {
    fontSize: 18,
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  form: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
});

export default ManageCustomerScreen;
