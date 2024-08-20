import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://d114-103-18-34-247.ngrok-free.app',
  cache: new InMemoryCache(),
});

export default client;
