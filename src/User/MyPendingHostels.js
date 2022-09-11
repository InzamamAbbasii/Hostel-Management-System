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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
const MyPendingHostels = ({navigation}) => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  let isFocus = useIsFocused();
  useEffect(() => {
    setLoading(true);
    getHostels();
  }, [isFocus]);

  const getHostels = async () => {
    let id = await AsyncStorage.getItem('user_id');
    axios
      .get(api.get_User_Pending_Hostels, {
        params: {
          user_id: id,
        },
      })
      .then(res => {
        setData(res.data);
      })
      .catch(err => alert(err))
      .finally(() => setRefreshing(false));
  };

  return (
    <ImageBackground source={bg} style={{...StyleSheet.absoluteFillObject}}>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <CustomHeader
          text={'Pending Hostels'}
          onBackPress={() => navigation.goBack()}
        />
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
                    marginTop: 7,
                    borderRadius: 8,
                    width: '95%',
                    alignSelf: 'center',
                    elevation: 2,
                    // borderWidth: 1,
                    // borderColor: COLOR.secondary,
                  }}
                  onPress={() =>
                    navigation.navigate('HostelDetail_User', {
                      Hostel: item.item.HostelInfo,
                      Rooms: item.item.RoomInfo,
                      Id: item.item.Id,
                      Status: item.item.Status,
                      HostelImages: item.item.HostelImages,
                      isFavorite: item.item.isFavorite,
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
                  {/* {item.item.Status == 'Approved' ? (
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
                  )} */}
                  <Card.Content>
                    <Title>{item.item.HostelInfo.HostelName}</Title>
                    <Paragraph>{item.item.HostelInfo.Address}</Paragraph>
                  </Card.Content>
                </Card>
              );
            }}
          />
        )}
      </View>
    </ImageBackground>
  );
};

export default MyPendingHostels;

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
