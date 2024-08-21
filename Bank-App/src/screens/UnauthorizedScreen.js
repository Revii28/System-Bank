import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const UnauthorizedScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unauthorized Access</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default UnauthorizedScreen;
