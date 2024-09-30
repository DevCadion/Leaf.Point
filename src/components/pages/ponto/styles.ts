import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'green',
    borderRadius:20,
    height: 70,
    paddingHorizontal: 10,
    marginTop:20
  },
  backButton: {
    padding: 10,
  },
  profileButton: {
    padding: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  lastConnectionText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color:"#00734F"
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekDayText: {
    fontSize: 16,
    color: 'black',
    width: '14%',
    textAlign: 'center',
  },
  currentDay: {
    // Remover a cor de fundo
    // backgroundColor: 'yellow', // Remover esta linha
    borderRadius: 5,
    padding: 5,
    fontWeight: 'bold', // Deixa o texto mais destacado
    shadowColor: '#469536', // Cor da sombra
    shadowOffset: {
        width: 0,
        height: 2, // Altura da sombra
    },
    shadowOpacity: 0.5, // Opacidade da sombra
    shadowRadius: 3, // Raio da sombra
    elevation: 3, // Para Android
},

  recordsContainer: {
    flex: 1,
    marginTop:30
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  recordText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  recordTime: {
    fontSize: 16,
    color: '#888',
  },
});

export default styles;
