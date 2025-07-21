import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function PatientDetailScreen({ route }) {
  const { patient } = route.params;
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    if (patient) {
      setPatientData({
        name: patient.get('name'),
        age: patient.get('age'),
        gender: patient.get('gender'),
        phone: patient.get('phone'),
        location: patient.get('location'),
        createdAt: patient.createdAt?.toLocaleString(),
        updatedAt: patient.updatedAt?.toLocaleString(),
      });
    }
  }, [patient]);

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
          <Text style={styles.name}>{patientData.name}</Text>
          <Text style={styles.subtext}>Patient Profile</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Age</Text>
            <Text style={styles.value}>{patientData.age}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.value}>{patientData.gender}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{patientData.phone}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>{patientData.location}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Created At</Text>
            <Text style={styles.value}>{patientData.createdAt}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Last Updated</Text>
            <Text style={styles.value}>{patientData.updatedAt}</Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flexGrow: 1,
    padding: 20,
    //backgroundColor: 'rgba(255,255,255,0.9)',
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
