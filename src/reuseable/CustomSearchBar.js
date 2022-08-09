import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {COLOR} from '../CONSTANTS/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const SCREEN_WIDTH = Dimensions.get('screen').width;
const CustomSearchBar = props => {
  return (
    <View>
      <View
        style={{
          position: 'absolute',
          top: 70,
          left: 15,
          right: 15,
          zIndex: 999,
          backgroundColor: '#ddd',
          width: SCREEN_WIDTH - 30,
          height: 40,
          borderRadius: 5,
        }}>
        <Icon name="user" size={25} color={COLOR.secondary} />
        <MaterialCommunityIcons name="briefcase-search" size={25} />
        <Icon name="search" size={25} />
      </View>
    </View>
  );
};

export default CustomSearchBar;

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
