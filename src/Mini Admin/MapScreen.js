import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  ToastAndroid,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, PROVIDER_DEFAULT} from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import {Searchbar} from 'react-native-paper';
import CustomButton from '../reuseable/CustomButton';
import {logo1, marker} from '../CONSTANTS/images';
import Geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, request} from 'react-native-permissions';
import Geocoder from 'react-native-geocoder';
import {COLOR} from '../CONSTANTS/Colors';
import CustomSearchBar from '../reuseable/CustomSearchBar';

const MapScreen = ({navigation}) => {
  const mapViewRef = useRef();
  const [coordinates, setCoordinates] = useState({
    latitude: 51.506322571783386,
    longitude: -0.1277460716664791,
    latitudeDelta: 0.01,
    longitudeDelta: 0.23,
  });
  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    var response = request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if ((response = 'granted')) {
      Geolocation.getCurrentPosition(
        ({coords}) => {
          let r = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            // latitudeDelta: 0.03,
            // longitudeDelta: 0.01,
          };
          // mapViewRef.current.animateToRegion(r, 2000);
          let markersList = [];
          markersList.push(r);
          mapViewRef.current.fitToCoordinates(markersList, {
            edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
            animated: true,
          });
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

  const handleSelect = () => {
    var NY = {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
    };
    Geocoder.geocodePosition(NY)
      .then(res => {
        console.log(res[0]);
        if (typeof res[0] === 'undefined') {
          alert('Please Choose Correct Location');
        } else {
          navigation.navigate('AddHostel', {
            Address: res[0].formattedAddress,
            Latitude: coordinates.latitude,
            Longitude: coordinates.longitude,
            City: res[0].locality,
          });
        }
      })
      .catch(err => {
        let errorMsg = 'Error in geoCoder' + err;
        alert(err);
        // ToastAndroid.show(errorMsg, ToastAndroid.LONG);
      });
  };
  const onRegionChange = region => {
    setCoordinates({
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    });
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      // store.dispatch({ type: "CHANGE_INPUT", val: value });
      handleSearch();
    }, 2000);

    // if this effect run again, because `value` changed, we remove the previous timeout
    return () => clearTimeout(timeout);
  }, [searchText]);

  const handleSearch = () => {
    console.log(searchText);
    // Address Geocoding
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
            let r = {
              latitude: res[0].position.lat,
              longitude: res[0].position.lng,
              latitudeDelta: 0.03,
              longitudeDelta: 0.01,
            };
            mapViewRef.current.animateToRegion(r, 2000);
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

  return (
    <View style={{flex: 1}}>
      <Searchbar
        placeholder="Search"
        onChangeText={txt => setSearchText(txt)}
        value={searchText}
        style={{
          zIndex: 999,
          marginTop: 50,
          marginHorizontal: 10,
        }}
      />

      <MapView
        ref={mapViewRef}
        style={StyleSheet.absoluteFillObject}
        provider={
          Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        } // remove if not using Google Maps
        initialRegion={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: coordinates.latitudeDelta,
          longitudeDelta: coordinates.longitudeDelta,
        }}
        onRegionChangeComplete={region => onRegionChange(region)}
        zoomEnabled={true}
        zoomControlEnabled={false}
        showsUserLocation={false}
        showsMyLocationButton={false}></MapView>
      <View style={styles.markerFixed}>
        <Image style={styles.marker} source={marker} />
      </View>
      <CustomButton
        title="Select"
        onPress={() => handleSelect()}
        style={{position: 'absolute', bottom: 30}}
      />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  markerFixed: {
    left: '50%',
    marginLeft: -18,
    marginTop: -30,
    position: 'absolute',
    top: '50%',
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  marker: {
    height: 35,
    width: 35,
  },
});
