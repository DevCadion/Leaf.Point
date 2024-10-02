
import React from 'react'
import { styles } from './styles';
import { View, Text, Image, TouchableOpacity } from 'react-native'

import * as Animatable from 'react-native-animatable' //impote da animação

import { useNavigation } from '@react-navigation/native'
//import { styles } from '../Header/styles';


export default function WelcSome() {

const navigation = useNavigation();

return (
    <View style={styles.container}>
        
        <View style={styles.containerLogo}>
            <Image
            source={require('../../../assets/logo_cima.png')}
            style={styles.imagem}
            //style={{ width: '100%'}}
            resizeMode='stretch'
            />
            
        </View>

        <View style={styles.containerCentro}>
 
           <Animatable.Image
           animation="flipInY" 
           source={require('../../../assets/logo_centro.png')}
           style={styles.imagem2}
           resizeMode='contain'
           />         

        </View>

        <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>

            <View style={styles.containerButton}>

                <TouchableOpacity style={styles.button} 
                onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Primeiro cadastro</Text>
                </TouchableOpacity>

            </View>

            
        </Animatable.View>

        <View style={styles.containerBaixo}>
            <Image
            source={require('../../../assets/logo_baixo.png')}
            style={styles.imagem3}
            />
            
        </View>


    </View>
    );

}

