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
  TextInput,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
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
  const flatlistRef = useRef(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loadinng, setLoadinng] = useState(false);
  const [viewMode, setViewMode] = useState('Map'); //default list view
  const [coorsList, setCoorsList] = useState([]);

  const [user_id, setUser_id] = useState(0);

  const [showFilterView, setShowFilterView] = useState(false);
  const [startPrice, setStartPrice] = useState(0);
  const [endPrice, setEndPrice] = useState(0);
  const [shortedValue, setShortedValue] = useState('hostel name');

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
    let user = await AsyncStorage.getItem('user');
    if (user !== null) user = JSON.parse(user);
    axios
      .get(api.get_Hostels, {
        params: {
          user_id: id === null ? 0 : id,
        },
      })
      .then(res => {
        //--> to show all record---------------------
        // setData(res.data);
        // setDataCopy(res.data);

        // --> to show record according to loggedin user gender i.e male or female
        if (user !== null && user.AccountType === 'User') {
          //filter hostel by loggednin user Gender
          let filter = res.data?.filter(
            item =>
              item?.Hostel?.Gender?.toLowerCase() ==
              user?.Gender?.toLowerCase(),
          );
          // console.log(filter);
          setData(filter);
          setDataCopy(filter);
        } else {
          //storing all hostels
          setData(res.data);
          setDataCopy(res.data);
        }
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
  const handleFilter = () => {
    if (startPrice !== 0 && endPrice !== 0) {
      const filterData = dataCopy.filter(
        item =>
          item.Hostel.MinPrice >= startPrice && // 12500>=500  true
          item.Hostel.MinPrice <= endPrice, // 12500<=15000 true // 16500>=500  true
        // item.Hostel.MaxPrice <= endPrice, // 16500<=15000  true
      );
      setData(filterData);
    } else {
      alert('Please enter price range to filter record.');
    }
  };

  const handleSorting = value => {
    setShortedValue(value);
    if (data?.length > 0 && value == 'hostel name') {
      // Sort the numbers in ascending order:
      let sorted = data.sort(function (a, b) {
        return ('' + a.Hostel.HostelName).localeCompare(b.Hostel.HostelName);
      });
      setData(sorted);
      flatlistRef?.current?.scrollToOffset({animated: false, offset: 0}); //scroll flatlist to starting index
    } else if (data?.length > 0 && value == 'lowest price') {
      // Sort the numbers in ascending order:
      let sorted = data.sort(function (a, b) {
        return a.Hostel.MinPrice - b.Hostel.MinPrice;
      });
      setData(sorted);
      flatlistRef?.current?.scrollToOffset({animated: false, offset: 0}); //scroll flatlist to starting index
    } else if (data?.length > 0 && value == 'highest price') {
      // Sort the numbers in descending order:
      let sorted = data.sort(function (a, b) {
        return b.Hostel.MinPrice - a.Hostel.MinPrice;
      });
      setData(sorted);
      flatlistRef?.current?.scrollToOffset({animated: false, offset: 0}); //scroll flatlist to starting index
    } else if (data?.length > 0 && value == 'best rated') {
      // Sort the numbers in descending order based on hostel rating
      let sorted = data.sort(function (a, b) {
        return b.Rating.AverageRating - a.Rating.AverageRating;
      });
      setData(sorted);
      flatlistRef?.current?.scrollToOffset({animated: false, offset: 0}); //scroll flatlist to starting index
    }
  };

  const handleClearFilter = () => {
    // setShortedValue('hostel name');
    setStartPrice(0);
    setEndPrice(0);
    setData(dataCopy);
    setShowFilterView(false);
  };
  // const FilterComponent = () => {

  //   return (
  //     <View
  //       style={{
  //         borderWidth: 1,
  //         borderColor: COLOR.secondary,
  //         padding: 10,
  //       }}>
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //         }}>
  //         <Text style={{color: '#000', fontSize: 14}}>Price Range :</Text>
  //         <TextInput
  //           placeholder="Starting Price"
  //           style={styles.priceInput}
  //           keyboardType={'decimal-pad'}
  //           value={startPrice}
  //           onChangeText={txt => setStartPrice(txt)}
  //         />
  //         <Text style={{color: '#000'}}> to </Text>
  //         <TextInput
  //           placeholder="Ending price"
  //           style={styles.priceInput}
  //           keyboardType={'decimal-pad'}
  //           value={endPrice}
  //           onChangeText={txt => setEndPrice(txt)}
  //         />
  //       </View>

  //       <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
  //         <TouchableOpacity
  //           style={{...styles.filterButtons, backgroundColor: '#FFF'}}
  //           onPress={() => handleClearFilter()}>
  //           <Text style={{...styles.loginTxt, color: COLOR.secondary}}>
  //             Clear Filter
  //           </Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={styles.filterButtons}
  //           onPress={() => handleFilter()}>
  //           <Text style={styles.loginTxt}>Filter</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // };

  const SortingComponent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          justifyContent: 'space-between',
        }}>
        <Text style={{color: '#000', fontSize: 14}}>Sorted By :</Text>
        <View style={styles.pickerView}>
          <Picker
            style={{flex: 1}}
            selectedValue={shortedValue}
            onValueChange={(itemValue, itemIndex) => handleSorting(itemValue)}>
            <Picker.Item label="Hostel Name" value="hostel name" />
            <Picker.Item label="Lowest Price" value="lowest price" />
            <Picker.Item label="Highest Price" value="highest price" />
            <Picker.Item label="Best Rated" value="best rated" />
          </Picker>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      {user_id === null ? (
        <View>
          <CustomHeader
            text="Home"
            navigation={navigation}
            showBackButton={false}
          />
          <TouchableOpacity
            style={styles.btnLogin}
            onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.loginTxt}>Login</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CustomHeader
          text="Home"
          navigation={navigation}
          onBackPress={() => navigation.goBack()}
        />
      )}
      <MenuComponent navigation={navigation} route={route} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Searchbar
          style={{flex: 1}}
          placeholder="Search Hostel"
          onChangeText={txt => setSearchText(txt)}
          value={searchText}
        />
        {showFilterView ? (
          <MaterialCommunityIcons
            onPress={() => setShowFilterView(!showFilterView)}
            name="filter"
            color={COLOR.secondary}
            size={55}
          />
        ) : (
          <MaterialCommunityIcons
            onPress={() => setShowFilterView(!showFilterView)}
            name="filter-outline"
            color={COLOR.secondary}
            size={55}
          />
        )}
      </View>
      <SortingComponent />
      {showFilterView && (
        <View
          style={{
            borderWidth: 1,
            borderColor: COLOR.secondary,
            padding: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{color: '#000', fontSize: 14}}>Price Range :</Text>
            <TextInput
              placeholder="Starting Price"
              style={styles.priceInput}
              keyboardType={'decimal-pad'}
              value={startPrice}
              onChangeText={txt => setStartPrice(txt)}
            />
            <Text style={{color: '#000'}}> to </Text>
            <TextInput
              placeholder="Ending price"
              style={styles.priceInput}
              keyboardType={'decimal-pad'}
              value={endPrice}
              onChangeText={txt => setEndPrice(txt)}
            />
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity
              style={{...styles.filterButtons, backgroundColor: '#FFF'}}
              onPress={() => handleClearFilter()}>
              <Text style={{...styles.loginTxt, color: COLOR.secondary}}>
                Clear Filter
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterButtons}
              onPress={() => handleFilter()}>
              <Text style={styles.loginTxt}>Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
          ref={flatlistRef}
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
                    style={{height: 150}}
                    source={{
                      uri: `${api.image}${'noimage.png'}`,
                    }}
                  />
                ) : (
                  <Card.Cover
                    style={{height: 150}}
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
                    {/* {item.item.Hostel.MaxPrice > item.item.Hostel.MinPrice ? (
                      <Title>
                        {' '}
                        PKR {item.item.Hostel.MinPrice} to{' '}
                        {item.item.Hostel.MaxPrice}{' '}
                      </Title>
                    ) : (
                      <Title> PKR {item.item.Hostel.MinPrice} </Title>
                      )} */}
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
  priceInput: {
    borderWidth: 1,
    borderColor: COLOR.secondary,
    borderRadius: 5,
    padding: 0,
    paddingLeft: 10,
    height: 30,
    width: 100,
    marginHorizontal: 10,
  },
  filterButtons: {
    height: 40,
    width: 90,
    borderRadius: 20 / 2,
    backgroundColor: COLOR.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: COLOR.secondary,
  },
  pickerView: {
    height: 50,
    // width: 180,
    flex: 1,
    marginLeft: 25,
    borderWidth: 1,
    borderColor: COLOR.secondary,
    borderRadius: 10,
  },
});
