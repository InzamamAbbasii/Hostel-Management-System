import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import MapView, {PROVIDER_GOOGLE, PROVIDER_DEFAULT} from 'react-native-maps';
import CustomButton from '../reuseable/CustomButton';
import {marker} from '../CONSTANTS/images';
import Geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, request} from 'react-native-permissions';
import Geocoder from 'react-native-geocoder';
const MapScreen = ({navigation}) => {
  const mapViewRef = useRef();
  const [coordinates, setCoordinates] = useState({
    latitude: 51.506322571783386,
    longitude: -0.1277460716664791,
    latitudeDelta: 0.01,
    longitudeDelta: 0.23,
  });
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    var response = request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if ((response = 'granted')) {
      Geolocation.getCurrentPosition(
        ({coords}) => {
          console.log(coords);
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
    console.log(NY);
    Geocoder.geocodePosition(NY)
      .then(res => {
        console.log(res[0].formattedAddress);
        navigation.navigate('AddHostel', {
          Address: res[0].formattedAddress,
          Location: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          },
        });
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
  return (
    <View style={{flex: 1}}>
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
