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
import axios from 'axios';
const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = () => {
    if (username.length == 0 || password.length === 0) {
      alert('All Fields are required');
    } else {
      axios
        .get('http://192.168.1.102/HMSAPI/api/Auth/Login', {
          params: {
            name: username,
            pass: password,
          },
        })
        .then(res => {
          if (res.data.success == false) alert(res.data.message);
          else navigation.navigate('HomeScreen');
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
          <View style={{marginTop: 100}}>
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
                  style={{
                    padding: 5,
                    fontSize: 18,
                    width: '85%',
                    color: '#000',
                  }}
                  placeholder="UserName"
                  placeholderTextColor="#3228"
                  onChangeText={name => setUsername(name)}
                  value={username}
                />
              </View>

              <View style={styles.textInput}>
                <TextInput
                  style={{
                    padding: 5,
                    fontSize: 18,
                    width: '85%',
                    color: '#000',
                  }}
                  placeholder="Password"
                  placeholderTextColor="#3228"
                  secureTextEntry={true}
                  onChangeText={password => setPassword(password)}
                  value={password}
                />
              </View>

              <TouchableOpacity
                style={styles.btnLogin}
                onPress={() => handleLogin()}>
                <Text
                  style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
                  Login
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 20,
                  margin: 14,
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  color: '#fff',
                }}>
                {' '}
                OR{' '}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 17, color: '#fff'}}>
                  {' '}
                  Don't have an account?{' '}
                </Text>
                <Text
                  style={{fontSize: 20, fontWeight: 'bold', color: '#fff'}}
                  onPress={() => navigation.navigate('SignupScreen')}>
                  SignUp{' '}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
