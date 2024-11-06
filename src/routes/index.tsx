
import WelcSome from "../components/view/welcome/index"
import Login from "../components/view/logins/login";
import PontoScreen  from "../components/view/ponto/PontoScreen"
import LoginScreen from "../components/view/Header/LoginScreen"
import { createStackNavigator} from '@react-navigation/stack';
//importar Navigation prop
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';


 
const Stack = createStackNavigator();

type StackNavigator = { //usei para poder passar como obj para ir para outra pág
    WelcSome: undefined;
    Login: undefined;
    LoginScreen: undefined;
    PontoScreen: undefined;
} 

export type StackTypes =  NativeStackNavigationProp<StackNavigator>; //para ativar a stack 

export default function Routes(){
    return(
    
        <Stack.Navigator>
            <Stack.Screen
            name="Welcome"
            component={WelcSome}
            options={{ headerShown: false}}
            />
            
            <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false}}
            />

            <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false}}
            />

            <Stack.Screen
            name="PontoScreen"
            component={PontoScreen}
            options={{ headerShown: false}}
            />

        </Stack.Navigator>
    )
}

