// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/src/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';

import { FirebaseError } from 'firebase/app';

import { StackTypes } from '@/src/routes'; //importação da stack de rotas

export default function LoginScreen() { 
  const navigation = useNavigation<StackTypes>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  
  
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Salva o UID do usuário no AsyncStorage
      await AsyncStorage.setItem('userUid', user.uid);
      console.log('UID do usuário salvo:', user.uid);
  
      navigation.navigate('PontoScreen');  
    } catch (error) {
      // Verifique se o erro é uma instância de FirebaseError
      if (error instanceof FirebaseError) {
        // Tratamento de erros específicos do Firebase
        if (error.code === 'auth/invalid-email') {
          Alert.alert("Email Inválido", "Por favor, insira um endereço de e-mail válido.");
        } else if (error.code === 'auth/wrong-password') {
          Alert.alert("Senha Incorreta", "A senha fornecida está incorreta. Tente novamente.");
        } else if (error.code === 'auth/user-not-found') {
          Alert.alert("Usuário Não Encontrado", "Não há nenhum usuário cadastrado com esse e-mail.");
        } else {
          Alert.alert("Login Failed", error.message); // Exibe mensagem de erro genérica
        }
      } else {
        // Tratamento de erro genérico caso não seja do Firebase
        Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente.");
      }
  
      console.error(error); // Loga o erro no console
    }
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
