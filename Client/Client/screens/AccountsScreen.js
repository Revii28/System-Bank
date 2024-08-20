import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_ACCOUNTS } from '../graphql/queries';
import AccountList from '../components/AccountList';

const AccountsScreen = ({ navigation }) => {
  const { loading, error, data } = useQuery(GET_ACCOUNTS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;

  return (
    <View style={styles.container}>
      <AccountList
        accounts={data.accounts}
        onPressAccount={(account) => navigation.navigate('AccountDetails', { account })}
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

export default AccountsScreen;
