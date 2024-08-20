import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import client from './graphql/client';

import HomeScreen from './screens/HomeScreen';
import CustomersScreen from './screens/CustomersScreen';
import CustomerDetailsScreen from './screens/CustomerDetailsScreen';
import AccountsScreen from './screens/AccountsScreen';
import AccountDetailsScreen from './screens/AccountDetailsScreen';
import DepositoTypesScreen from './screens/DepositoTypesScreen';
import DepositScreen from './screens/DepositScreen';
import WithdrawScreen from './screens/WithdrawScreen';
import AddCustomerScreen from './screens/AddCustomerScreen';
import EditCustomerScreen from './screens/EditCustomerScreen';
import AddAccountScreen from './screens/AddAccountScreen';
import EditAccountScreen from './screens/EditAccountScreen';
import AddDepositoTypeScreen from './screens/AddDepositoTypeScreen';
import EditDepositoTypeScreen from './screens/EditDepositoTypeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Customers" component={CustomersScreen} />
          <Stack.Screen name="CustomerDetails" component={CustomerDetailsScreen} />
          <Stack.Screen name="Accounts" component={AccountsScreen} />
          <Stack.Screen name="AccountDetails" component={AccountDetailsScreen} />
          <Stack.Screen name="DepositoTypes" component={DepositoTypesScreen} />
          <Stack.Screen name="Deposit" component={DepositScreen} />
          <Stack.Screen name="Withdraw" component={WithdrawScreen} />
          <Stack.Screen name="AddCustomer" component={AddCustomerScreen} />
          <Stack.Screen name="EditCustomer" component={EditCustomerScreen} />
          <Stack.Screen name="AddAccount" component={AddAccountScreen} />
          <Stack.Screen name="EditAccount" component={EditAccountScreen} />
          <Stack.Screen name="AddDepositoType" component={AddDepositoTypeScreen} />
          <Stack.Screen name="EditDepositoType" component={EditDepositoTypeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
