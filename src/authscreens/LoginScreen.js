import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {COLOR} from '../CONSTANTS/Colors';
import {fonts} from '../CONSTANTS/fonts';
import {bg, logo2, logo1} from '../CONSTANTS/images';
import CustomButton from '../reuseable/CustomButton';
import Input from '../reuseable/Input';
import {api} from '../CONSTANTS/api';
import axios from 'axios';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email.length == 0 || password.length === 0) {
      alert('Please enter your credientals to Login.');
    } else {
      axios
        .get(api.login, {
          params: {
            email: email,
            pass: password,
          },
        })
        .then(res => {
          if (res.data.success === false) alert(res.data.message);
          else {
            global.user[0] = res.data.data;
            global.user_id = res.data.data.Id;
            if (res.data.data.AccountType === 'Hostel Manager')
              navigation.navigate('Dashboard');
            else if (res.data.data.AccountType === 'Admin') {
              navigation.navigate('SuperAdmin_Dashboard');
            } else {
              navigation.navigate('UserDashboard');
            }
          }
        })
        .catch(err => alert(err));
    }
  };
  return (
    <ImageBackground
      source={bg}
      style={{...StyleSheet.absoluteFillObject, paddingHorizontal: 16}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: SCREEN_WIDTH * 0.15,
            marginBottom: 30,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: fonts.medium,
              color: COLOR.txtColor,
            }}>
            Login
          </Text>
        </View>
        <View>
          <Image
            source={logo1}
            style={{
              width: 100,
              height: 100,
              marginBottom: 40,
              alignSelf: 'center',
            }}
          />
          <Input
            heading={'Email'}
            title="Email"
            onChange={txt => setEmail(txt)}
          />

          <Input
            heading={'Password'}
            title="Password"
            onChange={txt => setPassword(txt)}
          />
        </View>
        <CustomButton
          title="Login"
          onPress={() => handleLogin()}
          style={{marginTop: 40}}
        />
        <Text
          style={{color: COLOR.secondary, textAlign: 'center', marginTop: 20}}>
          __________________ OR ________________
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
          <Text
            style={{
              color: COLOR.secondary,
              textAlign: 'center',
              marginTop: 20,
            }}>
            Don't have an account? Signup
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backgroundImage: {
    flex: 1,
    opacity: 0.7,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  textInput: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 40,
    padding: 5,
    paddingLeft: 15,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  btnSignUp: {
    width: '100%',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 1,
  },
  btnLogin: {
    width: '95%',
    borderRadius: 30,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#000',
  },
});
