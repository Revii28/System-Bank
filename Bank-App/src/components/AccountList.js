import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AccountList = ({ accounts, onPressAccount }) => {
  return (
    <View>
      {accounts.map((account) => (
        <View key={account._id} style={styles.item}>
          <Text>{account.packet}</Text>
          <Button title="Details" onPress={() => onPressAccount(account)} />
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

export default AccountList;
