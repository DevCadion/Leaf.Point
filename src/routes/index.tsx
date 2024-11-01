
import WelcSome from "../components/view/welcome/index"
import Login from "../components/view/logins/login";
import PontoScreen  from "../components/view/ponto/PontoScreen"
import LoginScreen from "../components/view/Header/LoginScreen"
import { createNativeStackNavigator } from "@react-navigation/native-stack";

 
//const Stack = createNativeStackNavigator();
type RootStackParamList = {
    Welcome: undefined; // Sem parâmetros
    Login: undefined; // Sem parâmetros
    LoginScreen: undefined; // Sem parâmetros
    PontoScreen: undefined; // Sem parâmetros
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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

