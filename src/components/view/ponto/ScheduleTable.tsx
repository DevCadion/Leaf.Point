import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import { db } from '@/src/config/firebase'; 
import { doc, collection, getDoc, updateDoc, setDoc } from 'firebase/firestore'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import * as LocalAuthentication from 'expo-local-authentication';

interface WorkSchedule {
  startTime1: string | null;
  endTime1: string | null;
  startTime2: string | null;
  endTime2: string | null;
}

interface ScheduleTableProps {
  onAuthenticate: () => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ onAuthenticate }) => {
  const [workSchedule, setWorkSchedule] = useState<WorkSchedule>({
    startTime1: null,
    endTime1: null,
    startTime2: null,
    endTime2: null,
  });
  const [userId, setUserId] = useState<string | null>(null);

  // Efetua o carregamento do horário de trabalho quando o componente é montado
  useEffect(() => {
    const fetchWorkSchedule = async () => {
      try {
        const uid = await AsyncStorage.getItem('userUid');
        setUserId(uid);

        if (uid) {
          const scheduleRef = doc(collection(db, 'users', uid, 'workSchedule'), 'today');
          const scheduleDoc = await getDoc(scheduleRef);

          if (scheduleDoc.exists()) {
            setWorkSchedule(scheduleDoc.data() as WorkSchedule);
          } else {
            console.log('Nenhum horário encontrado para o dia.');
            const defaultSchedule: WorkSchedule = {
              startTime1: null,
              endTime1: null,
              startTime2: null,
              endTime2: null,
            };
            await setDoc(scheduleRef, defaultSchedule);
            setWorkSchedule(defaultSchedule);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar horários:', error);
      }
    };

    fetchWorkSchedule();
  }, []);

  // Função para autenticação biométrica
  const handleBiometricAuthentication = async (): Promise<boolean> => {
    const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (!isBiometricEnrolled) {
      Alert.alert('Erro', 'Nenhuma biometria cadastrada no dispositivo.');
      return false;
    }

    const authResult = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autentique-se para registrar o horário.',
      fallbackLabel: 'Não consigo usar a biometria',
    });

    if (authResult.success) {
      return true;
    } else {
      Alert.alert('Erro', 'Autenticação biométrica falhou ou foi cancelada.');
      return false;
    }
  };

  // Função de registro de horários
  const handleUpdateTime = async (field: keyof WorkSchedule) => {
    if (!userId) return;

    // Realizar a autenticação biométrica
    const isAuthenticated = await handleBiometricAuthentication();
    if (!isAuthenticated) return;

    // Obter a hora atual
    const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    // Definir o documento com a data do dia (ano-mês-dia) como ID
    const currentDate = new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-'); // Formato: YYYY-MM-DD

    // Referência ao documento do horário de trabalho para o dia específico
    const scheduleRef = doc(collection(db, 'users', userId, 'workSchedule'), currentDate); 

    // Preparar os dados a serem salvos para o campo correspondente
    const newScheduleData = { 
      [field]: currentTime 
    };

    try {
      // Salvar ou criar o documento com a data do dia e os horários registrados
      await setDoc(scheduleRef, newScheduleData, { merge: true }); // O merge: true evita sobrescrever campos existentes
      setWorkSchedule((prev) => ({ ...prev, [field]: currentTime }));
      if (onAuthenticate) onAuthenticate();  // Chama a função para autenticação
    } catch (error) {
      console.error('Erro ao registrar horário:', error);
    }
  };

  return (
    <ScrollView style={styles.recordsContainer}>
      <TouchableOpacity style={styles.recordItem} onPress={() => handleUpdateTime('startTime1')}>
        <FontAwesome name="sign-in" size={24} color="black" />
        <Text style={styles.recordText}>1ª Entrada</Text>
        <Text style={styles.recordTime}>{workSchedule.startTime1 || 'Horário não registrado'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.recordItem} onPress={() => handleUpdateTime('endTime1')}>
        <FontAwesome name="sign-out" size={24} color="black" />
        <Text style={styles.recordText}>1ª Saída</Text>
        <Text style={styles.recordTime}>{workSchedule.endTime1 || 'Horário não registrado'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.recordItem} onPress={() => handleUpdateTime('startTime2')}>
        <FontAwesome name="sign-in" size={24} color="black" />
        <Text style={styles.recordText}>2ª Entrada</Text>
        <Text style={styles.recordTime}>{workSchedule.startTime2 || 'Horário não registrado'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.recordItem} onPress={() => handleUpdateTime('endTime2')}>
        <FontAwesome name="sign-out" size={24} color="black" />
        <Text style={styles.recordText}>2ª Saída</Text>
        <Text style={styles.recordTime}>{workSchedule.endTime2 || 'Horário não registrado'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ScheduleTable;
