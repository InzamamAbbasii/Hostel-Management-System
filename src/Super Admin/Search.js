import React, {useState, useEffect, useRef} from 'react';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Searchbar,
  TextInput,
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
import {RadioButton} from 'react-native-paper';
import {Rating} from 'react-native-rating-element';
import axios from 'axios';
import {api} from '../CONSTANTS/api';
import {COLOR} from '../CONSTANTS/Colors';
import {fonts} from '../CONSTANTS/fonts';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '../reuseable/CustomButton';
import Loading from '../reuseable/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Search = ({navigation}) => {
  const mapViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userDataCopy, setUserDataCopy] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const [selectedFilter, setselectedFilter] = useState('');
  const [filterList, setFilterList] = useState([
    {
      Id: 0,
      Type: 'Hostel',
      Status: 'checked',
    },
    {
      Id: 1,
      Type: 'User',
      Status: 'unchecked',
    },
  ]);
  useEffect(() => {
    setLoading(true);
    getHostels();
    getUsers();
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
        setDataCopy(res.data);
        setData(res.data);
      })
      .catch(err => alert(err))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };
  const getUsers = () => {
    axios
      .get(api.get_All_Hostelers)
      .then(res => {
        setUserDataCopy(res.data);
        setUserData(res.data);
      })
      .catch(err => alert(err))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };
  const handleOnRadioButtonChange = id => {
    const newData = filterList.map(item => {
      if (item.Id === id) {
        setselectedFilter(item.Type);
        return {
          ...item,
          Status: 'checked',
        };
      } else {
        return {...item, Status: 'unchecked'};
      }
    });
    setFilterList(newData);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch();
    }, 500);
    // if this effect run again, because `value` changed, we remove the previous timeout
    return () => clearTimeout(timeout);
  }, [searchText]);

  const handleSearch = () => {
    if (selectedFilter === 'User') {
      if (searchText && searchText.length > 0) {
        let txt = searchText.toLowerCase();
        const filter = userDataCopy.filter(item => {
          console.log('search for', searchText);
          console.log(item.HostelInfo[0].HostelName);
          return (
            item.Name.toLowerCase().match(txt) || //check username
            item.Reg_No.toLowerCase().match(txt) || //check regno
            item.HostelInfo[0].HostelName.toLowerCase().match(txt) //check hostelname
          );
        });
        setUserData(filter);
      } else {
        if (userDataCopy.length > 0) setUserData(userDataCopy);
      }
    } else {
      //hostel case

      if (searchText && searchText.length > 0) {
        console.log('if');
        let txt = searchText.toLowerCase();
        const filter = dataCopy.filter(item => {
          return item.Hostel.HostelName.toLowerCase().match(txt);
        });
        setData(filter);
      } else {
        console.log('else');
        if (dataCopy.length > 0) setData(dataCopy);
      }
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      {/* <View
        style={{
          width: '100%',
          height: 45,
          backgroundColor: '#FFF',
          justifyContent: 'center',
          padding: 10,
          flexDirection: 'row',
          elevation: 2,
        }}>
        <Icon
          name="search"
          size={20}
          color={'#CCC'}
          style={{marginRight: 15}}
        />
        <TextInput
          style={{flex: 1, backgroundColor: '#FFF', borderWidth: 0, height: 30}}
          value={searchText}
          placeholder="Search"
          onChangeText={txt => setSearchText(txt)}
        />
      </View> */}
      <Searchbar
        placeholder="Search"
        onChangeText={txt => setSearchText(txt)}
        // value={txt => setSearchText(txt)}
      />

      <View style={styles.roomTypesContainer}>
        {filterList &&
          filterList.map((item, key) => {
            return (
              <View
                key={key}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '50%',
                }}>
                <RadioButton
                  value={item.Type}
                  color={COLOR.secondary}
                  status={item.Status}
                  onPress={() => handleOnRadioButtonChange(item.Id)}
                />
                {/* <Text style={styles.radioButtonText}>A</Text> */}
                <Text style={styles.radioButtonText}>{item.Type}</Text>
              </View>
            );
          })}
      </View>
      {selectedFilter == 'User' ? (
        <View style={{flex: 1}}>
          {userData.length === 0 ? (
            <View
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Text style={{fontSize: 16, fontWeight: '500'}}>
                No Record Found
              </Text>
            </View>
          ) : (
            <FlatList
              style={{flex: 1}}
              showsVerticalScrollIndicator={false}
              data={userData}
              keyExtractor={(item, index) => index.toString()}
              refreshControl={
                <RefreshControl
                  colors={[COLOR.secondary, COLOR.primary]}
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true), getUsers();
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
                      navigation.navigate('UserHostels', {
                        UserID: item.item.UserID,
                      })
                    }
                    // onPress={() =>
                    //   navigation.navigate('HostelDetail_Admin', {
                    //     Hostel: item.item.HostelInfo[0],
                    //     HostelImages: item.item.HostelImages,
                    //     Rooms: item.item.RoomsList,
                    //     // Users: [],
                    //     UserRooms: item.item.Rooms,
                    //   })
                    // }
                  >
                    <Card.Content>
                      <Title>User Name : {item.item.Name}</Title>
                      <Paragraph>
                        Hostel Name : {item.item.HostelInfo[0].HostelName}
                      </Paragraph>
                      <Paragraph>Email : {item.item.Email}</Paragraph>
                      <Paragraph>Reg_NO : {item.item.Reg_No}</Paragraph>
                    </Card.Content>
                  </Card>
                );
              }}
            />
          )}
        </View>
      ) : (
        <View>
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
                      navigation.navigate('HostelDetail_Admin', {
                        Hostel: item.item.Hostel,
                        HostelImages: item.item.HostelImages,
                        Rooms: item.item.RoomsList,
                        Users: item.item.Users,
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
        </View>
      )}
      {loading && <Loading />}
    </View>
  );
};

export default Search;

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
  facilitesHeading: {
    marginTop: 10,
    marginLeft: 3,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: '#303030',
  },
  roomTypesContainer: {
    height: 50,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderColor: '#E5E0EB',
    borderWidth: 1,
    borderRadius: 2,
    padding: 5,
  },
  radioButtonText: {
    fontSize: 16,
    color: '#000',
    fontFamily: fonts.regular,
  },
});
