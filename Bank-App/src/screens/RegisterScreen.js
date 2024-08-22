import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { gql, useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { REGISTER } from '../graphql/mutations';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [register] = useMutation(REGISTER);
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      const { data } = await register({ variables: { username, password } });
      if (data && data.register.message === "success") {
        Alert.alert('Registration Successful', 'Pendaftaran berhasil. Silakan login.');
        navigation.navigate('Login'); 
      }
    } catch (error) {
      Alert.alert('Registration Failed', 'Pendaftaran gagal, coba lagi.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} />
      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')}
        color="#007bff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default RegisterScreen;
