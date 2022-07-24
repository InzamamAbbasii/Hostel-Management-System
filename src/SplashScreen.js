import React from 'react';
import {View, Text, ImageBackground, StyleSheet, Image} from 'react-native';

const SplashScreen = () => {
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
