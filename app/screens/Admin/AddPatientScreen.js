import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Parse from '../../../utils/parseConfig';

export default function AddPatientScreen({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState('');

  useFocusEffect(
    useCallback(() => {
      setName('');
      setAge('');
      setPhone('');
      setLocation('');
      setGender('');
    }, [])
  );

  const handleAddPatient = async () => {
    if (!name || !phone) {
      Alert.alert('Error', 'Name and Phone are required.');
      return;
    }

    try {
      const currentDoctor = await Parse.User.currentAsync();
      const doctorSessionToken = currentDoctor.getSessionToken();

      const newPatientUser = new Parse.User();
      newPatientUser.set('username', name);
      newPatientUser.set('password', name);
      newPatientUser.set('role', 'user');

      const savedUser = await newPatientUser.signUp();
      await Parse.User.become(doctorSessionToken);

      const doctorUser = await Parse.User.currentAsync();
      const Doctor = Parse.Object.extend('Doctor');
      const doctorQuery = new Parse.Query(Doctor);
      doctorQuery.equalTo('user', doctorUser);
      const doctor = await doctorQuery.first();

      const Patient = Parse.Object.extend('Patient');
      const patient = new Patient();

      patient.set('name', name);
      patient.set('age', parseInt(age));
      patient.set('phone', phone);
      patient.set('location', location);
      patient.set('gender', gender);
      patient.set('user', savedUser);

      const savedPatient = await patient.save();

      if (doctor) {
        const patientsRelation = doctor.relation('patients');
        patientsRelation.add(savedPatient);
        await doctor.save();
      }

      const roleQuery = new Parse.Query(Parse.Role);
      roleQuery.equalTo('name', 'Patient');
      const patientRole = await roleQuery.first();

      if (patientRole) {
        const relation = patientRole.relation('users');
        relation.add(savedUser);
        await patientRole.save();
      } else {
        Alert.alert('Error', 'Patient role not found in _Role class.');
      }

      Alert.alert('Success', 'Patient added successfully.');
      navigation.navigate('PatientList');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/login-bg.png')}
      style={styles.background}
      resizeMode="stretch"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add New Patient</Text>

        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#666"
        />
        <TextInput
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.input}
          placeholderTextColor="#666"
        />
        <TextInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
          placeholderTextColor="#666"
        />
        <TextInput
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
          placeholderTextColor="#666"
        />
        <TextInput
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
          style={styles.input}
          placeholderTextColor="#666"
        />

        <TouchableOpacity style={styles.button} onPress={handleAddPatient}>
          <Text style={styles.buttonText}>Add Patient</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
container: {
  padding: 20,
  paddingBottom: 30,
  backgroundColor: 'transparent',
  borderRadius: 12,
  margin: 10,
  marginTop: 60,
  borderColor: '#ccc',

  // ✅ Shadow for iOS
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 6,

  // ✅ Elevation for Android
  elevation: 6,
},
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e3d59',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#1e3d59',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
