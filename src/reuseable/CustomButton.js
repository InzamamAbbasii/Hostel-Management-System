import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {COLOR} from '../CONSTANTS/Colors';
const SCREEN_WIDTH = Dimensions.get('screen').width;
const CustomButton = props => {
  return (
    <TouchableOpacity style={[styles.btn, props.style]} onPress={props.onPress}>
      <Text style={[styles.btnText, props.titleStyle]}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: COLOR.secondary,
    height: 50,
    width: SCREEN_WIDTH - 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    alignSelf: 'center',
  },
  btnText: {
    color: COLOR.white,
    fontWeight: '500',
    fontSize: 16,
  },
});
