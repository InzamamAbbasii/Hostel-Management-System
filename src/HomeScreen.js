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
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Rating} from 'react-native-rating-element';
import axios from 'axios';
import {api} from './CONSTANTS/api';
import {COLOR} from './CONSTANTS/Colors';
import CustomButton from './reuseable/CustomButton';
import CustomHeader from './reuseable/CustomHeader';
import Loading from './reuseable/Loading';
import MenuComponent from './reuseable/MenuComponent';

const HomeScreen = ({navigation, route}) => {
  const mapViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loadinng, setLoadinng] = useState(false);
  const [viewMode, setViewMode] = useState('Map'); //default list view
  const [coorsList, setCoorsList] = useState([]);

  const [user_id, setUser_id] = useState(0);

  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const onChangeSearch = query => setSearchQuery(query);

  useEffect(() => {
    // console.log(route);
    const getUser = async () => {
      let id = await AsyncStorage.getItem('user_id');
      setUser_id(id);
    };
    getUser();

    setLoadinng(true);
    getHostels();
  }, []);

  const getHostels = async () => {
    let id = await AsyncStorage.getItem('user_id');
    axios
      .get(api.get_Hostels, {
        params: {
          user_id: id === null ? 0 : id,
        },
      })
      .then(res => {
        setData(res.data);
        setDataCopy(res.data);
      })
      .catch(err => alert(err))
      .finally(() => {
        setLoadinng(false);
        setRefreshing(false);
        setSearchText('');
      });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch();
    }, 500);
    // if this effect run again, because `value` changed, we remove the previous timeout
    return () => clearTimeout(timeout);
  }, [searchText]);

  const handleSearch = () => {
    if (searchText && searchText.length > 0) {
      let txt = searchText.toLowerCase();
      const filter = dataCopy.filter(item => {
        return item.Hostel.HostelName.toLowerCase().match(txt);
      });
      setData(filter);
    } else {
      if (dataCopy.length > 0) setData(dataCopy);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      {user_id === null ? (
        <View>
          <CustomHeader text="Home" showBackButton={false} />
          <TouchableOpacity
            style={styles.btnLogin}
            onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.loginTxt}>Login</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CustomHeader text="Home" onBackPress={() => navigation.goBack()} />
      )}
      <MenuComponent navigation={navigation} route={route} />
      <Searchbar
        placeholder="Search"
        onChangeText={txt => setSearchText(txt)}
        value={searchText}
      />
      {/* <CustomButton
        title={'Click to See MapView'}
        style={{width: '100%', marginTop: 0, borderRadius: 0, marginBottom: 10}}
        onPress={() => navigation.replace('MapViewScreen')}
      /> */}
      {data.length === 0 && loadinng == false ? (
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
                  marginTop: 7,
                  borderRadius: 8,
                  width: '95%',
                  alignSelf: 'center',
                }}
                onPress={() =>
                  navigation.navigate('HostelDetail_User', {
                    Hostel: item.item.Hostel,
                    HostelImages: item.item.HostelImages,
                    Rooms: item.item.RoomsList,
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
      {loadinng && <Loading />}
    </View>
  );
};

export default HomeScreen;

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
  btnLogin: {
    backgroundColor: '#000',
    height: 30,
    width: 50,
    position: 'absolute',
    right: 40,
    top: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  loginTxt: {color: '#FFF', fontSize: 14, fontWeight: '600'},
});
