import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Parse from '../../../utils/parseConfig';

const VisitsScreen = () => {
  const navigation = useNavigation();
  const [visits, setVisits] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    fetchVisits();
  }, [searchQuery, selectedDate]);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const currentUser = await Parse.User.currentAsync();

      const Doctor = Parse.Object.extend('Doctor');
      const doctorQuery = new Parse.Query(Doctor);
      doctorQuery.equalTo('user', currentUser);
      const doctor = await doctorQuery.first();

      if (!doctor) {
        console.warn('No doctor object found for this user.');
        setVisits([]);
        setLoading(false);
        return;
      }

      const relation = doctor.relation('patients');
      const patientQuery = relation.query();
      const patients = await patientQuery.find();
      const patientIds = patients.map((p) => p.id);

      const Visit = Parse.Object.extend('Visit');
      const visitQuery = new Parse.Query(Visit);
      visitQuery.containedIn('patient', patients.map((p) => p.toPointer()));

      if (searchQuery) {
        visitQuery.matches('reasonForVisit', searchQuery, 'i');
      }

      if (selectedDate) {
        const start = new Date(selectedDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(selectedDate);
        end.setHours(23, 59, 59, 999);
        visitQuery.greaterThanOrEqualTo('visitDate', start);
        visitQuery.lessThanOrEqualTo('visitDate', end);
      }

      visitQuery.include('patient');
      visitQuery.descending('visitDate');
      const results = await visitQuery.find();
      setVisits(results);
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const patient = item.get('patient');
    const visitDate = item.get('visitDate');
    return (
      <TouchableOpacity onPress={() => navigation.navigate('VisitDetailScreen', { visit: item })}>
        <View style={styles.card}>
          <Text style={styles.name}>{patient?.get('name') || 'Unnamed Patient'}</Text>
          <Text style={styles.info}>📅 {visitDate?.toDateString()}</Text>
          <Text style={styles.info}>📝 {item.get('reasonForVisit')}</Text>
          <Text style={styles.info}>🩺 {item.get('diagnosis')}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleConfirmDate = (date) => {
    setSelectedDate(date);
    setDatePickerVisible(false);
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/login-bg.png')}
      style={styles.background}
      resizeMode="stretch"
    >
      <View style={styles.overlay}>
        <TextInput
          style={styles.input}
          placeholder="Search by reason for visit"
          placeholderTextColor="#1e3d59"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity style={styles.dateButton} onPress={() => setDatePickerVisible(true)}>
          <Text style={styles.dateButtonText}>
            {selectedDate ? `📅 ${selectedDate.toDateString()}` : '📅 Filter by Date'}
          </Text>
        </TouchableOpacity>

        {selectedDate && (
          <TouchableOpacity onPress={clearDateFilter}>
            <Text style={styles.clearText}>Clear Date Filter</Text>
          </TouchableOpacity>
        )}

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisible(false)}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0077cc" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={visits}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 20,
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  dateButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#333',
    fontSize: 16,
  },
  clearText: {
    color: '#0077cc',
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 25,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0077cc',
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 2,
  },
});

export default VisitsScreen;