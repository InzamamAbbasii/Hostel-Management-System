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
import {
  View,
  ScrollView,
  FlatList,
  Text,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import {Rating} from 'react-native-rating-element';
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
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <CustomButton
        title={'Click to See MapView'}
        style={{width: '100%', marginTop: 0, borderRadius: 0, marginBottom: 10}}
        onPress={() => navigation.replace('MapViewScreen')}
      />
      {data.length === 0 ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={{fontSize: 16, fontWeight: '500'}}>No Record Found</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
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
                mode="elevated"
                style={{
                  marginBottom: 7,
                  borderRadius: 8,
                  width: '95%',
                  alignSelf: 'center',
                }}
                onPress={() =>
                  navigation.navigate('HostelDetail', {
                    Hostel: item.item.Hostel,
                    Rooms: item.item.RoomsList,
                  })
                }>
                {item.item.Hostel.Image === null ? (
                  <Card.Cover
                    source={{
                      uri: `${api.image}${'noimage.png'}`,
                    }}
                  />
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

                  <Paragraph>{item.item.Hostel.Address}</Paragraph>
                  {item.item.Rating !== null && (
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <Rating
                        rated={item.item.Rating.AverageRating}
                        totalCount={5}
                        ratingColor="#f1c644"
                        ratingBackgroundColor="#d4d4d4"
                        size={24}
                        readonly // by default is false
                        icon="ios-star"
                        direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                      />
                      <Paragraph>
                        Rating:{item.item.Rating.AverageRating}(
                        {item.item.Rating.TotalReviews} reviews)
                      </Paragraph>
                    </View>
                  )}
                  <View
                    style={{
                      borderWidth: 0.3,
                      borderColor: 'gray',
                      marginVertical: 4,
                    }}></View>

                  <Paragraph
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: '#000',
                    }}>
                    Starting from
                    <Title> PKR {item.item.Hostel.MinPrice} </Title>
                  </Paragraph>
                  {item.item.Hostel.Gender == 'Male' ? (
                    <View style={styles.genderView}>
                      <Text style={styles.genderText}>
                        {item.item.Hostel.Gender}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        ...styles.genderView,
                        backgroundColor: '#000080',
                      }}>
                      <Text style={styles.genderText}>
                        {item.item.Hostel.Gender}
                      </Text>
                    </View>
                  )}
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

const styles = StyleSheet.create({
  genderView: {
    backgroundColor: COLOR.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 10,
    borderRadius: 5,
    // height: 60,
  },
  genderText: {fontSize: 14, fontWeight: '700', color: '#FFF'},
});
