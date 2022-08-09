import React, {useState, useEffect, useRef} from 'react';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Searchbar,
} from 'react-native-paper';
import {hostel_1} from '../CONSTANTS/images';
import {View, ScrollView, FlatList, Text, RefreshControl} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import axios from 'axios';
import {api} from '../CONSTANTS/api';
import {COLOR} from '../CONSTANTS/Colors';
import CustomButton from '../reuseable/CustomButton';

const SuperAdmin_ViewHostels = ({navigation}) => {
  const mapViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('Map'); //default list view
  const [coorsList, setCoorsList] = useState([]);
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
      })
      .catch(err => alert(err))
      .finally(() => setRefreshing(false));
  };

  return (
    <View style={{flex: 1}}>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <CustomButton
        title={'Click to See MapView'}
        style={{width: '100%', marginTop: 0, borderRadius: 0}}
        onPress={() => navigation.replace('MapViewScreen')}
      />
      {data.length === 0 ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={{fontSize: 16, fontWeight: '500'}}>No Record Found</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => item.Hostel.Id}
          refreshControl={
            <RefreshControl
              colors={[COLOR.secondary, COLOR.primary]}
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true), getHostels();
              }}
            />
          }
          renderItem={item => {
            return (
              <Card
                style={{marginBottom: 7}}
                onPress={() =>
                  navigation.navigate('HostelDetail', {
                    Hostel: item.item.Hostel,
                    Rooms: item.item.RoomsList,
                  })
                }>
                {/* <Card.Cover
                  source={{
                    uri: `${api.image}${item.item.Hostel.Image}`,
                  }}
                /> */}
                {item.item.Hostel.Image === null ? (
                  <Card.Cover source={hostel_1} />
                ) : (
                  <Card.Cover
                    source={{
                      uri: `${api.image}${item.item.Hostel.Image}`,
                    }}
                  />
                )}
                <Card.Content>
                  {/* <Title>Rs 11,000</Title> */}
                  <Title>{item.item.Hostel.HostelName}</Title>
                  {item.item.Rating !== null && (
                    <Paragraph>Rating : {item.item.Rating}</Paragraph>
                  )}
                  <Paragraph>{item.item.Hostel.Address}</Paragraph>
                </Card.Content>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
};

export default SuperAdmin_ViewHostels;
