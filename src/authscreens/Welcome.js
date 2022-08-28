import React from 'react';
import {View, Text, StyleSheet, Image, ImageBackground} from 'react-native';
import {COLOR} from '../CONSTANTS/Colors';
import Input from '../reuseable/Input';
import CustomButton from '../reuseable/CustomButton';
const Welcome = ({navigation}) => {
  // const handleGuestLogin = () => {
  //   global.user[0] = [];
  //   global.user_id = 0;
  //   navigation.navigate('SuperAdmin_ViewHostels');
  // };
  return (
    <View style={styles.container}>
      {/* <ImageBackground
   source={require('../../assests/images/4.jpg')}
       style={styles.container}> */}
      <Image
        source={require('../../assests/images/logo1.png')}
        style={styles.imageStyle}
      />
      <Text style={styles.title}>Welcome To HMS</Text>
      <View style={{marginTop: 50, flex: 0.4, justifyContent: 'flex-end'}}>
        <CustomButton
          title={'Login'}
          titleStyle={{color: COLOR.secondary}}
          onPress={() => navigation.navigate('LoginScreen')}
          style={{backgroundColor: COLOR.white}}
        />
        <CustomButton
          title={'Register'}
          titleStyle={{color: COLOR.secondary}}
          onPress={() => navigation.navigate('SignupScreen')}
          style={{backgroundColor: COLOR.white}}
        />
        {/* <CustomButton
          title={'Browse Hostel as Guest'}
          titleStyle={{color: COLOR.secondary}}
          onPress={() => handleGuestLogin()}
          style={{backgroundColor: COLOR.white}}
        /> */}
      </View>
      {/* </ImageBackground> */}
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    backgroundColor: COLOR.secondary,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLOR.white,
  },
  imageStyle: {width: 100, height: 100, marginVertical: 20},
});
