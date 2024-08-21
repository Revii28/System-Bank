import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';

const httpLink = createHttpLink({
  uri: 'https://6ed7-103-18-34-247.ngrok-free.app',
});

const authLink = setContext(async (_, { headers }) => {
  try {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    console.log('Access Token:', accessToken); 

    return {
      headers: {
        ...headers,
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    };
  } catch (error) {
    console.error('Error getting access token:', error);
    return {
      headers,
    };
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
