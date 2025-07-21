import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function PatientDetailScreen({ route }) {
  const { patient } = route.params;
  const [patientData, setPatientData] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient) {
      const data = {
        name: patient.get('name'),
        age: String(patient.get('age') ?? ''),
        gender: patient.get('gender'),
        phone: patient.get('phone'),
        location: patient.get('location'),
        createdAt: patient.createdAt?.toLocaleString(),
        updatedAt: patient.updatedAt?.toLocaleString(),
      };
      setPatientData(data);
      setEditableData(data);
    }
  }, [patient]);

  const handleChange = (field, value) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!patient) return;

    try {
      setLoading(true);
      patient.set('name', editableData.name);
      patient.set('age', parseInt(editableData.age));
      patient.set('gender', editableData.gender);
      patient.set('phone', editableData.phone);
      patient.set('location', editableData.location);
      await patient.save();
      Alert.alert('Success', 'Patient data updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update patient data.');
    } finally {
      setLoading(false);
    }
  };

  if (!patientData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0077cc" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../../assets/images/login-bg.png')}
      style={styles.background}
      resizeMode="stretch"
    >
      <ScrollView contentContainerStyle={styles.overlay}>
        <View style={styles.profileHeader}>
          <Image
            source={require('../../../assets/images/patient.jpg')}
            style={styles.avatar}
          />
          <Text style={styles.name}>{editableData.name}</Text>
          <Text style={styles.subtext}>Patient Profile</Text>
        </View>

        <View style={styles.card}>
          {['name', 'age', 'gender', 'phone', 'location'].map((field) => (
            <View style={styles.row} key={field}>
              <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
              <TextInput
                style={styles.input}
                value={editableData[field]}
                onChangeText={(text) => handleChange(field, text)}
                placeholder={`Enter ${field}`}
              />
            </View>
          ))}
          <View style={styles.row}>
            <Text style={styles.label}>Created At</Text>
            <Text style={styles.value}>{patientData.createdAt}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Last Updated</Text>
            <Text style={styles.value}>{patientData.updatedAt}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            disabled={loading}
            color="#1e3d59" // Optional: set button color
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  buttonContainer: {
    marginTop: 20,
    width:200,
    borderRadius: 8,
    overflow: 'hidden', // ensures button respects borderRadius on Android
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignSelf: 'center',
  },
  background: {
    flex: 1,
  },
  overlay: {
    flexGrow: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0077cc',
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  row: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    // marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
