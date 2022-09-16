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
import {RadioButton} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import {COLOR} from '../CONSTANTS/Colors';
import {fonts} from '../CONSTANTS/fonts';
import CustomButton from '../reuseable/CustomButton';
import Input from '../reuseable/Input';
import {bg, logo2} from '../CONSTANTS/images';
import axios from 'axios';
import {api} from '../CONSTANTS/api';
import Loading from '../reuseable/Loading';
import {style} from 'deprecated-react-native-prop-types/DeprecatedImagePropType';
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;

const SignupScreen = ({navigation}) => {
  // const [index, setIndex] = useState(0); //  0 to choose account type i.e, User or Hostel Manager
  const [index, setIndex] = useState(1); //  1 is for directorly open user registration form
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('male');
  const [cnic, setCnic] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [occupation, setOccupation] = useState('');
  const [institudename, setInstitudename] = useState('');
  const [regno, setRegno] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  // const [accounttype, setAccounttype] = useState(''); // choose by user
  const [accounttype, setAccounttype] = useState('User'); //to open user registration from
  const [loading, setLoading] = useState(false);
  const checkValidation = () => {
    if (
      firstname.length == 0 ||
      lastname.length === 0 ||
      email.length === 0 ||
      cnic.length === 0 ||
      phoneno.length === 0 ||
      institudename.length === 0 ||
      regno.length === 0 ||
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
      setLoading(true);
      const params = {
        FirstName: firstname,
        LastName: lastname,
        Email: email,
        Gender: gender,
        CNIC: cnic,
        PhoneNo: phoneno,
        InstitudeName: institudename,
        Reg_No: regno,
        Password: password,
        AccountType: accounttype,
      };
      accounttype === 'User' && (params.Occupation = occupation),
        axios
          .post(api.signup, params)
          .then(response => {
            alert('Register Successfully.');
            navigation.replace('LoginScreen');
          })
          .catch(err => alert(err))
          .finally(() => setLoading(true));
    }
  };
  return (
    <ImageBackground
      source={bg}
      style={{...StyleSheet.absoluteFillObject, paddingHorizontal: 16}}>
      {loading && <Loading />}
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
              keyboardType={'email-address'}
              onChange={txt => setEmail(txt)}
            />
            <View>
              <Text
                style={{
                  marginTop: 10,
                  marginLeft: 3,
                  fontSize: 15,
                  // fontFamily: fonts.regular,
                  color: '#303030',
                }}>
                Gender
              </Text>

              <View style={styles.rowView}>
                <View style={styles.rowView}>
                  <RadioButton
                    color={COLOR.secondary}
                    status={gender === 'male' ? 'checked' : 'unchecked'}
                    onPress={() => setGender('male')}
                  />
                  <Text style={styles.radioButtonText}>Male</Text>
                </View>
                <View style={styles.rowView}>
                  <RadioButton
                    color={COLOR.secondary}
                    status={gender === 'female' ? 'checked' : 'unchecked'}
                    onPress={() => setGender('female')}
                  />
                  <Text style={styles.radioButtonText}>Female</Text>
                </View>
              </View>
            </View>
            <Input
              heading={'CNIC'}
              title="xxxxx-xxxxxxx-x"
              onChange={txt => setCnic(txt)}
            />
            <Input
              heading={'Phone Number'}
              title="Phone Number"
              keyboardType={'phone-pad'}
              onChange={txt => setPhoneno(txt)}
            />

            {accounttype === 'User' && (
              <View>
                <Input
                  heading={'Institude Name'}
                  title="Institude Name"
                  value={institudename}
                  onChange={txt => setInstitudename(txt)}
                />
                <Input
                  heading={'Registration No'}
                  title="2022-Arid-2190"
                  onChange={txt => setRegno(txt)}
                />
                <Input
                  heading={'Occupation'}
                  title="Occupation"
                  onChange={txt => setOccupation(txt)}
                />
              </View>
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
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonText: {
    fontSize: 16,
    color: '#000',
    fontFamily: fonts.regular,
    marginRight: 50,
  },
});
