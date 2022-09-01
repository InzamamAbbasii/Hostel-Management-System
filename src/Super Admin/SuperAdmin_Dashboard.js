import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import CustomButton from '../reuseable/CustomButton';
import {bg} from '../CONSTANTS/images';
import {fonts} from '../CONSTANTS/fonts';
import {COLOR} from '../CONSTANTS/fonts';

const SuperAdmin_Dashboard = ({navigation}) => {
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
        Super Admin Dashboard
      </Text>
      <CustomButton
        title="Verify Hostel"
        onPress={() => navigation.navigate('VerifyHostels')}
        // onPress={() => navigation.navigate('HostelManagersList')}
      />
      <CustomButton
        title="View Hostel"
        onPress={() => navigation.push('SuperAdmin_ViewHostels')}
      />
      <CustomButton
        title="Search"
        onPress={() => navigation.navigate('Search')}
      />
      <CustomButton
        title="Logout"
        onPress={() => navigation.replace('LoginScreen')}
      />
    </ImageBackground>
  );
};

export default SuperAdmin_Dashboard;
