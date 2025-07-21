// import Parse from '@parse/react-native';
// import { useEffect, useState } from 'react';
// import { FlatList, Text, View } from 'react-native';

// const PatientHomeScreen = () => {
//   const [visits, setVisits] = useState([]);

//   useEffect(() => {
//     fetchVisits();
//   }, []);

//   const fetchVisits = async () => {
//     const currentUser = await Parse.User.currentAsync();
//     const Visit = Parse.Object.extend('Visit');
//     const query = new Parse.Query(Visit);
//     query.equalTo('patient', currentUser);
//     query.ascending('date');
//     const results = await query.find();
//     setVisits(results);
//   };

//   return (
//     <View>
//       <Text>Welcome, {Parse.User.current().get('username')}</Text>
//       <FlatList
//         data={visits}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View>
//             <Text>{item.get('date').toDateString()}</Text>
//             <Text>{item.get('notes')}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// export default PatientHomeScreen;
