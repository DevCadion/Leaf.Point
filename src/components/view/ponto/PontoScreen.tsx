// PontoScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import { modalStyles } from './modalStyles';
import { db } from '@/src/config/firebase'; // Importar Firestore
import { doc, getDoc } from 'firebase/firestore'; // Importar funções necessárias do Firestore
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import { useNavigation } from '@react-navigation/native'

import { StackTypes } from '@/src/routes'; //importação da stack de rotas


export default function PontoScreen() {
  const [currentDate, setCurrentDate] = useState('');
  const [lastConnection, setLastConnection] = useState('');
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [dates, setDates] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPosition, setUserPosition] = useState('');
  const [userId, setUserId] = useState<string | null>(null); // Guarda o UID

  const navigation = useNavigation<StackTypes>();

  useEffect(() => {
    const date = new Date();
    const dateString = date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    const timeString = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    setCurrentDate(dateString);
    setLastConnection(`${date.toLocaleDateString('pt-BR')} ${timeString}`);

    const days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(date);
      day.setDate(date.getDate() + (i - date.getDay()));
      return day.toLocaleDateString('pt-BR', { weekday: 'short' });
    });
    setWeekDays(days);

    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(date);
      day.setDate(date.getDate() + (i - date.getDay()));
      return day.getDate();
    });
    setDates(weekDates);
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const uid = await AsyncStorage.getItem('userUid'); // Recupera o UID do AsyncStorage
        if (uid) {
          setUserId(uid);
          console.log('UID carregado:', uid);
        } else {
          console.log('UID não encontrado no AsyncStorage');
        }
      } catch (error) {
        console.error('Erro ao carregar UID do AsyncStorage:', error);
      }
    };

    fetchUserId();
  }, []);

  // Função para abrir o modal e buscar os dados do usuário
  const openProfileModal = async () => {
    if (!userId) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }
  
    try {
      const userDocRef = doc(db, 'users', userId); // Usando o UID recuperado
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Dados do usuário:', userData);
        setUserName(userData.nome); 
        setUserPosition(userData.cargo); 
        setIsModalVisible(true); 
      } else {
        Alert.alert('Erro', 'Dados do usuário não encontrados');
        console.log('Documento do usuário não encontrado no Firestore.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar dados do usuário');
      console.error('Erro ao acessar Firestore:', error);
    }
  };

  const closeProfileModal = () => {
    setIsModalVisible(false); // Fecha o modal
  };

  const handleRecord = (type: 'entrada' | 'saida') => {
    alert(`Registrar ${type}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}
        onPress={()=> {navigation.navigate('WelcSome')}}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Ionicons name="leaf" size={40} color="white" />
        <TouchableOpacity style={styles.profileButton} onPress={openProfileModal}>
          <Ionicons name="person-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Data */}
      <Text style={styles.dateText}>{currentDate}</Text>

      {/* Última Conexão */}
      <Text style={styles.lastConnectionText}>
        Última vez conectado: {lastConnection}
      </Text>

      <Text style={styles.appTitle}>Leaf.Point</Text>

      {/* Lista da Semana */}
      <View style={styles.weekContainer}>
        {dates.map((date, index) => (
          <Text key={index} style={styles.weekDayText}>
            {date}
          </Text>
        ))}
      </View>
      <View style={styles.weekContainer}>
        {weekDays.map((day, index) => (
          <Text
            key={index}
            style={[
              styles.weekDayText,
              dates[index] === new Date().getDate() && styles.currentDay,
            ]}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Registros de Ponto */}
      <ScrollView style={styles.recordsContainer}>
        <TouchableOpacity style={styles.recordItem} onPress={() => handleRecord('entrada')}>
          <FontAwesome name="sign-in" size={24} color="black" />
          <Text style={styles.recordText}>1ª Entrada</Text>
          <Text style={styles.recordTime}>06:00</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recordItem} onPress={() => handleRecord('saida')}>
          <FontAwesome name="sign-out" size={24} color="black" />
          <Text style={styles.recordText}>1ª Saída</Text>
          <Text style={styles.recordTime}>10:00</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recordItem} onPress={() => handleRecord('entrada')}>
          <FontAwesome name="sign-in" size={24} color="black" />
          <Text style={styles.recordText}>2ª Entrada</Text>
          <Text style={styles.recordTime}>11:30</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recordItem} onPress={() => handleRecord('saida')}>
          <FontAwesome name="sign-out" size={24} color="black" />
          <Text style={styles.recordText}>2ª Saída</Text>
          <Text style={styles.recordTime}>15:30</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Perfil */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeProfileModal}
      >
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>Perfil do Usuário</Text>
            <Text style={modalStyles.modalText}>Nome: {userName}</Text>
            <Text style={modalStyles.modalText}>Cargo: {userPosition}</Text>
            <TouchableOpacity style={modalStyles.closeButton} onPress={closeProfileModal}>
              <Text style={modalStyles.closeButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
