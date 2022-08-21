import {Text, View, Image, TouchableOpacity, Dimensions} from 'react-native';
import React, {Component} from 'react';
import {fonts} from '../CONSTANTS/fonts';
import {COLOR} from '../CONSTANTS/Colors';
import {backBtn} from '../CONSTANTS/images';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class CustomHeader extends Component {
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          // marginTop: 60,
          paddingTop: 60,
          paddingHorizontal: 10,
          paddingBottom: 10,
          alignItems: 'center',
          backgroundColor: COLOR.secondary,
          ...this.props.style,
        }}>
        <TouchableOpacity
          onPress={() => {
            this.props.navi.goBack();
          }}>
          <Image
            resizeMode="contain"
            source={backBtn}
            style={{height: 26, width: 26}}
          />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 22,
              // color: '#262626',
              color: '#FFF',
              fontWeight: '500',
              fontFamily: fonts.regular,
            }}>
            {this.props.text}
          </Text>
        </View>
      </View>
    );
  }
}
