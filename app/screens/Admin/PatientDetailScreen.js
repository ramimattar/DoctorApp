// PatientDetailScreen.js
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
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
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const bloodTypes = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];

export default function PatientDetailScreen({ route }) {
  const navigation = useNavigation();
  const { patient } = route.params;
  const [patientData, setPatientData] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    if (patient) {
      const emergency = patient.get('emergencyContact') || {};
      const data = {
        name: patient.get('name'),
        age: String(patient.get('age') ?? ''),
        gender: patient.get('gender'),
        phone: patient.get('phone'),
        email: patient.get('email'),
        location: patient.get('location'),
        dateOfBirth: patient.get('dateOfBirth')?.toISOString().split('T')[0] ?? '',
        medicalHistory: (patient.get('medicalHistory') || []).join(', '),
        allergies: (patient.get('allergies') || []).join(', '),
        bloodType: patient.get('bloodType'),
        emergencyContact: {
          name: emergency.name || '',
          phone: emergency.phone || '',
          relation: emergency.relation || '',
        },
        nationalId: patient.get('nationalId'),
        insuranceNumber: patient.get('insuranceNumber'),
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

  const handleEmergencyChange = (subField, value) => {
    setEditableData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [subField]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!patient) return;
    try {
      setLoading(true);
      patient.set('name', editableData.name);
      patient.set('age', parseInt(editableData.age));
      patient.set('gender', editableData.gender);
      patient.set('phone', editableData.phone);
      patient.set('email', editableData.email);
      patient.set('location', editableData.location);
      patient.set('dateOfBirth', new Date(editableData.dateOfBirth));
      patient.set('medicalHistory', editableData.medicalHistory.split(',').map(s => s.trim()));
      patient.set('allergies', editableData.allergies.split(',').map(s => s.trim()));
      patient.set('bloodType', editableData.bloodType);
      patient.set('emergencyContact', editableData.emergencyContact);
      patient.set('nationalId', editableData.nationalId);
      patient.set('insuranceNumber', editableData.insuranceNumber);
      await patient.save();
      Alert.alert('Success', 'Patient data updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update patient data.');
    } finally {
      setLoading(false);
    }
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date) => {
    handleChange('dateOfBirth', date.toISOString().split('T')[0]);
    hideDatePicker();
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
          {[
            'name',
            'age',
            'gender',
            'phone',
            'email',
            'location',
            'medicalHistory',
            'allergies',
            'nationalId',
            'insuranceNumber',
          ].map((field) => (
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

          {/* Blood Type Dropdown */}
          <View style={styles.row}>
            <Text style={styles.label}>Blood Type</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={editableData.bloodType}
                onValueChange={(value) => handleChange('bloodType', value)}
              >
                <Picker.Item label="Select Blood Type" value="" />
                {bloodTypes.map(bt => (
                  <Picker.Item key={bt} label={bt} value={bt} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Date of Birth */}
          <View style={styles.row}>
            <Text style={styles.label}>Date of Birth</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={{ flex: 1 }} onPress={showDatePicker}>
                <TextInput
                  style={styles.input}
                  value={editableData.dateOfBirth}
                  editable={false}
                  placeholder="Select Date"
                />
              </TouchableOpacity>
              {editableData.dateOfBirth ? (
                <TouchableOpacity onPress={() => handleChange('dateOfBirth', '')}>
                  <Text style={{ color: 'red', marginLeft: 10 }}>Clear</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>

          {/* Emergency Contact */}
          <View style={styles.row}>
            <Text style={styles.label}>Emergency Contact</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editableData.emergencyContact.name}
              onChangeText={(text) => handleEmergencyChange('name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={editableData.emergencyContact.phone}
              onChangeText={(text) => handleEmergencyChange('phone', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Relation"
              value={editableData.emergencyContact.relation}
              onChangeText={(text) => handleEmergencyChange('relation', text)}
            />
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

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            disabled={loading}
            color="#1e3d59"
          />
        </View>

        <View style={[styles.buttonContainer, { marginTop: 10 }]}>
          <Button
            title="➕ Add Visit"
            onPress={() => navigation.navigate('AddVisitScreen', { patient })}
            color="#1e3d59"
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    width: 200,
    borderRadius: 8,
    overflow: 'hidden',
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
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    overflow: 'hidden',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
