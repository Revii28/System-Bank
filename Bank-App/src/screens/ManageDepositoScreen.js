import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { GET_DEPOSITO_TYPES, DELETE_DEPOSITO_TYPE } from '../graphql/queries';
import { CREATE_DEPOSITO_TYPE, UPDATE_DEPOSITO_TYPE } from '../graphql/mutations';

const ManageDepositoScreen = ({ navigation }) => {
  const { data, loading, error, refetch } = useQuery(GET_DEPOSITO_TYPES);
  const [deleteDepositoType] = useMutation(DELETE_DEPOSITO_TYPE);

  const handleDelete = async (id) => {
    try {
      await deleteDepositoType({ variables: { id } });
      refetch();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to delete deposito type');
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error fetching deposito types</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Deposito Types</Text>
      <Button title="Add Deposito Type" onPress={() => navigation.navigate('AddDepositoType')} />
      <FlatList
        data={data.depositoTypes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name} - {item.yearlyReturn}%</Text>
            <Button title="Edit" onPress={() => navigation.navigate('EditDepositoType', { id: item._id })} />
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

export default ManageDepositoScreen;
