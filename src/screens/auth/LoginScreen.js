import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig'; // Corrected import

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password.');
        return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged in App.js will handle navigation
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Your UI components (Image, TextInput, TouchableOpacity) go here */}
      <Text>Login Screen</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

// Add your styles here
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    input: { width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
    button: { backgroundColor: 'green', padding: 10, borderRadius: 5 },
    buttonText: { color: 'white', textAlign: 'center' },
    linkText: { color: 'blue', marginTop: 15 }
});
