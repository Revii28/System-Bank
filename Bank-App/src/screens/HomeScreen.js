import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const storedRole = await SecureStore.getItemAsync('userRole');
        setRole(storedRole);
      } catch (e) {
        setError('Failed to load role');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

  const navigateToDashboard = () => {
    if (role === 'admin') {
      navigation.navigate('MainTab', { screen: 'AdminDashboard' });
    } else {
      navigation.navigate('MainTab', { screen: 'CustomerDashboard' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pilih Dashboard</Text>
      <Button
        title="Go to Dashboard"
        onPress={navigateToDashboard}
        style={styles.button}
      />
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
    marginBottom: 20,
  },
  button: {
    margin: 10,
  },
});

export default HomeScreen;
