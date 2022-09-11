import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Lottie from 'lottie-react-native';
import {COLOR} from '../CONSTANTS/Colors';
const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        zIndex: 999,
        top: 200,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: COLOR.secondary,
          borderRadius: 20,
        }}>
        <Lottie source={require('../../assests/loading.json')} autoPlay loop />
      </View>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
