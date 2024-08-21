import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './src/stack/MainStack';
import client from './src/graphql/client.js'; 

const App = () => {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
