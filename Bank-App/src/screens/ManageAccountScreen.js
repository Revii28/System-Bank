import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ACCOUNTS, DELETE_ACCOUNT } from '../graphql/queries';
import { CREATE_ACCOUNT, UPDATE_ACCOUNT } from '../graphql/mutations';

const ManageAccountScreen = ({ navigation }) => {
  const { data, loading, error, refetch } = useQuery(GET_ACCOUNTS);
  const [deleteAccount] = useMutation(DELETE_ACCOUNT);

  const handleDelete = async (id) => {
    try {
      await deleteAccount({ variables: { id } });
      refetch();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to delete account');
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error fetching accounts</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Accounts</Text>
      <Button title="Add Account" onPress={() => navigation.navigate('AddAccount')} />
      <FlatList
        data={data.accounts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.packet} - {item.balance}</Text>
            <Button title="Edit" onPress={() => navigation.navigate('EditAccount', { id: item._id })} />
            <Button title="Delete" onPress={() => handleDelete(item._id)} color="red" />
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
  },
});

export default ManageAccountScreen;
