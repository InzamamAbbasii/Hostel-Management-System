import React, {useState, useEffect} from 'react';
import {View, Text, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//authscreen
import Welcome from './src/authscreens/Welcome';
import LoginScreen from './src/authscreens/LoginScreen';
import SignupScreen from './src/authscreens/SignupScreen';
//Mini Admin or Hostel Manager
import Dashboard from './src/Mini Admin/Dashboard';
import AddHostel from './src/Mini Admin/AddHostel';
import ViewHostels from './src/Mini Admin/ViewHostels';
import BookingRequest from './src/Mini Admin/BookingRequest';
import AddRooms from './src/Mini Admin/AddRooms';
import MapScreen from './src/Mini Admin/MapScreen';
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
      <StatusBar
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
        translucent
      />
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        // initialRouteName={'MapScreen'}
      >
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{headerShown: false}}
        />
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
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="HostelDetail"
          component={HostelDetail}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="BookRoom"
          component={BookRoom}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="Feedback"
          component={Feedback}
          options={{headerShown: true}}
        />

        <Stack.Screen
          name="SuperAdmin_Dashboard"
          component={SuperAdmin_Dashboard}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="VerifyHostels"
          component={VerifyHostels}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="SuperAdmin_ViewHostels"
          component={SuperAdmin_ViewHostels}
        />

        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="AddHostel" component={AddHostel} />
        <Stack.Screen name="AddRooms" component={AddRooms} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen
          name="ViewHostels"
          component={ViewHostels}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="BookingRequest"
          component={BookingRequest}
          options={{headerShown: true}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
