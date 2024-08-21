import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { GET_DEPOSITO_TYPES, DELETE_DEPOSITO_TYPE } from '../graphql/queries';
import { useNavigation } from '@react-navigation/native';

const ManageDepositoTypeScreen = () => {
  const [depositoTypes, setDepositoTypes] = useState([]);
  const { data, refetch } = useQuery(GET_DEPOSITO_TYPES);
  const [deleteDepositoType] = useMutation(DELETE_DEPOSITO_TYPE);
  const navigation = useNavigation();

  useEffect(() => {
    if (data) {
      setDepositoTypes(data.depositoTypes);
    }
  }, [data]);

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Deposito Type',
      'Are you sure you want to delete this deposito type?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await deleteDepositoType({ variables: { id } });
              await refetch();
              Alert.alert('Success', 'Deposito type deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete deposito type');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name} - {item.yearlyReturn}%</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EditDepositoType', { depositoTypeId: item._id })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleDelete(item._id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Deposito Types</Text>
      <Button
        title="Add Deposito Type"
        onPress={() => navigation.navigate('AddDepositoType')}
      />
      <FlatList
        data={depositoTypes}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ManageDepositoTypeScreen;
