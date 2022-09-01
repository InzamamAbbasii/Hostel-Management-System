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
import Loading from '../reuseable/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewHostels = ({navigation}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const onChangeSearch = query => setSearchQuery(query);

  useEffect(() => {
    setLoading(true);
    getHostels();
  }, []);
  const getHostels = async () => {
    let id = await AsyncStorage.getItem('user_id');
    axios
      .get(api.get_Approved_Hostels, {
        params: {
          user_id: id,
        },
      })
      .then(res => {
        setData(res.data);
      })
      .catch(err => alert(err))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };
  return (
    <View style={{flex: 1}}>
      {loading && <Loading />}

      {data.length === 0 && loading == false ? (
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
                    HostelImages: item.item.HostelImages,
                    Rooms: item.item.RoomsList,
                  })
                }>
                {item.item?.HostelImages?.length === 0 ? (
                  <Card.Cover
                    source={{
                      uri: `${api.image}${'noimage.png'}`,
                    }}
                  />
                ) : (
                  <Card.Cover
                    source={{
                      uri: `${api.image}${item.item.HostelImages[0]}`,
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
          // renderItem={item => {
          //   return (
          //     <Card
          //       onPress={() =>
          //         navigation.navigate('HostelDetail', {
          //           Hostel: item.item.Hostel,
          //           Rooms: item.item.RoomsList,
          //         })
          //       }>
          //       {item.item.Hostel.Image === null ? (
          //         <Card.Cover
          //           source={{
          //             uri: `${api.image}${'noimage.png'}`,
          //           }}
          //         />
          //       ) : (
          //         <Card.Cover
          //           source={{
          //             uri: `${api.image}${item.item.Hostel.Image}`,
          //           }}
          //         />
          //       )}
          //       <Card.Content>
          //         {/* <Title>Rs 11,000</Title> */}
          //         <Title>{item.item.Hostel.HostelName}</Title>
          //         <Paragraph>{item.item.Hostel.Address}</Paragraph>
          //       </Card.Content>
          //     </Card>
          //   );
          // }}
        />
      )}
    </View>
  );
};

export default ViewHostels;
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
