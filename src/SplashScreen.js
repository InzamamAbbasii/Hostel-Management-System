import React, {useEffect} from 'react';
import {View, Text, ImageBackground, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SplashScreen = ({navigation}) => {
  // let navigation = useNavigation();

  useEffect(() => {
    setTimeout(async () => {
      // await AsyncStorage.removeItem('user_id');
      // await AsyncStorage.removeItem('user');
      let user = await AsyncStorage.getItem('user');
      console.log(user);
      if (user !== null) {
        user = JSON.parse(user);
        if (user.AccountType === 'Hostel Manager')
          navigation.navigate('Dashboard');
        else if (user.AccountType === 'Admin') {
          navigation.navigate('SuperAdmin_Dashboard');
        } else if (user.AccountType == 'User') {
          navigation.navigate('UserDashboard');
        } else {
          navigation.replace('HomeScreen');
        }
      } else {
        navigation.replace('HomeScreen');
      }
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      {/* <ImageBackground
        source={require('../assests/images/1.jpg')}
        resizeMode={'stretch'}
        style={{flex: 1}}></ImageBackground> */}
      <Image
        source={require('../assests/images/logo1.png')}
        style={{
          width: 150,
          height: 150,
          alignSelf: 'center',
          marginBottom: 20,
        }}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
