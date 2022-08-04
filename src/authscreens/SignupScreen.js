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
import {Picker} from '@react-native-picker/picker';
import {COLOR} from '../CONSTANTS/Colors';
import {fonts} from '../CONSTANTS/fonts';
import CustomButton from '../reuseable/CustomButton';
import Input from '../reuseable/Input';
import {bg, logo2} from '../CONSTANTS/images';
import axios from 'axios';
import {api} from '../CONSTANTS/api';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;

const SignupScreen = ({navigation}) => {
  const [index, setIndex] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState('');

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [occupation, setOccupation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [accounttype, setAccounttype] = useState('');

  const checkValidation = () => {
    if (
      firstname.length == 0 ||
      lastname.length === 0 ||
      email.length === 0 ||
      cnic.length === 0 ||
      phoneno.length === 0 ||
      password.length === 0 ||
      confirmpassword.length === 0
    ) {
      alert('Please Fill All Fields');
      return false;
    } else if (accounttype === 'User' && occupation.length === 0) {
      alert('Please enter your occupation');
      return false;
    } else if (password !== confirmpassword) {
      alert('Password and confirm passwords are mismatch');
      return false;
    } else {
      return true;
    }
  };

  const handleSignup = () => {
    if (checkValidation()) {
      const params = {
        FirstName: firstname,
        LastName: lastname,
        Email: email,
        CNIC: cnic,
        PhoneNo: phoneno,
        Password: password,
        AccountType: accounttype,
      };
      accounttype === 'User' && (params.Occupation = occupation),
        axios
          .post(api.signup, params)
          .then(response => {
            // accounttype === 'User'
            //   ? navigation.navigate('HomeScreen')
            //   : navigation.navigate('Dashboard');
            alert('Register Successfully.');
          })
          .catch(err => alert(err));
    }
  };
  return (
    <ImageBackground
      source={bg}
      style={{...StyleSheet.absoluteFillObject, paddingHorizontal: 16}}>
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
          Create Account
        </Text>
      </View>
      {index === 0 ? (
        <View style={styles.container}>
          <Text style={styles.title}>Choose your preffered account</Text>
          <View style={{flex: 0.8, marginTop: 30}}>
            <TouchableOpacity
              style={{
                ...styles.accountContainer,
                borderWidth: accounttype === 'User' ? 1 : 0,
              }}
              onPress={() => setAccounttype('User')}>
              <Image source={logo2} style={styles.accountContainerImage} />
              <Text style={styles.accountContainerText}>User Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.accountContainer,
                borderWidth: accounttype === 'Hostel Manager' ? 1 : 0,
              }}
              onPress={() => setAccounttype('Hostel Manager')}>
              <Image source={logo2} style={styles.accountContainerImage} />
              <Text style={styles.accountContainerText}>
                Hostel Manager Account
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 0.2,
              justifyContent: 'center',
            }}>
            <CustomButton
              title={'NEXT'}
              style={{
                height: 50,
                width: 140,
                borderRadius: 5,
                alignSelf: 'flex-end',
                backgroundColor:
                  accounttype !== '' ? COLOR.secondary : '#ED1C244D',
              }}
              onPress={() => setIndex(index + 1)}
            />
          </View>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Input
              heading={'First Name '}
              title="Firstname"
              onChange={txt => setFirstname(txt)}
            />
            <Input
              heading={'Last Name '}
              title="Lastname"
              onChange={txt => setLastname(txt)}
            />
            <Input
              heading={'Email'}
              title="Email"
              onChange={txt => setEmail(txt)}
            />
            <Input
              heading={'CNIC'}
              title="xxxxx-xxxxxxx-x"
              onChange={txt => setCnic(txt)}
            />
            <Input
              heading={'Phone Number'}
              title="Phone Number"
              onChange={txt => setPhoneno(txt)}
            />

            {accounttype === 'User' && (
              <Input
                heading={'Occupation'}
                title="Occupation"
                onChange={txt => setOccupation(txt)}
              />
            )}
            <Input
              heading={'Password'}
              title="Password"
              onChange={txt => setPassword(txt)}
            />
            <Input
              heading={'Re-Enter Password'}
              title="Re-Enter Password"
              onChange={txt => setConfirmpassword(txt)}
            />
          </View>
          <CustomButton
            title="Sign Up"
            style={{marginVertical: 30}}
            onPress={() => handleSignup()}
          />
        </ScrollView>
      )}
    </ImageBackground>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accountContainer: {
    flex: 1,
    borderColor: COLOR.secondary,
    // borderWidth: 1,
    borderRadius: 15,
    marginTop: 30,
    elevation: 2,
    backgroundColor: COLOR.white,
    height: 50,
    width: SCREEN_WIDTH - 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  accountContainerText: {
    color: COLOR.txtColor,
    fontWeight: '500',
    fontSize: 16,
    fontFamily: fonts.medium,
  },
  accountContainerImage: {height: 40, width: 40, marginBottom: 5},
  backgroundImage: {
    flex: 1,
    opacity: 0.7,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  textInput: {
    margin: 3,
    marginHorizontal: 10,
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLOR.txtColor,
    fontFamily: fonts.medium,
  },
});
