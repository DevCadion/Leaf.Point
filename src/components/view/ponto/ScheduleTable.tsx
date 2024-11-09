import styles from './styles';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { db } from '@/src/config/firebase'; 
import { doc, collection, getDoc, setDoc } from 'firebase/firestore'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import { GeoPoint } from 'firebase/firestore';

interface WorkSchedule {
  startTime1: string | null;
  endTime1: string | null;
  startTime2: string | null;
  endTime2: string | null;
}

interface DefaultSchedule {
  startTime1: string;
  endTime1: string;
  startTime2: string;
  endTime2: string;
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
  const [defaultSchedule, setDefaultSchedule] = useState<DefaultSchedule | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [targetLocation, setTargetLocation] = useState<GeoPoint | null>(null); 
  const targetRadius = 100;

  // Carregar horários de expediente e do usuário
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const uid = await AsyncStorage.getItem('userUid');
        setUserId(uid);

        // Buscar horários padrão do expediente
        const defaultScheduleRef = doc(db, 'expediente', 'defaultTimes');
        const defaultScheduleDoc = await getDoc(defaultScheduleRef);

        if (defaultScheduleDoc.exists()) {
          setDefaultSchedule(defaultScheduleDoc.data() as DefaultSchedule);
          console.log('Horários padrão carregados:', defaultScheduleDoc.data());
        } else {
          console.log('Horários padrão do expediente não encontrados. Criando um novo documento...');
          const defaultTimes = {
            startTime1: '08:30',
            endTime1: '12:00',
            startTime2: '14:00',
            endTime2: '18:00',
          };
          await setDoc(defaultScheduleRef, defaultTimes);
          setDefaultSchedule(defaultTimes);
          console.log('Documento de horários padrão criado:', defaultTimes);
        }

        if (uid) {
          const currentDate = new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-');
          const scheduleRef = doc(collection(db, 'users', uid, 'workSchedule'), currentDate);
          const scheduleDoc = await getDoc(scheduleRef);

          if (scheduleDoc.exists()) {
            setWorkSchedule(scheduleDoc.data() as WorkSchedule);
            console.log('Horário do usuário para hoje carregado:', scheduleDoc.data());
          } else {
            console.log('Nenhum horário do usuário encontrado para o dia.');
            const emptySchedule: WorkSchedule = {
              startTime1: null,
              endTime1: null,
              startTime2: null,
              endTime2: null,
            };
            await setDoc(scheduleRef, emptySchedule);
            setWorkSchedule(emptySchedule);
            console.log('Documento de horário do usuário para hoje criado:', emptySchedule);
          }

          // Buscar a localização de destino (GeoPoint) do banco de dados
          const userRef = doc(db, 'users', uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const geoPoint = userDoc.data()?.lat as GeoPoint; 
            if (geoPoint) {
              setTargetLocation(geoPoint);
              console.log('Localização de destino carregada do banco de dados:', geoPoint);
            } else {
              console.error('GeoPoint não encontrado no banco de dados.');
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar horários:', error);
      }
    };

    fetchSchedules();
  }, []);

  // Solicita permissão de localização ao carregar o componente
  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } else {
        Alert.alert('Erro', 'Permissão de localização não concedida.');
      }
    };

    requestLocationPermission();
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

    return authResult.success;
  };
  //commi

  // Função para calcular a distância entre dois pontos geográficos
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Raio da Terra em km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distância em km
    return distance * 1000; // Converter para metros
  };

  // Função de registro de horários com verificação de localização
  const handleUpdateTime = async (field: keyof WorkSchedule) => {
    if (!userId || !location || !targetLocation || workSchedule[field]) return;

    const distance = calculateDistance(
      location.coords.latitude,
      location.coords.longitude,
      targetLocation.latitude,
      targetLocation.longitude
    );

    if (distance > targetRadius) {
      Alert.alert('Erro', 'Você precisa estar dentro da área para registrar o horário.');
      return;
    }

    const isAuthenticated = await handleBiometricAuthentication();
    if (!isAuthenticated) return;

    const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-');

    const scheduleRef = doc(collection(db, 'users', userId, 'workSchedule'), currentDate); 

    const newScheduleData = { 
      [field]: currentTime 
    };

    try {
      await setDoc(scheduleRef, newScheduleData, { merge: true });
      setWorkSchedule((prev) => ({ ...prev, [field]: currentTime }));
      console.log(`Horário registrado para o campo ${field}:`, currentTime);
      if (onAuthenticate) onAuthenticate();
    } catch (error) {
      console.error('Erro ao registrar horário:', error);
    }
  };

  return (
    <ScrollView style={styles.recordsContainer}>
      <TouchableOpacity 
        style={styles.recordItem} 
        onPress={() => handleUpdateTime('startTime1')}
        disabled={!!workSchedule.startTime1}
      >
        <FontAwesome name="sign-in" size={24} color="black" />
        <Text style={styles.recordText}>1ª Entrada</Text>
        <Text style={styles.recordTime}>
          {workSchedule.startTime1 || defaultSchedule?.startTime1 || 'Horário não registrado'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.recordItem} 
        onPress={() => handleUpdateTime('endTime1')}
        disabled={!!workSchedule.endTime1}
      >
        <FontAwesome name="sign-out" size={24} color="black" />
        <Text style={styles.recordText}>1ª Saída</Text>
        <Text style={styles.recordTime}>
          {workSchedule.endTime1 || defaultSchedule?.endTime1 || 'Horário não registrado'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.recordItem} 
        onPress={() => handleUpdateTime('startTime2')}
        disabled={!!workSchedule.startTime2}
      >
        <FontAwesome name="sign-in" size={24} color="black" />
        <Text style={styles.recordText}>2ª Entrada</Text>
        <Text style={styles.recordTime}>
          {workSchedule.startTime2 || defaultSchedule?.startTime2 || 'Horário não registrado'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.recordItem} 
        onPress={() => handleUpdateTime('endTime2')}
        disabled={!!workSchedule.endTime2}
      >
        <FontAwesome name="sign-out" size={24} color="black" />
        <Text style={styles.recordText}>2ª Saída</Text>
        <Text style={styles.recordTime}>
          {workSchedule.endTime2 || defaultSchedule?.endTime2 || 'Horário não registrado'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ScheduleTable;
