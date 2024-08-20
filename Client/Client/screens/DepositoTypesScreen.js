import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_DEPOSITO_TYPES } from '../graphql/queries';
import DepositoTypeList from '../components/DepositoTypeList';

const DepositoTypesScreen = ({ navigation }) => {
  const { loading, error, data } = useQuery(GET_DEPOSITO_TYPES);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;

  return (
    <View style={styles.container}>
      <DepositoTypeList
        depositoTypes={data.depositoTypes}
        onPressDepositoType={(depositoType) => navigation.navigate('DepositoTypeDetails', { depositoType })}
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

export default DepositoTypesScreen;
