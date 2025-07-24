import { useState } from 'react';
import {
    Alert,
    Button,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Parse from '../../../utils/parseConfig';

export default function AddVisitScreen({ route, navigation }) {
  const { patient } = route.params;

  const [form, setForm] = useState({
    visitDate: '',
    reasonForVisit: '',
    diagnosis: '',
    prescription: '',
    visitNotes: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    followUpRequired: false,
    nextVisitDate: '',
    attachments: '',
  });

  const [datePickerTarget, setDatePickerTarget] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  const showDatePicker = (field) => {
    setDatePickerTarget(field);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleDateConfirm = (date) => {
    setForm((prev) => ({
      ...prev,
      [datePickerTarget]: date.toISOString().split('T')[0],
    }));
    hideDatePicker();
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.visitDate || !form.reasonForVisit) {
      Alert.alert('Missing Fields', 'Visit date and reason are required.');
      return;
    }

    try {
      setLoading(true);
      const Visit = Parse.Object.extend('Visit');
      const visit = new Visit();
      visit.set('patient', patient);
      visit.set('visitDate', new Date(form.visitDate));
      visit.set('reasonForVisit', form.reasonForVisit);
      visit.set('diagnosis', form.diagnosis);
      visit.set('visitNotes', form.visitNotes);
      visit.set('followUpRequired', form.followUpRequired);
      if (form.nextVisitDate) {
        visit.set('nextVisitDate', new Date(form.nextVisitDate));
      }

      visit.set('bloodPressureSystolic', Number(form.bloodPressureSystolic) || 0);
      visit.set('bloodPressureDiastolic', Number(form.bloodPressureDiastolic) || 0);
      visit.set('heartRate', Number(form.heartRate) || 0);
      visit.set('temperature', Number(form.temperature) || 0);
      visit.set('respiratoryRate', Number(form.respiratoryRate) || 0);
      visit.set('oxygenSaturation', Number(form.oxygenSaturation) || 0);

      visit.set(
        'prescription',
        form.prescription.split(',').map((item) => item.trim()).filter(Boolean)
      );
      visit.set(
        'attachments',
        form.attachments.split(',').map((item) => item.trim()).filter(Boolean)
      );

      await visit.save();

      Alert.alert('Success', 'Visit saved successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save visit.');
    } finally {
      setLoading(false);
    }
  };

  const renderDateInput = (field, label) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => showDatePicker(field)}>
          <TextInput
            style={styles.input}
            value={form[field]}
            editable={false}
            placeholder="Select Date"
          />
        </TouchableOpacity>
        {form[field] ? (
          <TouchableOpacity onPress={() => handleChange(field, '')}>
            <Text style={{ color: 'red', marginLeft: 10 }}>Clear</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../../assets/images/login-bg.png')}
      style={styles.background}
      resizeMode="stretch"
    >
      <ScrollView contentContainerStyle={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Add Visit</Text>

          {renderDateInput('visitDate', 'Visit Date')}

          {[ 
            { label: 'Reason for Visit', field: 'reasonForVisit' },
            { label: 'Diagnosis', field: 'diagnosis' },
            { label: 'Prescription (comma separated)', field: 'prescription' },
            { label: 'Visit Notes', field: 'visitNotes', multiline: true },
            { label: 'Blood Pressure Systolic', field: 'bloodPressureSystolic', keyboardType: 'numeric' },
            { label: 'Blood Pressure Diastolic', field: 'bloodPressureDiastolic', keyboardType: 'numeric' },
            { label: 'Heart Rate', field: 'heartRate', keyboardType: 'numeric' },
            { label: 'Temperature (°C)', field: 'temperature', keyboardType: 'numeric' },
            { label: 'Respiratory Rate', field: 'respiratoryRate', keyboardType: 'numeric' },
            { label: 'Oxygen Saturation (%)', field: 'oxygenSaturation', keyboardType: 'numeric' },
            { label: 'Attachments (comma separated URLs)', field: 'attachments' },
          ].map(({ label, field, multiline, keyboardType }) => (
            <View style={styles.row} key={field}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={[styles.input, multiline && { height: 80 }]}
                value={form[field]}
                placeholder={label}
                multiline={multiline}
                keyboardType={keyboardType || 'default'}
                onChangeText={(text) => handleChange(field, text)}
              />
            </View>
          ))}

          {renderDateInput('nextVisitDate', 'Next Visit Date')}

          <View style={styles.row}>
            <Text style={styles.label}>Follow-Up Required</Text>
            <Switch
              value={form.followUpRequired}
              onValueChange={(value) => handleChange('followUpRequired', value)}
            />
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
          />

          <View style={styles.buttonContainer}>
            <Button
              title={loading ? 'Saving...' : 'Save Visit'}
              onPress={handleSubmit}
              disabled={loading}
              color="#1e3d59"
            />
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
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 25,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3d59',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
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
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    alignSelf: 'center',
    width: 200,
  },
});
