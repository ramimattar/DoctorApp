// import { Picker } from '@react-native-picker/picker';
// import { useState } from 'react';
// import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
// import '../../../utils/parseConfig';

// export default function RegisterScreen({ navigation }) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('user'); // default role
//   const [name, setName] = useState('');

//   const handleRegister = async () => {
//     if (!username || !password || !name) {
//       Alert.alert('Error', 'All fields are required');
//       return;
//     }

//     const user = new Parse.User();
//     user.set('username', username);
//     user.set('password', password);
//     user.set('role', role);
//     user.set('name', name);

//     try {
//       await user.signUp();
//       Alert.alert('Success', 'Registration complete');
//       navigation.navigate('Login');
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Register</Text>
//       <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={styles.input} />
//       <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
//       <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
//       <Text style={styles.label}>Select Role:</Text>
//       <Picker selectedValue={role} onValueChange={value => setRole(value)} style={styles.picker}>
//         <Picker.Item label="Doctor (Admin)" value="admin" />
//         <Picker.Item label="Patient (User)" value="user" />
//       </Picker>
//       <Button title="Register" onPress={handleRegister} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: 'center' },
//   input: { borderBottomWidth: 1, marginBottom: 15, padding: 8 },
//   header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
//   picker: { height: 50, marginBottom: 15 },
//   label: { marginBottom: 5 }
// });

import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import Parse from '../../../utils/parseConfig';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // default role
  const [name, setName] = useState('');

  // Doctor fields
  const [specialist, setSpecialist] = useState('');
  const [phone, setPhone] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [gender, setGender] = useState('');

  const handleRegister = async () => {
    if (!username || !password || !name) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const user = new Parse.User();
    user.set('username', username);
    user.set('password', password);
    user.set('role', role);
    user.set('name', name);

    try {
      const newUser = await user.signUp();

      // If doctor, create doctor class entry
      if (role === 'admin') {
        const Doctor = Parse.Object.extend('Doctor');
        const doctor = new Doctor();

        doctor.set('user', newUser); // relation to _User
        doctor.set('name', name);
        doctor.set('specialist', specialist);
        doctor.set('phone', phone);
        doctor.set('clinicAddress', clinicAddress);
        doctor.set('gender', gender);

        await doctor.save();
      }

      Alert.alert('Success', 'Registration complete');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Register</Text>

      <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      
      <Text style={styles.label}>Select Role:</Text>
      <Picker selectedValue={role} onValueChange={value => setRole(value)} style={styles.picker}>
        <Picker.Item label="Doctor (Admin)" value="admin" />
        <Picker.Item label="Patient (User)" value="user" />
      </Picker>

      {role === 'admin' && (
        <>
          <Text style={styles.label}>Specialist:</Text>
          <Picker selectedValue={specialist} onValueChange={value => setSpecialist(value)} style={styles.picker}>
            <Picker.Item label="Select a specialty" value="" />
            <Picker.Item label="Cardiologist" value="Cardiologist" />
            <Picker.Item label="Dentist" value="Dentist" />
            <Picker.Item label="Dermatologist" value="Dermatologist" />
            <Picker.Item label="Pediatrician" value="Pediatrician" />
            <Picker.Item label="Orthopedic" value="Orthopedic" />
            <Picker.Item label="General Practitioner" value="General" />
          </Picker>

          <TextInput placeholder="Phone Number" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
          <TextInput placeholder="Clinic Address" value={clinicAddress} onChangeText={setClinicAddress} style={styles.input} />
          
          <Text style={styles.label}>Gender:</Text>
          <Picker selectedValue={gender} onValueChange={value => setGender(value)} style={styles.picker}>
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </>
      )}

      <Button title="Register" onPress={handleRegister} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 50 },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 8 },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  picker: { height: 50, marginBottom: 15 },
  label: { marginBottom: 5, fontWeight: 'bold' },
});

