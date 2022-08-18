import React, {useState, useEffect, useRef} from 'react';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Searchbar,
} from 'react-native-paper';
import {hostel_1, bg} from '../CONSTANTS/images';
import {
  View,
  ScrollView,
  FlatList,
  Text,
  RefreshControl,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {Rating} from 'react-native-rating-element';
import axios from 'axios';
import {api} from '../CONSTANTS/api';
import {COLOR} from '../CONSTANTS/Colors';
import CustomButton from '../reuseable/CustomButton';
import CustomHeader from '../reuseable/CustomHeader';

const MyHostels = ({navigation}) => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getHostels();
  }, []);
  const getHostels = () => {
    axios
      .get(api.get_booked_hostels, {
        params: {
          user_id: 2,
        },
      })
      .then(res => {
        setData(res.data);
      })
      .catch(err => alert(err))
      .finally(() => setRefreshing(false));
  };
  return (
    <ImageBackground
      source={bg}
      style={{...StyleSheet.absoluteFillObject, paddingHorizontal: 16}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CustomHeader text={'My Hostel'} navi={navigation} />
        {data.length === 0 ? (
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Text style={{fontSize: 16, fontWeight: '500'}}>
              No Record Found
            </Text>
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            keyExtractor={(item, index) => index.toString()}
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
                      Hostel: item.item.HostelInfo,
                      Rooms: item.item.RoomInfo,
                      Id: item.item.Id,
                      Status: item.item.Status,
                    })
                  }>
                  {item.item.HostelInfo.Image === null ? (
                    <Card.Cover
                      source={{
                        uri: `${api.image}${'noimage.png'}`,
                      }}
                    />
                  ) : (
                    <Card.Cover
                      source={{
                        uri: `${api.image}${item.item.HostelInfo.Image}`,
                      }}
                    />
                  )}
                  {item.item.Status == 'Approved' ? (
                    <View
                      style={{
                        ...styles.genderView,
                        backgroundColor: 'green',
                      }}>
                      <Text style={styles.genderText}>{item.item.Status}</Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        ...styles.genderView,
                        backgroundColor: 'red',
                      }}>
                      <Text style={styles.genderText}>{item.item.Status}</Text>
                    </View>
                  )}
                  <Card.Content>
                    <Title>{item.item.HostelInfo.HostelName}</Title>
                    <Paragraph>{item.item.HostelInfo.Address}</Paragraph>
                  </Card.Content>
                </Card>
              );
            }}
          />
        )}
      </ScrollView>
    </ImageBackground>
  );
};

export default MyHostels;

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
    zIndex: 1,
  },
  genderText: {fontSize: 14, fontWeight: '700', color: '#FFF'},
});
