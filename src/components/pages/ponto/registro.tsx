import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

export default function PontoScreen() {
  const [currentDate, setCurrentDate] = useState('');
  const [lastConnection, setLastConnection] = useState('');
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [dates, setDates] = useState<number[]>([]); // Para armazenar as datas dos dias da semana

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

    // Criar uma lista dos dias da semana
    const days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(date);
      day.setDate(date.getDate() + (i - date.getDay())); // Ajusta o dia para a semana
      return day.toLocaleDateString('pt-BR', { weekday: 'short' }); // Abreviação dos dias
    });
    setWeekDays(days);

    // Criar uma lista das datas
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(date);
      day.setDate(date.getDate() + (i - date.getDay())); // Ajusta o dia para a semana
      return day.getDate(); // Retorna apenas o dia do mês
    });
    setDates(weekDates);
  }, []);

  const handleRecord = (type: 'entrada' | 'saida') => {
    // Aqui você pode adicionar a lógica para registrar a entrada/saída no banco de dados
    alert(`Registrar ${type}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Ionicons name="leaf" size={40} color="white" />
        <TouchableOpacity style={styles.profileButton}>
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
              dates[index] === new Date().getDate() && styles.currentDay // Aplica estilo se for o dia atual
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
    </View>
  );
}
