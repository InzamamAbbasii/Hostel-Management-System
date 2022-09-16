import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TouchableHighlightBase,
} from 'react-native';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {fonts} from '../CONSTANTS/fonts';
import {COLOR} from '../CONSTANTS/Colors';
import {backBtn, back} from '../CONSTANTS/images';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class CustomHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }
  async componentDidMount() {
    let user = await AsyncStorage.getItem('user');
    user !== null && this.setState({user: user});
  }
  render() {
    const handleLogout = async () => {
      await AsyncStorage.removeItem('user_id');
      await AsyncStorage.removeItem('user');
      this.props.navigation.replace('LoginScreen');
    };
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
        {this.props.showBackButton == false ? null : (
          <TouchableOpacity onPress={this.props.onBackPress}>
            <Image
              resizeMode="contain"
              source={backBtn}
              style={{height: 26, width: 26, marginLeft: 10}}
            />
          </TouchableOpacity>
        )}
        <View style={{flex: 1}}>
          <Text
            style={{
              alignSelf: 'flex-start',
              marginLeft: 20,
              fontSize: 22,
              // color: '#262626',
              color: '#FFF',
              fontWeight: 'bold',
              fontFamily: fonts.regular,
            }}>
            {this.props.text}
          </Text>
        </View>
        {this.state.user !== null && (
          <TouchableOpacity
            onPress={() => handleLogout()}
            style={{
              backgroundColor: '#CECECE',
              padding: 5,
              position: 'absolute',
              right: 40,
              top: 60,
              borderRadius: 10,
            }}>
            <Text style={{color: '#000'}}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
