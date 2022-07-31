import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//authscreen
import LoginScreen from './src/authscreens/LoginScreen';
import SignupScreen from './src/authscreens/SignupScreen';
//Mini Admin
import Dashboard from './src/Mini Admin/Dashboard';
import AddHostel from './src/Mini Admin/AddHostel';
import ViewHostels from './src/Mini Admin/ViewHostels';
import BookingRequest from './src/Mini Admin/BookingRequest';
//Super Admin
import SuperAdmin_Dashboard from './src/Super Admin/SuperAdmin_Dashboard';
import VerifyHostels from './src/Super Admin/VerifyHostels';
import SuperAdmin_ViewHostels from './src/Super Admin/SuperAdmin_ViewHostels';

import SplashScreen from './src/SplashScreen';
import HomeScreen from './src/HomeScreen';
import HostelDetail from './src/HostelDetail';
import BookRoom from './src/BookRoom';
import Feedback from './src/Feedback';

const Stack = createNativeStackNavigator();
const App = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);
  if (loading) {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignupScreen"
          component={SignupScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="HostelDetail" component={HostelDetail} />
        <Stack.Screen name="BookRoom" component={BookRoom} />
        <Stack.Screen name="Feedback" component={Feedback} />

        <Stack.Screen
          name="SuperAdmin_Dashboard"
          component={SuperAdmin_Dashboard}
        />
        <Stack.Screen name="VerifyHostels" component={VerifyHostels} />
        <Stack.Screen
          name="SuperAdmin_ViewHostels"
          component={SuperAdmin_ViewHostels}
        />

        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="AddHostel" component={AddHostel} />
        <Stack.Screen name="ViewHostels" component={ViewHostels} />
        <Stack.Screen name="BookingRequest" component={BookingRequest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
