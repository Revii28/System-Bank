import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const CustomerDetailsScreen = ({ route, navigation }) => {
  const { customer } = route.params;
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const role = await SecureStore.getItemAsync('userRole');
      setIsAdmin(role === 'admin');
    };

    checkUserRole();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Name: {customer.name}</Text>
      {isAdmin && (
        <>
          <Button
            title="Edit Customer"
            onPress={() => navigation.navigate('EditCustomer', { customer })}
          />
          <Button
            title="Add Account"
            onPress={() => navigation.navigate('AddAccount', { customerId: customer._id })}
          />
        </>
      )}
      <FlatList
        data={customer.accounts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Button
            title={`Account ${item.packet}`}
            onPress={() => navigation.navigate('AccountDetails', { account: item })}
          />
        )}
      />
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

export default CustomerDetailsScreen;
