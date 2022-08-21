import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Lottie from 'lottie-react-native';
const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        zIndex: 999,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Lottie
        source={require('../../assests/loading.json')}
        autoPlay
        loop
        style={{width: 200, height: 200}}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
