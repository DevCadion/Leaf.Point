import styles from './styles';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { db } from '@/src/config/firebase'; 
import { doc, collection, getDoc, setDoc } from 'firebase/firestore'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import { GeoPoint } from 'firebase/firestore'; // Importando GeoPoint

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
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [targetLocation, setTargetLocation] = useState<GeoPoint | null>(null); // Alterado para GeoPoint
  const targetRadius = 100; // Cobertura de 100 metros

  // Carregar os horários do usuário e a localização de destino (GeoPoint)
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
              startTime1: '08:30',
              endTime1: '12:00',
              startTime2: '13:30',
              endTime2: '17:30',
            };
            await setDoc(scheduleRef, defaultSchedule);
            setWorkSchedule(defaultSchedule);
          }

          // Buscar a localização de destino (GeoPoint) do banco de dados
          const userRef = doc(db, 'users', uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const geoPoint = userDoc.data()?.lat as GeoPoint; // Assume que 'lat' é o GeoPoint
            if (geoPoint) {
              setTargetLocation(geoPoint);
              console.log('Localização de destino do banco de dados:', geoPoint);
            } else {
              console.error('GeoPoint não encontrado no banco de dados.');
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar horários:', error);
      }
    };

    fetchWorkSchedule();
  }, []);

  // Solicita permissão de localização ao carregar o componente
  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        const currentLocation = await Location.getCurrentPositionAsync({});
        console.log('Localização atual:', currentLocation);
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

    if (authResult.success) {
      return true;
    } else {
      Alert.alert('Erro', 'Autenticação biométrica falhou ou foi cancelada.');
      return false;
    }
  };
  //commi

  // Função para calcular a distância entre dois pontos geográficos (usando a fórmula Haversine)
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
    if (!userId || !location || !targetLocation) return;

    // Verificar se a localização está dentro da área
    const distance = calculateDistance(
      location.coords.latitude,
      location.coords.longitude,
      targetLocation.latitude,
      targetLocation.longitude
    );

    console.log(`Distância: ${distance} metros`); // Log da distância calculada

    if (distance > targetRadius) {
      Alert.alert('Erro', 'Você precisa estar dentro da área para registrar o horário.');
      return;
    }

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
