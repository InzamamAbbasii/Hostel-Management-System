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

import {api} from './CONSTANTS/api';
import axios from 'axios';
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
  useEffect(() => {
    if (route.params) {
      setRoomsList(route.params.Rooms);
    }
  }, []);
  const handleIncrement = () => {
    setRoomCount(roomCount + 1);
  };
  const handleDecrement = () => {
    if (roomCount > 1) setRoomCount(roomCount - 1);
  };

  const handleSubmit = () => {
    if (roomType === '') {
      alert('Please Select Room Type');
    } else if (roomCount === 0) {
      alert('Please enter number of rooms');
    } else {
      const params = {
        User_Id: global.user_id,
        H_Id: route.params.Rooms[0].H_Id,
        BookingDate: bookingDate,
        CheckoutDate: checkOutDate,
        RoomType: roomType,
        NoOfRooms: roomCount,
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
  return (
    <ImageBackground
      source={bg}
      style={{...StyleSheet.absoluteFillObject, paddingHorizontal: 16}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: SCREEN_WIDTH * 0.15,
            marginBottom: 30,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: fonts.medium,
              color: COLOR.txtColor,
            }}>
            Book Room
          </Text>
        </View>
        <View style={{flex: 1}}>
          <View style={{...styles.rowView}}>
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
                onPress={() => setShowBookingDatePicker(!showBookingDatePicker)}
              />
            </View>
          </View>
          <View style={{...styles.rowView}}>
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
          </View>
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

          <Text style={styles.facilitesHeading}>Room Type</Text>
          <View style={styles.facilitesContainer}>
            <View style={styles.rowView}>
              {roomsList.map((item, key) => {
                return (
                  <View style={styles.rowView} key={key}>
                    <RadioButton
                      value={item.RoomType}
                      color={COLOR.secondary}
                      status={
                        roomType === item.RoomType ? 'checked' : 'unchecked'
                      }
                      onPress={() => setRoomType(item.RoomType)}
                    />
                    <Text style={styles.radioButtonText}>{item.RoomType}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={{...styles.rowView, marginVertical: 10}}>
            <Text
              style={{
                flex: 1,
                fontSize: 15,
                fontFamily: fonts.regular,
                color: '#303030',
                marginLeft: 3,
              }}>
              No. of Rooms
            </Text>
            <Icon
              name={'md-remove-circle-sharp'}
              color={'#000'}
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
              }}
              value={roomCount.toString()}
            />
            <Icon
              name={'add-circle-sharp'}
              color={'#000'}
              size={40}
              onPress={() => handleIncrement()}
            />
          </View>
        </View>
        <Text style={styles.facilitesHeading}>Detail :</Text>
        {roomsList.map((item, key) => {
          return (
            <Card key={key} style={{marginBottom: 5}}>
              <Card.Content>
                <Title>Type {item.RoomType}</Title>
                <Paragraph>Description : {item.Description}</Paragraph>
                <Paragraph>Price : PKR {item.Price}</Paragraph>
              </Card.Content>
            </Card>
          );
        })}
        <CustomButton
          title="Submit"
          onPress={() => handleSubmit()}
          style={{marginVertical: 30}}
        />
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
    flex: 1,
  },
  facilitesHeading: {
    marginTop: 10,
    marginLeft: 3,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: '#303030',
  },
  facilitesContainer: {
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderColor: '#E5E0EB',
    borderWidth: 1,
    borderRadius: 2,
    padding: 5,
    marginTop: 4,
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
});
