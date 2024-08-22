import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useQuery } from '@apollo/client';
import { useRoute } from '@react-navigation/native';
import { GET_ACCOUNT_DETAILS } from '../graphql/queries';

function AccountDetailsScreen() {
  const route = useRoute();
  const { accountId } = route.params;

  const { loading, error, data } = useQuery(GET_ACCOUNT_DETAILS, {
    variables: { accountId },
  });

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const { getAccountDetails } = data;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Account Details</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{getAccountDetails._id}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Packet:</Text>
        <Text style={styles.value}>{getAccountDetails.packet}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Customer Name:</Text>
        <Text style={styles.value}>{getAccountDetails.customer.name}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Balance:</Text>
        <Text style={styles.value}>{getAccountDetails.balance.toFixed(2)}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Deposito Type:</Text>
        <Text style={styles.value}>{getAccountDetails.depositoType.name}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Yearly Return:</Text>
        <Text style={styles.value}>{getAccountDetails.depositoType.yearlyReturn.toFixed(2)}%</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Balance with Interest:</Text>
        <Text style={styles.value}>{getAccountDetails.balanceWithInterest.toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default AccountDetailsScreen;
