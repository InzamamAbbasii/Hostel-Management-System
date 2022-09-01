import React, {useState, useEffect} from 'react';
import {View, Text, StatusBar, Button} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {COLOR} from './src/CONSTANTS/Colors';
//authscreen
import Welcome from './src/authscreens/Welcome';
import LoginScreen from './src/authscreens/LoginScreen';
import SignupScreen from './src/authscreens/SignupScreen';
//Mini Admin or Hostel Manager
import Dashboard from './src/Mini Admin/Dashboard';
import AddHostel from './src/Mini Admin/AddHostel';
import ViewHostels from './src/Mini Admin/ViewHostels';
import PendingHostels from './src/Mini Admin/PendingHostels';
import BookingRequest from './src/Mini Admin/BookingRequest';
import AddRooms from './src/Mini Admin/AddRooms';
import MapScreen from './src/Mini Admin/MapScreen';
//Super Admin
import SuperAdmin_Dashboard from './src/Super Admin/SuperAdmin_Dashboard';
import VerifyHostels from './src/Super Admin/VerifyHostels';
import SuperAdmin_ViewHostels from './src/Super Admin/SuperAdmin_ViewHostels';
import Search from './src/Super Admin/Search';

//User
import UserDashboard from './src/User/UserDashboard';
import MyHostels from './src/User/MyHostels';
import FavoriteHostels from './src/User/FavoriteHostels';

import SplashScreen from './src/SplashScreen';
import HomeScreen from './src/HomeScreen';
import HostelDetail from './src/HostelDetail';
import BookRoom from './src/BookRoom';
import Feedback from './src/Feedback';
import MapViewScreen from './src/MapView';
import './global.js';
const Stack = createNativeStackNavigator();
const App = ({navigation}) => {
  // let navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    global.user = [];
    global.user_id = 0;
  }, []);

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={COLOR.secondary}
        barStyle={'light-content'}
        translucent
      />
      <Stack.Navigator
        // screenOptions={{headerShown: false}}
        // initialRouteName={'MapScreen'}
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: COLOR.secondary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
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
        <Stack.Screen name="BookRoom" component={BookRoom} />
        <Stack.Screen
          name="Feedback"
          component={Feedback}
          options={{headerShown: true}}
        />

        <Stack.Screen
          name="SuperAdmin_Dashboard"
          component={SuperAdmin_Dashboard}
        />
        <Stack.Screen
          name="VerifyHostels"
          component={VerifyHostels}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="SuperAdmin_ViewHostels"
          component={SuperAdmin_ViewHostels}
          // options={{headerShown: true, title: 'ViewHostel'}}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{headerShown: true}}
        />

        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="AddHostel" component={AddHostel} />
        <Stack.Screen name="AddRooms" component={AddRooms} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen
          name="MapViewScreen"
          component={MapViewScreen}
          // options={{headerShown: true}}
        />
        <Stack.Screen
          name="ViewHostels"
          component={ViewHostels}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="PendingHostels"
          component={PendingHostels}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="BookingRequest"
          component={BookingRequest}
          options={{headerShown: true}}
        />

        <Stack.Screen name="UserDashboard" component={UserDashboard} />
        <Stack.Screen name="MyHostels" component={MyHostels} />
        <Stack.Screen name="FavoriteHostels" component={FavoriteHostels} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
