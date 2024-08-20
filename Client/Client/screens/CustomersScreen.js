import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_CUSTOMERS } from '../graphql/queries';
import * as SecureStore from 'expo-secure-store';
import CustomerList from '../components/CustomerList';

const CustomersScreen = ({ navigation }) => {
  const { loading, error, data } = useQuery(GET_CUSTOMERS);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const role = await SecureStore.getItemAsync('userRole');
      setIsAdmin(role === 'admin');
    };

    checkUserRole();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;

  return (
    <View style={styles.container}>
      <CustomerList
        customers={data.customers}
        onPressCustomer={(customer) => navigation.navigate('CustomerDetails', { customer })}
      />
      {isAdmin && (
        <Button title="Add Customer" onPress={() => navigation.navigate('AddCustomer')} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomersScreen;
