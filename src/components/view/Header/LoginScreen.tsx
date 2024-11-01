// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/src/config/firebase';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native'




export default function LoginScreen() { 

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigation.navigate('PontoScreen');  
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Login Failed", errorMessage);
      });
  };

  return (
    <View style={styles.containers}>
      <Text style={styles.title}>Leaf.Point</Text>
      <Text style={styles.subtitle}>Entrar...</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#A9A9A9"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha..."
        placeholderTextColor="#A9A9A9"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Concluir</Text>
      </TouchableOpacity>

      <Text style={styles.linkText}>
        Já tem conta?{' '}
        <TouchableOpacity onPress={() => console.log('Cadastre-se Pressed')}>
          <Text style={styles.link}>Cadastre - se</Text>
        </TouchableOpacity>
      </Text>

      <View style={styles.logoContainer}>
        <Image
          source={require('@/src/assets/logo_centro.png')}
          style={styles.logo}
        />
      </View>
    </View>
  );
}
