import React, {useState, useEffect} from 'react';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Searchbar,
} from 'react-native-paper';
import {View, FlatList, Text, ScrollView, RefreshControl} from 'react-native';
import axios from 'axios';
import {api} from '../CONSTANTS/api';
import {COLOR} from '../CONSTANTS/Colors';
import {hostel_1} from '../CONSTANTS/images';
import Loading from '../reuseable/Loading';

const VerifyHostels = ({navigation, route}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const onChangeSearch = query => setSearchQuery(query);
  useEffect(() => {
    setLoading(true);
    getHostels();
  }, []);

  const getHostels = () => {
    axios
      .get(api.get_Hostels_Request)
      .then(res => {
        setData(res.data);
      })
      .catch(err => alert(err))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const handleAccept = id => {
    axios
      .get(api.approve_Hostel, {
        params: {id: id},
      })
      .then(res => {
        alert(res.data.message);
        //remove this record from list
        const newData = data.filter(item => item.Hostel.Id !== id);
        setData(newData);
      })
      .catch(err => alert(err));
  };

  const handleReject = id => {
    axios
      .get(api.reject_Hostel, {
        params: {id: id},
      })
      .then(res => {
        alert(res.data.message);
        //remove this record from list
        const newData = data.filter(item => item.Hostel.Id !== id);
        setData(newData);
      })
      .catch(err => alert(err));
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
                style={{marginBottom: 7}}
                onPress={() =>
                  navigation.navigate('HostelDetail', {
                    Hostel: item.item.Hostel,
                    HostelImages: item.item.HostelImages,
                    Rooms: item.item.RoomsList,
                  })
                }>
                {/* <Card.Cover
                  source={{
                    uri: `${api.image}${item.item.Hostel.Image}`,
                  }}
                /> */}
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
                  <Title>{item.item.Hostel.HostelName} </Title>
                  <Paragraph>Phone No : {item.item.Hostel.PhoneNo}</Paragraph>
                  <Paragraph>City : {item.item.Hostel.City}</Paragraph>
                  <Paragraph>Total Floor : {item.item.Hostel.Floor}</Paragraph>
                  <Paragraph>Address : {item.item.Hostel.Address}</Paragraph>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={() => handleReject(item.item.Hostel.Id)}>
                    Reject
                  </Button>
                  <Button onPress={() => handleAccept(item.item.Hostel.Id)}>
                    Accept
                  </Button>
                </Card.Actions>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
};

export default VerifyHostels;
