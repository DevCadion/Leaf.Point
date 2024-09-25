
import React from 'react'
import { styles } from './index';
import { View, Text, Image, TouchableOpacity } from 'react-native'
//import { styles } from '../Header/styles';


export default function WelcSome() {
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

        <View style={styles.container}>
 
           <Image style={styles.containerCentro}
           source={require('../../../assets/logo_centro.png')}
           style={styles.imagem2}
           resizeMode='contain'
           />
            
        </View>

        <View style={styles.containerForm}>

           
            
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Primeiro cadastro</Text>
            </TouchableOpacity>

        </View>

        <View style={styles.containerBaixo}>
            <Image
            source={require('../../../assets/logo_baixo.png')}
            style={styles.imagem3}
            //style={{ width: '100%'}}
            resizeMode='repeat'
            />
            
        </View>


    </View>
    );

}

