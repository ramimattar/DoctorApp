// // components/VisitChart.js
// import React from 'react';
// import { Dimensions } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';

// const VisitChart = ({ visits }) => {
//   const data = {
//     labels: visits.map((visit) => visit.get('date').toDateString()),
//     datasets: [
//       {
//         data: visits.map((visit) => visit.get('someMetric')), // Replace with actual metric
//       },
//     ],
//   };

//   return (
//     <LineChart
//       data={data}
//       width={Dimensions.get('window').width}
//       height={220}
//       chartConfig={{
//         backgroundColor: '#ffffff',
//         backgroundGradientFrom: '#ffffff',
//         backgroundGradientTo: '#ffffff',
//         decimalPlaces: 2,
//         color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//       }}
//     />
//   );
// };

// export default VisitChart;
