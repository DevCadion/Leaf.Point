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
        top: 15,
        alignSelf: 'center',
        
    },


    containerCentro:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'blue',
        marginBottom: 0
        
    },   

    containerForm:{
        flex:1,
        marginTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
        
        
    },

    containerButton:{
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 115
    },   

    button:{
        backgroundColor: '#59A79B',
        padding: 9,
        borderRadius: 8,
        width: 209,
        height: 40,
        alignItems: 'center',
    },

    buttonText:{
        color: '#FFF',
        fontSize: 16,
        fontWeight:'bold'
        
    },

    containerBaixo:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },

    imagem3:{
        width: 390,
        height: 200,
        top: 0       
        
    }
})