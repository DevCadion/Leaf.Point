import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import { db } from '@/src/config/firebase'; 
import { doc, collection, getDoc, updateDoc, setDoc } from 'firebase/firestore'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import * as LocalAuthentication from 'expo-local-authentication'; // Importa LocalAuthentication

interface ScheduleTableProps {
  onAuthenticate: () => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ onAuthenticate }) => {
  const [workSchedule, setWorkSchedule] = useState<any>({}); 
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkSchedule = async () => {
      try {
        const uid = await AsyncStorage.getItem('userUid');
        setUserId(uid);

        if (uid) {
          const scheduleRef = doc(collection(db, 'users', uid, 'workSchedule'), 'today'); 
          const scheduleDoc = await getDoc(scheduleRef);

          if (scheduleDoc.exists()) {
            setWorkSchedule(scheduleDoc.data());
          } else {
            console.log('Nenhum horário encontrado para o dia.');
            // Se não encontrar, cria o documento com horários padrão
            await setDoc(scheduleRef, {
                tartTime1: '08:30',
                endTime1: '12:00',
                startTime2: '13:30',
                endTime2: '17:30',
            });
            setWorkSchedule({
                tartTime1: '08:30',
                endTime1: '12:00',
                startTime2: '13:30',
                endTime2: '17:30',
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar horários:', error);
      }
    };

    fetchWorkSchedule();
  }, []);

  const handleBiometricAuthentication = async () => {
    const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (!isBiometricEnrolled) {
      Alert.alert('Erro', 'Nenhuma biometria cadastrada no dispositivo.');
      return;
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

  const handleUpdateTime = async (field: string) => {
    if (!userId) return;

    // Primeiro, autentique o usuário com biometria
    const isAuthenticated = await handleBiometricAuthentication();
    
    if (!isAuthenticated) {
      return; // Não prossegue se a autenticação falhar
    }

    // Se a autenticação for bem-sucedida, registre a hora
    const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const scheduleRef = doc(collection(db, 'users', userId, 'workSchedule'), 'today');

    try {
      await updateDoc(scheduleRef, { [field]: currentTime });
      setWorkSchedule((prev: any) => ({ ...prev, [field]: currentTime }));
      onAuthenticate(); // Chama a função de callback para autenticação
    } catch (error) {
      console.error('Erro ao atualizar horário:', error);
    }
  };

  return (
    <ScrollView style={styles.recordsContainer}>
      <TouchableOpacity style={styles.recordItem} onPress={() => handleUpdateTime('startTime1')}>
        <FontAwesome name="sign-in" size={24} color="black" />
        <Text style={styles.recordText}>1ª Entrada</Text>
        <Text style={styles.recordTime}>{workSchedule.startTime1 || '06:00'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.recordItem} onPress={() => handleUpdateTime('endTime1')}>
        <FontAwesome name="sign-out" size={24} color="black" />
        <Text style={styles.recordText}>1ª Saída</Text>
        <Text style={styles.recordTime}>{workSchedule.endTime1 || '10:00'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.recordItem} onPress={() => handleUpdateTime('startTime2')}>
        <FontAwesome name="sign-in" size={24} color="black" />
        <Text style={styles.recordText}>2ª Entrada</Text>
        <Text style={styles.recordTime}>{workSchedule.startTime2 || '11:30'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.recordItem} onPress={() => handleUpdateTime('endTime2')}>
        <FontAwesome name="sign-out" size={24} color="black" />
        <Text style={styles.recordText}>2ª Saída</Text>
        <Text style={styles.recordTime}>{workSchedule.endTime2 || '15:30'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ScheduleTable;
