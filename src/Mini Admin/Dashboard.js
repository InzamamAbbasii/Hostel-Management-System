import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const Dashboard = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text
        style={{
          color: '#000',
          fontSize: 28,
          marginTop: 30,
          marginBottom: 20,
          fontWeight: 'bold',
        }}>
        Mini Admin
      </Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('AddHostel')}>
        <Text style={styles.btnText}>Add Hostel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('ViewHostels')}>
        <Text style={styles.btnText}>View Hostels</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('BookingRequest')}>
        <Text style={styles.btnText}>Booking Request</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#000',
    height: 50,
    width: '90%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',

    fontWeight: 'bold',
  },
});
