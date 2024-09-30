import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import {styles} from './styles';

export default function LoginScreen() {
  return (
    <View style={styles.containers}>
      <Text style={styles.title}>Leaf.Point</Text>
      <Text style={styles.subtitle}>Entrar...</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#A9A9A9"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha..."
        placeholderTextColor="#A9A9A9"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={() => console.log('Concluir Pressed')}>
        <Text style={styles.buttonText}>Concluir</Text>
      </TouchableOpacity>

      <Text style={styles.linkText}>
        Já tem conta?{' '}
        <TouchableOpacity onPress={() => console.log('Cadastre-se Pressed')}>
          <Text style={styles.link}>Cadastre - se</Text>
        </TouchableOpacity>
      </Text>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('@/src/assets/logo_centro.png')} // Ajuste o caminho conforme sua estrutura de projeto
          style={styles.logo}
        />
      </View>
    </View>
  );
}