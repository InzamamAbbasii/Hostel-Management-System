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
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
const SignupScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [contactno, setContactno] = useState('');
  const [cnic, setCnic] = useState('');
  const [occuption, setOccuption] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [accounttype, setAccounttype] = useState('user');

  const handleSignup = () => {
    console.log(
      username,
      contactno,
      cnic,
      occuption,
      accounttype,
      password,
      confirmpassword,
    );
    if (
      username.length === 0 ||
      contactno.length === 0 ||
      cnic.length === 0 ||
      occuption.length === 0 ||
      accounttype.length == 0 ||
      password.length == 0 ||
      confirmpassword.length == 0
    ) {
      alert('All fields are required.');
    } else if (password !== confirmpassword) {
      alert('Password and confirm passwords are mismatch');
    } else {
      axios
        .post('http://192.168.1.102/HMSAPI/api/Auth/Register', {
          UserName: username,
          ContactNo: contactno,
          CNIC: cnic,
          Occupation: occuption,
          Password: password,
          AccountType: accounttype,
        })
        .then(response => {
          alert('Register Successfully.');
        })
        .catch(err => alert(err));
    }
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assests/images/6.jpg')}
        resizeMode={'stretch'}
        style={styles.backgroundImage}>
        <ScrollView>
          <Image
            source={require('../../assests/images/logo1.png')}
            style={{
              width: 150,
              height: 150,
              alignSelf: 'center',
              marginBottom: 20,
            }}
          />
          <View style={styles.form}>
            <View style={styles.textInput}>
              <TextInput
                style={{padding: 5, fontSize: 18, width: '85%', color: '#000'}}
                placeholder="UserName"
                placeholderTextColor="#3228"
                onChangeText={txt => setUsername(txt)}
                value={username}
              />
            </View>

            <View style={styles.textInput}>
              <TextInput
                style={{padding: 5, fontSize: 18, width: '85%', color: '#000'}}
                placeholder="Contact No"
                placeholderTextColor="#3228"
                onChangeText={txt => setContactno(txt)}
                value={contactno}
              />
            </View>
            <View style={styles.textInput}>
              <TextInput
                style={{padding: 5, fontSize: 18, width: '85%', color: '#000'}}
                placeholder="CNIC"
                placeholderTextColor="#3228"
                onChangeText={txt => setCnic(txt)}
                value={cnic}
              />
            </View>
            <View style={styles.textInput}>
              <TextInput
                style={{padding: 5, fontSize: 18, width: '85%', color: '#000'}}
                placeholder="Occupation"
                placeholderTextColor="#3228"
                onChangeText={txt => setOccuption(txt)}
                value={occuption}
              />
            </View>
            <View style={{...styles.textInput, padding: 0}}>
              <Picker
                style={{width: '100%', height: 0}}
                selectedValue={accounttype}
                onValueChange={(itemValue, itemIndex) =>
                  setAccounttype(itemValue)
                }>
                <Picker.Item label="User" value="user" />
                <Picker.Item label="Admin" value="admin" />
                <Picker.Item label="Super Admin" value="super admin" />
              </Picker>
            </View>
            <View style={styles.textInput}>
              <TextInput
                style={{padding: 5, fontSize: 18, width: '85%', color: '#000'}}
                placeholder="Password"
                placeholderTextColor="#3228"
                secureTextEntry={true}
                onChangeText={password => setPassword(password)}
                value={password}
              />
            </View>
            <View style={styles.textInput}>
              <TextInput
                style={{padding: 5, fontSize: 18, width: '85%', color: '#000'}}
                placeholder="Confirm Password"
                placeholderTextColor="#3228"
                secureTextEntry={true}
                onChangeText={password => setConfirmpassword(password)}
                value={confirmpassword}
              />
            </View>

            <TouchableOpacity
              style={styles.btnLogin}
              onPress={() => handleSignup()}>
              <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
                SignUp
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 20,
                margin: 7,
                alignSelf: 'center',
                fontWeight: 'bold',
                color: '#fff',
              }}>
              {' '}
              OR{' '}
            </Text>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 17, color: '#fff'}}>
                {' '}
                Already have an account?{' '}
              </Text>
              <Text
                style={{fontSize: 20, fontWeight: 'bold', color: '#fff'}}
                onPress={() => navigation.navigate('LoginScreen')}>
                Login{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
});
