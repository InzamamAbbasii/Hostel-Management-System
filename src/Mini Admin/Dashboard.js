import React from 'react';
import {Text, StyleSheet, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../reuseable/CustomButton';
import {fonts} from '../CONSTANTS/fonts';
import {bg} from '../CONSTANTS/images';
const Dashboard = ({navigation}) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('user_id');
    await AsyncStorage.removeItem('user');
    navigation.replace('LoginScreen');
  };
  return (
    <ImageBackground
      source={bg}
      style={{...StyleSheet.absoluteFillObject, paddingHorizontal: 16}}>
      <Text
        style={{
          color: '#000',
          fontSize: 27,
          marginTop: 50,
          marginBottom: 20,
          fontFamily: fonts.regular,
        }}>
        Hostel Manager Dashboard
      </Text>
      <CustomButton
        title="Add Hostel"
        onPress={() => navigation.navigate('AddHostel')}
      />
      <CustomButton
        title="View Hostels"
        onPress={() => navigation.navigate('ViewHostels')}
      />
      <CustomButton
        title="Waiting List"
        onPress={() => navigation.navigate('PendingHostels')}
      />
      <CustomButton
        title="Booking Request"
        onPress={() => navigation.navigate('BookingRequest')}
      />
      <CustomButton title="Logout" onPress={() => handleLogout()} />
    </ImageBackground>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
});
