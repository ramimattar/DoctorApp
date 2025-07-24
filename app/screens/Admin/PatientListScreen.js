import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
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

const PatientListScreen = () => {
  const navigation = useNavigation();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchPatients();
    }, [searchQuery, selectedDate])
  );

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const currentUser = await Parse.User.currentAsync();

      const Doctor = Parse.Object.extend('Doctor');
      const doctorQuery = new Parse.Query(Doctor);
      doctorQuery.equalTo('user', currentUser);
      const doctor = await doctorQuery.first();

      if (!doctor) {
        console.warn('No doctor object found for this user.');
        setPatients([]);
        setLoading(false);
        return;
      }

      const relation = doctor.relation('patients');
      const query = relation.query();

      if (searchQuery) {
        query.contains('name', searchQuery);
      }

      if (selectedDate) {
        const start = new Date(selectedDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(selectedDate);
        end.setHours(23, 59, 59, 999);
        query.greaterThanOrEqualTo('createdAt', start);
        query.lessThanOrEqualTo('createdAt', end);
      }

      query.descending('createdAt');
      const results = await query.find();
      setPatients(results);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PatientDetailScreen', { patient: item })}>
      <View style={styles.card}>
        <Text style={styles.name}>{item.get('name')}</Text>
        <Text style={styles.info}>Age: {item.get('age')}</Text>
        <Text style={styles.info}>Gender: {item.get('gender')}</Text>
        <Text style={styles.info}>Phone: {item.get('phone')}</Text>
        <Text style={styles.info}>Location: {item.get('location')}</Text>
      </View>
    </TouchableOpacity>
  );

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
          placeholder="Search by name"
          placeholderTextColor="#1e3d59"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity style={styles.dateButton} onPress={() => setDatePickerVisible(true)}>
          <Text style={styles.dateButtonText}>
            {selectedDate
              ? `📅 ${selectedDate.toDateString()}`
              : '📅 Filter by Date'}
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
            data={patients}
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
    //backgroundColor: 'rgba(255, 255, 255, 0.88)',
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

export default PatientListScreen;
