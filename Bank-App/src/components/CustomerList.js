import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const CustomerList = ({ customers, onPressCustomer }) => {
  return (
    <View>
      {customers.map((customer) => (
        <View key={customer._id} style={styles.item}>
          <Text>{customer.name}</Text>
          <Button title="Details" onPress={() => onPressCustomer(customer)} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginBottom: 10,
  },
});

export default CustomerList;
