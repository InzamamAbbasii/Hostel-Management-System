import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  ImageBackground,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Searchbar,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RadioButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {bg} from './CONSTANTS/images';
import {COLOR} from './CONSTANTS/Colors';
import {fonts} from './CONSTANTS/fonts';
import Input from './reuseable/Input';
import CustomButton from './reuseable/CustomButton';
import CustomHeader from './reuseable/CustomHeader';

import {api} from './CONSTANTS/api';
import axios from 'axios';
import {style} from 'deprecated-react-native-prop-types/DeprecatedImagePropType';
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;

const BookRoom = ({navigation, route}) => {
  const [roomType, setRoomType] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [roomsList, setRoomsList] = useState([]);
  const [roomCount, setRoomCount] = useState(0);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [showBookingDatePicker, setShowBookingDatePicker] = useState(false);
  const [showCheckoutDatePicker, setShowCheckoutDatePicker] = useState(false);
  const [AvailableBeds, setAvailableBeds] = useState(0);
  useEffect(() => {
    if (route.params) {
      setRoomsList(route.params.Rooms);
    }
  }, []);

  const handleRadioButton = item => {
    const filter = roomsList
      ?.filter(f => f.RoomType == item.RoomType)
      .map(element => {
        let totalBeds = element.TotalBeds === null ? 0 : element.TotalBeds;
        let bookedBeds = element.BookedBeds === null ? 0 : element.BookedBeds;
        return {
          AvailableBeds: totalBeds - bookedBeds,
        };
      });
    setAvailableBeds(filter[0].AvailableBeds);
    setRoomType(item.RoomType);
    setRoomCount(0);
  };

  const handleIncrement = () => {
    if (AvailableBeds > roomCount) {
      setRoomCount(roomCount + 1);
    } else {
      alert('Sorry! No More Beds Avaiable.');
    }
  };
  const handleDecrement = () => {
    if (roomCount > 1) setRoomCount(roomCount - 1);
  };

  const handleSubmit = async () => {
    // const filter = route.params.Rooms.filter(item => item.RoomType == roomType);
    // console.log(filter[0].Id, filter[0].RoomType);
    // return;

    let user_id = await AsyncStorage.getItem('user_id');
    if (roomType === '') {
      alert('Please Select Room Type');
    } else if (roomCount === 0) {
      alert('Please enter number of rooms');
    } else {
      const filter = route.params.Rooms.filter(
        item => item.RoomType === roomType,
      );

      const params = {
        User_Id: user_id, //user id
        H_Id: route.params.Rooms[0].H_Id, // hostel id
        // R_Id: route.params.Rooms[0].Id, // room id
        R_Id: filter[0].Id, // room id
        BookingDate: bookingDate,
        // CheckoutDate: checkOutDate,
        RoomType: roomType,
        NoOfBeds: roomCount,
        Status: 'Pending',
      };
      axios
        .post(api.book_room, params)
        .then(response => {
          alert(
            'Your request is send to Hostel Owner Successfully.Please wait for approvel.Thanks😍',
          );
        })
        .catch(err => console.log(err));
    }
  };

  const getAvailableRooms = (totalRooms, bookedRooms) => {
    let tRooms = totalRooms === null ? 0 : totalRooms;
    let bRooms = bookedRooms === null ? 0 : bookedRooms;
    return tRooms - bRooms;
  };
  return (
    <ImageBackground source={bg} style={{...StyleSheet.absoluteFillObject}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flex: 1}}>
        <CustomHeader
          text={'Book Room'}
          onBackPress={() => navigation.goBack()}
        />
        <View style={{paddingHorizontal: 16, flex: 1}}>
          <View style={{}}>
            <View
              style={{
                ...styles.rowView,
              }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 15,
                  fontFamily: fonts.regular,
                  color: '#303030',
                  marginLeft: 3,
                }}>
                Booking Date
              </Text>
              <View style={styles.dateView}>
                <Paragraph>{bookingDate.toLocaleDateString()}</Paragraph>

                <Icon
                  name={'calendar'}
                  color={COLOR.secondary}
                  size={25}
                  onPress={() =>
                    setShowBookingDatePicker(!showBookingDatePicker)
                  }
                />
              </View>
            </View>
            {/* <View style={{...styles.rowView}}>
            <Text
              style={{
                flex: 1,
                fontSize: 15,
                fontFamily: fonts.regular,
                color: '#303030',
                marginLeft: 3,
              }}>
              Check Out Date
            </Text>
            <View style={styles.dateView}>
              <Paragraph>{checkOutDate.toLocaleDateString()}</Paragraph>
              <Icon
                name={'calendar'}
                color={COLOR.secondary}
                size={25}
                onPress={() =>
                  setShowCheckoutDatePicker(!showCheckoutDatePicker)
                }
              />
            </View>
          </View> */}
            {showBookingDatePicker === true && (
              <DateTimePicker
                testID="booking"
                value={bookingDate}
                mode={'date'}
                onChange={date => {
                  setShowBookingDatePicker(false);
                  setShowCheckoutDatePicker(false);
                  let d = new Date(date.nativeEvent.timestamp);
                  setBookingDate(d);
                }}
              />
            )}
            {showCheckoutDatePicker === true && (
              <DateTimePicker
                testID="checkout"
                value={checkOutDate}
                mode={'date'}
                onChange={date => {
                  setShowBookingDatePicker(false);
                  setShowCheckoutDatePicker(false);
                  let d = new Date(date.nativeEvent.timestamp);
                  setCheckOutDate(d);
                }}
              />
            )}

            <Text style={styles.facilitesHeading}>Select Room Type</Text>
            <View style={styles.facilitesContainer}>
              {roomsList.map((item, key) => {
                return (
                  <View
                    key={key}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      // width: '50%',
                    }}>
                    <RadioButton
                      value={item.RoomType}
                      color={COLOR.secondary}
                      status={
                        roomType === item.RoomType ? 'checked' : 'unchecked'
                      }
                      onPress={() => handleRadioButton(item)}
                    />
                    <Text style={styles.radioButtonText}>{item.RoomType}</Text>
                  </View>
                );
              })}
            </View>
            {roomType.length !== 0 &&
              (AvailableBeds < 1 ? (
                <Text style={{...styles.radioButtonText, color: 'red'}}>
                  {AvailableBeds} beds available
                </Text>
              ) : (
                <Text style={{...styles.radioButtonText, color: 'green'}}>
                  {AvailableBeds} beds available
                </Text>
              ))}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 15,
                  fontFamily: fonts.regular,
                  color: '#303030',
                  marginLeft: 3,
                }}>
                No. of Beds
              </Text>
              <Icon
                name={'md-remove-circle-sharp'}
                color={COLOR.secondary}
                size={40}
                onPress={() => handleDecrement()}
              />

              <TextInput
                style={{
                  width: 50,
                  borderColor: '#E5E0EB',
                  borderBottomWidth: 2,
                  padding: 0,
                  marginHorizontal: 15,
                  textAlign: 'center',
                  fontSize: 16,
                  color: '#000',
                }}
                value={roomCount.toString()}
              />
              <Icon
                name={'add-circle-sharp'}
                color={COLOR.secondary}
                size={40}
                onPress={() => handleIncrement()}
              />
            </View>
          </View>
          <View>
            <Text style={styles.facilitesHeading}>Room Types :</Text>
            <FlatList
              data={roomsList}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={item => {
                return (
                  <View style={styles.card}>
                    <Text style={styles.card_Title}>{item.item.RoomType}</Text>
                    <Text style={styles.card_Text}>
                      Price : PKR {item.item.Price}
                    </Text>
                    <Text style={styles.card_Text}>
                      Total Rooms : {item.item.TotalRooms}
                    </Text>
                    <Text style={styles.card_Text}>
                      Total Bed : {item.item.TotalBeds}
                    </Text>
                    {item.item.BookedBeds == null ? (
                      <Text style={styles.card_Text}>Booked Bed : 0</Text>
                    ) : (
                      <Text style={styles.card_Text}>
                        Booked Bed : {item.item.BookedBeds}
                      </Text>
                    )}
                    {getAvailableRooms(
                      item.item.TotalBeds,
                      item.item.BookedBeds,
                    ) < 1 ? (
                      <Text style={{...styles.card_Text, color: 'red'}}>
                        Avaiable Bed :{' '}
                        {getAvailableRooms(
                          item.item.TotalBeds,
                          item.item.BookedBeds,
                        )}
                      </Text>
                    ) : (
                      <Text style={{...styles.card_Text, color: 'green'}}>
                        Avaiable Bed :{' '}
                        {getAvailableRooms(
                          item.item.TotalBeds,
                          item.item.BookedBeds,
                        )}
                      </Text>
                    )}

                    <Text style={styles.card_Text}>
                      Facilites : {item.item.Facilites}
                    </Text>
                    <Text style={styles.card_Text}>
                      Description : {item.item.Description}
                    </Text>
                  </View>
                );
              }}
            />
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <CustomButton
              title="Submit"
              onPress={() => handleSubmit()}
              style={{marginVertical: 30}}
            />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default BookRoom;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    // flex: 1,
  },
  facilitesHeading: {
    marginTop: 10,
    marginLeft: 3,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: '#303030',
  },
  facilitesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderColor: '#E5E0EB',
    borderWidth: 1,
    borderRadius: 2,
    padding: 5,
    paddingHorizontal: 10,
    marginTop: 4,
    justifyContent: 'space-between',
  },
  radioButtonText: {
    fontSize: 16,
    color: '#000',
    fontFamily: fonts.regular,
  },
  dateView: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E0EB',
    borderRadius: 7,
    marginTop: 8,
    backgroundColor: COLOR.white,
    justifyContent: 'space-between',
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  card: {
    marginVertical: 10,
    elevation: 2,
    marginRight: 15,
    // backgroundColor: 'skyblue',
    backgroundColor: COLOR.primary,
    padding: 20,
    borderRadius: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  card_Title: {
    color: COLOR.halfWhite,
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 35,
  },
  card_Text: {
    color: COLOR.halfWhite,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
  },
});
