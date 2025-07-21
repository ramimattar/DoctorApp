
// navigation/DoctorDrawer.js
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';
import Parse from 'parse/react-native';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AddPatientScreen from '../screens/Admin/AddPatientScreen';
import PatientListScreen from '../screens/Admin/PatientListScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const handleLogout = async () => {
    await Parse.User.logOut();
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/images/login-bg.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="stretch"
      >
        <View style={styles.overlay}>
          <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
            <Image
            source={require('../../assets/images/doctor-logo.jpg')} // 👈 Replace with your logo
            style={styles.logo}
            resizeMode="contain"
            />
            <Text style={styles.welcome}>Welcome Doctor</Text>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default function DoctorDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: '#1e3d59' },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#ddd',
        drawerLabelStyle: { fontSize: 16 },
      })}
    >
      <Drawer.Screen
        name="PatientList"
        component={PatientListScreen}
        options={{ title: 'Patients' }}
      />
      <Drawer.Screen
        name="AddPatient"
        component={AddPatientScreen}
        options={{ title: 'Add Patient' }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // darken the image for readability
    paddingTop: 40,
    paddingHorizontal: 15,
  },
  drawerContent: {
    flexGrow: 1,
  },
logo: {
  width: 100,
  height: 100,
  borderRadius: 50, // makes it circular
  alignSelf: 'center',
  //marginBottom: 10,
  backgroundColor: '#fff', // optional: adds white background behind logo
},
  welcome: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#cc0000',
    padding: 12,
    borderRadius: 8,
    marginBottom: 30,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

