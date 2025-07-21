import { useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Parse from '../../../utils/parseConfig';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const user = await Parse.User.logIn(username, password);

      const roleQuery = new Parse.Query(Parse.Role);
      roleQuery.equalTo('users', user);
      const roles = await roleQuery.find();

      if (roles.length === 0) {
        Alert.alert('Login Error', 'No role assigned to this user.');
        return;
      }

      const roleName = roles[0].get('name');
      Alert.alert('Success', `Welcome ${roleName === 'Doctor' ? 'Doctor' : 'Patient'}`);
      navigation.navigate(roleName === 'Doctor' ? 'DoctorDrawer' : 'PatientHomeScreen');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/login-bg.png')}
      style={styles.background}
      resizeMode="stretch"
    >
      <View style={styles.overlay}>
        <Text style={styles.header}>Welcome Back</Text>
        <TextInput
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        {/* <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
          Don't have an account? <Text style={{ fontWeight: 'bold' }}>Register</Text>
        </Text> */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    margin: 20,
    padding: 25,
    backgroundColor: 'transparent',
    borderRadius: 16,
    elevation: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#333',
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#0077cc',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#0077cc',
    fontSize: 16,
  },
});
