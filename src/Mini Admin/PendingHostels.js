import React, {useState, useEffect} from 'react';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Searchbar,
} from 'react-native-paper';
import {View, ScrollView, FlatList, Text, RefreshControl} from 'react-native';
import axios from 'axios';
import {api} from '../CONSTANTS/api';
import {COLOR} from '../CONSTANTS/Colors';
import {hostel_1} from '../CONSTANTS/images';
const PendingHostels = ({navigation}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const onChangeSearch = query => setSearchQuery(query);

  useEffect(() => {
    getHostels();
  }, []);
  const getHostels = () => {
    axios
      .get(api.get_Pending_Hostels, {
        params: {
          user_id: global.user_id,
        },
      })
      .then(res => {
        setData(res.data);
      })
      .catch(err => alert(err))
      .finally(() => setRefreshing(false));
  };
  return (
    <View style={{flex: 1}}>
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
                onPress={() =>
                  navigation.navigate('HostelDetail', {
                    Hostel: item.item.Hostel,
                    HostelImages: item.item.HostelImages,
                    Rooms: item.item.RoomsList,
                  })
                }>
                {/* {item.item.Hostel.Image === null ? (
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
                )} */}

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
                </Card.Content>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
};

export default PendingHostels;
