import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const DepositoTypeList = ({ depositoTypes, onPressDepositoType }) => {
  return (
    <View>
      {depositoTypes.map((depositoType) => (
        <View key={depositoType._id} style={styles.item}>
          <Text>{depositoType.name}</Text>
          <Button title="Details" onPress={() => onPressDepositoType(depositoType)} />
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

export default DepositoTypeList;
