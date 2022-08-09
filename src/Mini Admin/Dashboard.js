import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import CustomButton from '../reuseable/CustomButton';
import {fonts} from '../CONSTANTS/fonts';
import {bg} from '../CONSTANTS/images';
const Dashboard = ({navigation}) => {
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
      <CustomButton
        title="Logout"
        onPress={() => navigation.replace('LoginScreen')}
      />
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
