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

const UserDashboard = ({navigation}) => {
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
        UserDashboard
      </Text>
      <CustomButton
        title="View Hostel"
        onPress={() => navigation.push('HomeScreen')}
      />
      <CustomButton
        title="Currently Live"
        onPress={() => navigation.navigate('MyHostels')}
      />
      <CustomButton
        title="Pending Request"
        onPress={() => navigation.navigate('MyPendingHostels')}
      />
      <CustomButton
        title="Favorite Hostels"
        onPress={() => navigation.navigate('FavoriteHostels')}
      />
      <CustomButton
        title="Logout"
        onPress={() => navigation.replace('LoginScreen')}
      />
    </ImageBackground>
  );
};

export default UserDashboard;
