import { StyleSheet } from 'react-native'


export const styles= StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'flex-start',
        backgroundColor:'#ffff'
        
    },

    imagem:{
        width: 390,
        height: 140,
        position: 'absolute',
        top: 5
    },

    containerLogo:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
       
      
    },

    imagem2:{
        width: 189,
        height: 157,
        position: 'absolute',
        top: 0,
        alignSelf: 'center',
        
    },


    containerCentro:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        
        
    },

    imagem3:{
        width: 390,
        height: 195,
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        
    },

    containerForm:{
        flex:1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },

    containerBaixo:{
        flex:1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    button:{
        position: 'absolute',
        borderRadius: 50,
        paddingVertical: 8,
        width: '60%',
        alignSelf: 'center',
        bottom: '15%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    buttonText:{
        fontSize: 18,
        color: '#fff'
    }
})