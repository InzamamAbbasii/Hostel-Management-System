import {Text, View, Image, TouchableOpacity, Dimensions} from 'react-native';
import React, {Component} from 'react';
import {fonts} from '../CONSTANTS/fonts';
import {backBtn} from '../CONSTANTS/images';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
export default class CustomHeader extends Component {
  render() {
    return (
      <View
        style={{
          ...this.props.style,
          flexDirection: 'row',
          marginTop: 60,
          marginBottom: 10,
          alignItems: 'center',
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
              color: '#262626',
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
