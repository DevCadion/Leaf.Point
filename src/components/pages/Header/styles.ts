import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,  // Ajuste a altura a partir do topo
        alignSelf: 'center',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        color: '#00734F',
    },
    subText: {
        marginTop: 150,  // Espaçamento de 64 pixels abaixo do texto principal
        fontSize: 18,
        color: '#555',
        alignSelf: 'flex-start', // Alinha o texto "Entrar..." à esquerda
        marginLeft:-50, // Adiciona uma margem de 50 pixels à esquerda
    },
});
