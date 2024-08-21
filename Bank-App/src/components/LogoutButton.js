import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const LogoutButton = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
    
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userRole');

      navigation.navigate('Login');
    } catch (error) {
      console.error('Gagal logout', error);
    }
  };

  return (
    <View style={styles.logoutButtonContainer}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  logoutButtonContainer: {
    marginRight: 10,
  },
});

export default LogoutButton;
