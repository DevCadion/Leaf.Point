
import WelcSome from "../components/view/welcome/index"
import Login from "../components/view/logins/login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();


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
        </Stack.Navigator>
    )
}

