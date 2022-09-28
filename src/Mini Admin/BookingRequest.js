import React, {useState, useEffect} from 'react';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Searchbar,
} from 'react-native-paper';
import {View, ScrollView, Text, FlatList, TouchableOpacity} from 'react-native';
import axios from 'axios';
import {api} from '../CONSTANTS/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookingRequest = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getBookingRequest();
  }, []);

  const getBookingRequest = async () => {
    let id = await AsyncStorage.getItem('user_id');
    console.log({id});
    axios
      .get(api.get_Booking_Request, {params: {user_id: id}})
      .then(response => {
        setData(response.data);
      })
      .catch(err => alert(err));
  };

  const approveBooking = id => {
    axios
      .get(api.approve_Booking, {params: {id: id}})
      .then(res => {
        alert(res.data.message);
        //remove this record from list
        // const newData = data.filter(item => item.Id !== id);
        // setData(newData);
        getBookingRequest();
      })
      .catch(err => alert(err));
  };

  const rejectBooking = id => {
    axios
      .get(api.reject_Booking, {params: {id: id}})
      .then(res => {
        alert(res.data.message);
        //remove this record from list
        // const newData = data.filter(item => item.Id !== id);
        // setData(newData);
        getBookingRequest();
      })
      .catch(err => alert(err));
  };

  const getAvailableRooms = (totalRooms, bookedRooms) => {
    console.log(totalRooms, bookedRooms);

    return totalRooms - bookedRooms;
  };
  const checkRoomAvailability = (totalbeds, bookedBeds, noofbeds_tobook) => {
    let tBeds = totalbeds === null ? 0 : totalbeds;
    let bBeds = bookedBeds === null ? 0 : bookedBeds;
    let availableBeds = tBeds - bBeds;
    if (availableBeds >= noofbeds_tobook) {
      return true;
    } else {
      return false;
    }
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
          keyExtractor={(item, index) => item.Id}
          renderItem={item => {
            return (
              <Card style={{marginBottom: 7}}>
                <Card.Content>
                  <Title>Name : {item.item.Name}</Title>
                  <Paragraph>Email : {item.item.Email}</Paragraph>
                  <Paragraph>CNIC : {item.item.CNIC}</Paragraph>
                  <Paragraph>Phone No : {item.item.PhoneNo}</Paragraph>
                  <Paragraph>Occupation : {item.item.Occupation}</Paragraph>
                  <Paragraph>
                    Booking Date :{' '}
                    {new Date(item.item.BookingDate).toLocaleDateString()}
                  </Paragraph>
                  {/* <Paragraph>
                    Checkout Date : {item.item.CheckoutDate}
                  </Paragraph> */}
                  <Paragraph>Room Type : {item.item.RoomType}</Paragraph>
                  <Paragraph>No of Bed : {item.item.NoOfBeds}</Paragraph>
                </Card.Content>
                <Card.Content>
                  <Paragraph>
                    Hostel Name : {item.item.HostelInfo.HostelName}
                  </Paragraph>
                  <Paragraph>Total Rooms : {item.item.TotalRooms}</Paragraph>
                  <Paragraph>Totla Beds : {item.item.TotalBeds}</Paragraph>
                  <Paragraph>
                    TotalBookedBeds: {item.item.TotalBookedBeds}
                  </Paragraph>
                  <Paragraph>
                    Avaiable Beds :{' '}
                    {getAvailableRooms(
                      item.item.TotalBeds,
                      item.item.TotalBookedBeds,
                    )}
                  </Paragraph>

                  {checkRoomAvailability(
                    item.item.TotalBeds,
                    item.item.TotalBookedBeds,
                    item.item.NoOfBeds,
                  ) == false && (
                    <Paragraph style={{color: 'red'}}>
                      Beds are not available accroding to user request.You can
                      reject this request or either Accept it when someone leave
                      and the rooms are available.
                    </Paragraph>
                  )}
                </Card.Content>
                <Card.Actions>
                  <Button onPress={() => rejectBooking(item.item.Id)}>
                    Reject
                  </Button>
                  {checkRoomAvailability(
                    item.item.TotalBeds,
                    item.item.TotalBookedBeds,
                    item.item.NoOfBeds,
                  ) && (
                    <Button onPress={() => approveBooking(item.item.Id)}>
                      Accept
                    </Button>
                  )}
                </Card.Actions>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
};

export default BookingRequest;
