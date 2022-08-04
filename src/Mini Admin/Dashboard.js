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
          fontSize: 28,
          marginTop: 50,
          marginBottom: 20,
          // fontWeight: 'bold',
          fontFamily: fonts.regular,
        }}>
        Hostel Manager
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
        title="Booking Request"
        onPress={() => navigation.navigate('BookingRequest')}
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
