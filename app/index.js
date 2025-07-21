
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import '../i18n/i18n';
import '../utils/parseConfig';
import DoctorDrawer from './navigation/DoctorDrawer';
import LoginScreen from './screens/Auth/LoginScreen';
//import RegisterScreen from './screens/Auth/RegisterScreen';
import PatientDetailScreen from './screens/Admin/PatientDetailScreen';
import SplashScreen from './screens/Auth/SplashScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (

    <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
        <Stack.Screen name="DoctorDrawer" component={DoctorDrawer} options={{ headerShown: false }} />
        <Stack.Screen name="PatientDetailScreen" component={PatientDetailScreen}            
        options={{
            title: 'Patient Profile',
            headerStyle: { backgroundColor: '#1e3d59' },
            headerTintColor: '#fff',
          }}/>
      </Stack.Navigator>
  );
}
