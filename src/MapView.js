import React, {useState, useEffect, useRef} from 'react';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Searchbar,
} from 'react-native-paper';
import {View, ScrollView, FlatList, Text, RefreshControl} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import axios from 'axios';
import {api} from './CONSTANTS/api';
import {COLOR} from './CONSTANTS/Colors';
import CustomButton from './reuseable/CustomButton';
import CustomHeader from './reuseable/CustomHeader';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import MenuComponent from './reuseable/MenuComponent';

const MapViewScreen = ({navigation, route}) => {
  const mapViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('Map'); //default list view
  const [coorsList, setCoorsList] = useState([]);
  const [mapRef, setmapRef] = useState(null);

  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const onChangeSearch = query => setSearchQuery(query);

  useEffect(() => {
    getHostels();
  }, []);

  const getHostels = () => {
    axios
      .get(api.get_Hostels)
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
        console.log(coordinateList);
        mapViewRef.current.fitToCoordinates(coordinateList, {
          edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
          animated: true,
        });
      })
      .catch(err => alert(err))
      .finally(() => setRefreshing(false));
  };

  const MapComponent = React.memo(() => {
    console.log('render map');
    return (
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
              title={item.Hostel.HostelName}
              description={`City : ${item.Hostel.City}`}
              coordinate={{
                latitude: item.Hostel.Latitude,
                longitude: item.Hostel.Longitude,
              }}></Marker>
          );
        })}
      </MapView>
    );
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#FFFF'}}>
      <CustomHeader text="MapView" navi={navigation} />
      <MenuComponent navigation={navigation} route={route} />

      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      {/* <CustomButton
        title={'Click to See ListView'}
        style={{width: '100%', marginTop: 0, borderRadius: 0}}
        onPress={() => navigation.replace('SuperAdmin_ViewHostels')}
      /> */}
      {data.length === 0 ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={{fontSize: 16, fontWeight: '500'}}>No Record Found</Text>
        </View>
      ) : (
        <MapComponent />
      )}
    </View>
  );
};

export default MapViewScreen;
