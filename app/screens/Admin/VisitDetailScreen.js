// screens/Doctor/VisitDetailScreen.js
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
    View
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function VisitDetailScreen({ route }) {
  const { visit } = route.params;
  const [visitData, setVisitData] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [loading, setLoading] = useState(false);
  const [datePickerField, setDatePickerField] = useState(null);

  useEffect(() => {
    if (visit) {
      const data = {
        visitDate: visit.get('visitDate')?.toISOString().split('T')[0] ?? '',
        reasonForVisit: visit.get('reasonForVisit') || '',
        diagnosis: visit.get('diagnosis') || '',
        prescription: (visit.get('prescription') || []).join(', '),
        visitNotes: visit.get('visitNotes') || '',
        bloodPressureSystolic: String(visit.get('bloodPressureSystolic') ?? ''),
        bloodPressureDiastolic: String(visit.get('bloodPressureDiastolic') ?? ''),
        heartRate: String(visit.get('heartRate') ?? ''),
        temperature: String(visit.get('temperature') ?? ''),
        respiratoryRate: String(visit.get('respiratoryRate') ?? ''),
        oxygenSaturation: String(visit.get('oxygenSaturation') ?? ''),
        followUpRequired: visit.get('followUpRequired') ?? false,
        nextVisitDate: visit.get('nextVisitDate')?.toISOString().split('T')[0] ?? '',
        createdAt: visit.createdAt?.toLocaleString(),
        updatedAt: visit.updatedAt?.toLocaleString(),
      };
      setVisitData(data);
      setEditableData(data);
    }
  }, [visit]);

  const handleChange = (field, value) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  };

  const showDatePicker = (field) => setDatePickerField(field);
  const hideDatePicker = () => setDatePickerField(null);

  const handleConfirmDate = (date) => {
    handleChange(datePickerField, date.toISOString().split('T')[0]);
    hideDatePicker();
  };

  const handleSave = async () => {
    if (!visit) return;
    try {
      setLoading(true);
      visit.set('visitDate', new Date(editableData.visitDate));
      visit.set('reasonForVisit', editableData.reasonForVisit);
      visit.set('diagnosis', editableData.diagnosis);
      visit.set('prescription', editableData.prescription.split(',').map(s => s.trim()));
      visit.set('visitNotes', editableData.visitNotes);
      visit.set('bloodPressureSystolic', parseFloat(editableData.bloodPressureSystolic));
      visit.set('bloodPressureDiastolic', parseFloat(editableData.bloodPressureDiastolic));
      visit.set('heartRate', parseFloat(editableData.heartRate));
      visit.set('temperature', parseFloat(editableData.temperature));
      visit.set('respiratoryRate', parseFloat(editableData.respiratoryRate));
      visit.set('oxygenSaturation', parseFloat(editableData.oxygenSaturation));
      visit.set('followUpRequired', editableData.followUpRequired);
      if (editableData.nextVisitDate)
        visit.set('nextVisitDate', new Date(editableData.nextVisitDate));
      else
        visit.unset('nextVisitDate');
      await visit.save();
      Alert.alert('Success', 'Visit updated successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to update visit');
    } finally {
      setLoading(false);
    }
  };

  if (!visitData) {
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
          <Text style={styles.name}>Visit Details</Text>
          <Text style={styles.subtext}>Patient Visit Information</Text>
        </View>

        <View style={styles.card}>
          {[
            'reasonForVisit',
            'diagnosis',
            'prescription',
            'visitNotes',
            'bloodPressureSystolic',
            'bloodPressureDiastolic',
            'heartRate',
            'temperature',
            'respiratoryRate',
            'oxygenSaturation',
          ].map((field) => (
            <View style={styles.row} key={field}>
              <Text style={styles.label}>{field}</Text>
              <TextInput
                style={styles.input}
                value={editableData[field]}
                onChangeText={(text) => handleChange(field, text)}
                placeholder={`Enter ${field}`}
              />
            </View>
          ))}

          {/* visitDate */}
          <View style={styles.row}>
            <Text style={styles.label}>Visit Date</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => showDatePicker('visitDate')}>
              <TextInput
                style={styles.input}
                value={editableData.visitDate}
                editable={false}
                placeholder="Select Date"
              />
              {editableData.visitDate ? (
                <TouchableOpacity onPress={() => handleChange('visitDate', '')}>
                  <Text style={{ color: 'red', marginLeft: 10 }}>Clear</Text>
                </TouchableOpacity>
              ) : null}
            </TouchableOpacity>
          </View>

          {/* nextVisitDate */}
          <View style={styles.row}>
            <Text style={styles.label}>Next Visit Date</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => showDatePicker('nextVisitDate')}>
              <TextInput
                style={styles.input}
                value={editableData.nextVisitDate}
                editable={false}
                placeholder="Select Date"
              />
              {editableData.nextVisitDate ? (
                <TouchableOpacity onPress={() => handleChange('nextVisitDate', '')}>
                  <Text style={{ color: 'red', marginLeft: 10 }}>Clear</Text>
                </TouchableOpacity>
              ) : null}
            </TouchableOpacity>
          </View>

          {/* followUpRequired */}
          <View style={styles.row}>
            <Text style={styles.label}>Follow-Up Required</Text>
            <TouchableOpacity onPress={() => handleChange('followUpRequired', !editableData.followUpRequired)}>
              <Text style={styles.input}>
                {editableData.followUpRequired ? 'Yes' : 'No'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Created At</Text>
            <Text style={styles.value}>{visitData.createdAt}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Last Updated</Text>
            <Text style={styles.value}>{visitData.updatedAt}</Text>
          </View>

          <DateTimePickerModal
            isVisible={!!datePickerField}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            disabled={loading}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
