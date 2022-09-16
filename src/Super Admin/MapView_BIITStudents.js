import React, {useState, useEffect, useRef} from 'react';
import {Searchbar} from 'react-native-paper';
import {
  View,
  Text,
  ToastAndroid,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, request} from 'react-native-permissions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import axios from 'axios';
import {api} from '../CONSTANTS/api';
import {COLOR} from '../CONSTANTS/Colors';
import {
  marker,
  marker_1,
  marker_2,
  marker_3,
  marker_4,
  marker_5,
  marker_6,
} from '../CONSTANTS/images';
import CustomButton from '../reuseable/CustomButton';
import CustomHeader from '../reuseable/CustomHeader';
import MenuComponent from '../reuseable/MenuComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {parse} from '@babel/core';
const MapView_BIITStudents = ({navigation, route}) => {
  const mapViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);
  const [coorsList, setCoorsList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [user_id, setUser_id] = useState(0);
  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    const getUser = async () => {
      let id = await AsyncStorage.getItem('user_id');
      let user = await AsyncStorage.getItem('user');
      let parseUser = JSON.parse(user);
      parseUser !== null && setUserRole(parseUser.AccountType);
      // console.log(parseUser.AccountType);
      setUser_id(id);
    };
    getUser();
    getHostels();
  }, []);

  const getHostels = async () => {
    let id = await AsyncStorage.getItem('user_id');
    let user = await AsyncStorage.getItem('user');
    if (user !== null) user = JSON.parse(user);
    axios
      .get(api.get_Hostel_By_InstitudeName, {
        params: {
          user_id: id === null ? 0 : id,
          institude_name: 'BIIT',
        },
      })
      .then(res => {
        setData(res.data);
        let coordinateList = [];
        res.data.forEach(element => {
          let obj = {
            latitude: parseFloat(element.Hostel.Latitude),
            longitude: parseFloat(element.Hostel.Longitude),
          };
          coordinateList.push(obj);
        });
        setCoorsList(coordinateList);
        mapViewRef.current.fitToCoordinates(coordinateList, {
          edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
          animated: true,
        });
      })
      .catch(err => alert(err));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch();
    }, 2000);

    // if this effect run again, because `value` changed, we remove the previous timeout
    return () => clearTimeout(timeout);
  }, [searchText]);

  const handleSearch = () => {
    if (searchText) {
      Geocoder.geocodeAddress(searchText)
        .then(res => {
          // res is an Array of geocoding object (see below)
          if (res.length < 1) {
            ToastAndroid.show(
              'Location not found.Please enter correct address.',
              ToastAndroid.LONG,
            );
          } else {
            console.log(res);
            let r = {
              latitude: res[0].position.lat,
              longitude: res[0].position.lng,
              latitudeDelta: 0.03,
              longitudeDelta: 0.01,
            };
            // mapViewRef.current.animateToRegion(r, 2000);
            let markersList = [];
            markersList.push(r);
            mapViewRef.current.fitToCoordinates(markersList, {
              edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
              animated: true,
            });
          }
        })
        .catch(err => {
          let errorMsg = 'Error in geoCoder' + err;
          alert(errorMsg);
          // ToastAndroid.show(errorMsg, ToastAndroid.LONG);
        });
    } else {
      // ToastAndroid.show('Please Enter Location', ToastAndroid.LONG);
      // alert('Please Enter Location');
    }
  };

  const getCurrentLocation = () => {
    var response = request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if ((response = 'granted')) {
      Geolocation.getCurrentPosition(
        ({coords}) => {
          let r = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.01,
          };
          // setCoordinates(r);
          mapViewRef.current.animateToRegion(r, 2000);
          // let markersList = [];
          // markersList.push(r);
          // mapViewRef.current.fitToCoordinates(markersList, {
          //   edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
          //   animated: true,
          // });
        },
        error => {
          if (error.code != 5) {
            console.log(error.message);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
        },
      );
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#F00'}}>
      <CustomHeader
        text="MapView"
        navigation={navigation}
        onBackPress={() => navigation.goBack()}
      />

      {/* <Searchbar
        placeholder="Search"
        onChangeText={txt => setSearchText(txt)}
        value={searchText}
      /> */}

      <MapView
        ref={mapViewRef}
        provider={PROVIDER_GOOGLE}
        style={{
          flex: 1,
        }}
        initialRegion={{
          latitude: 30.005495277822757,
          longitude: 69.41553150890356,
          latitudeDelta: 4.95,
          longitudeDelta: 4.95,
        }}
        scrollEnabled={true}
        zoomEnabled={true}
        zoomControlEnabled={true}
        showsUserLocation={false}
        showsMyLocationButton={false}>
        {data?.map((item, key) => {
          return (
            <Marker
              key={key}
              onCalloutPress={() => {
                userRole === 'Admin'
                  ? navigation.navigate('HostelDetail_Admin', {
                      Hostel: item.Hostel,
                      HostelImages: item.HostelImages,
                      Rooms: item.RoomsList,
                      Users: item.Users,
                      isFavorite: item.isFavorite,
                    })
                  : navigation.navigate('HostelDetail_User', {
                      Hostel: item.Hostel,
                      HostelImages: item.HostelImages,
                      Rooms: item.RoomsList,
                      Users: item.Users,
                      isFavorite: item.isFavorite,
                    });
              }}
              title={item.Hostel.HostelName}
              description={`City : ${item.Hostel.City}`}
              coordinate={{
                latitude: item.Hostel.Latitude,
                longitude: item.Hostel.Longitude,
              }}>
              {item.isBooked ? (
                <Image
                  source={marker_1}
                  style={{height: 35, width: 35}}
                  resizeMode={'contain'}
                />
              ) : item.isFavorite ? (
                <Image
                  source={marker_5}
                  style={{height: 35, width: 35}}
                  resizeMode={'contain'}
                />
              ) : (
                <Image
                  source={marker_4}
                  style={{height: 35, width: 35}}
                  resizeMode={'contain'}
                />
              )}
            </Marker>
          );
        })}
      </MapView>
      <View
        style={{
          position: 'absolute',
          top: 200,
          right: 13,
          zIndex: 1,
        }}>
        <TouchableOpacity
          onPress={() => getCurrentLocation()}
          style={{
            backgroundColor: 'rgba(252, 252, 252, 0.9)',
            borderRadius: 23,
            padding: 12,
            elevation: 2,
          }}>
          <MaterialIcons name="my-location" size={22} color={'#555'} />
        </TouchableOpacity>
      </View>
      {/* // )} */}
    </View>
  );
};

export default MapView_BIITStudents;

const styles = StyleSheet.create({
  markerFixed: {
    left: '50%',
    marginLeft: -18,
    marginTop: -30,
    position: 'absolute',
    top: '50%',
    zIndex: 999,
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  marker: {
    height: 35,
    width: 35,
  },
  btnLogin: {
    backgroundColor: '#000',
    height: 30,
    width: 50,
    position: 'absolute',
    right: 40,
    top: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  loginTxt: {color: '#FFF', fontSize: 14, fontWeight: '600'},
});
