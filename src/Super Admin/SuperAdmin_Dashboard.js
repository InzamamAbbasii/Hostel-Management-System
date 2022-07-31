import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const SuperAdmin_Dashboard = ({navigation}) => {
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
        Super Admin
      </Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('VerifyHostels')}>
        <Text style={styles.btnText}>Verify Hostel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('SuperAdmin_ViewHostels')}>
        <Text style={styles.btnText}>View Hostels</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuperAdmin_Dashboard;

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
