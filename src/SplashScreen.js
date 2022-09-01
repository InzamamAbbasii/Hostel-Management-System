import React, {useEffect} from 'react';
import {View, Text, ImageBackground, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SplashScreen = ({navigation}) => {
  // let navigation = useNavigation();

  useEffect(() => {
    setTimeout(async () => {
      // global.user[0] = [];
      // global.user_id = 0;
      await AsyncStorage.removeItem('user_id');
      await AsyncStorage.removeItem('user');
      navigation.replace('SuperAdmin_ViewHostels');
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
