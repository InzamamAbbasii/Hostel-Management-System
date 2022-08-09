import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Searchbar,
} from 'react-native-paper';
import MapView, {Marker} from 'react-native-maps';
import {fonts} from './CONSTANTS/fonts';
import {api} from './CONSTANTS/api';
import {COLOR} from './CONSTANTS/Colors';
import CustomButton from './reuseable/CustomButton';
import axios from 'axios';

const HostelDetail = ({navigation, route}) => {
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];
  useEffect(() => {
    console.log('prev screen', prevRoute.name, global.user[0].AccountType);
    console.log(route.params.Hostel);
  }, []);

  const handleAccept = id => {
    axios
      .get(api.approve_Hostel, {
        params: {id: id},
      })
      .then(res => {
        alert(res.data.message);
        navigation.goBack();
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
        navigation.goBack();
      })
      .catch(err => alert(err));
  };
  const ItemDevider = () => {
    return (
      <View
        style={{
          borderColor: '#000',
          borderWidth: 0.25,
          marginHorizontal: 12,
          marginVertical: 5,
        }}></View>
    );
  };
  return (
    <View style={styles.container}>
      {route.params && (
        <ScrollView>
          {route.params.Hostel.Image === null ? (
            <Text style={styles.notFoundText}>No Image Added</Text>
          ) : (
            <Image
              source={{
                uri: `${api.image}${route.params.Hostel.Image}`,
              }}
              style={styles.image}
            />
          )}

          <Card style={{marginBottom: 7}}>
            <Card.Content>
              <Title>Name : {route.params.Hostel.HostelName}</Title>
              <Paragraph>
                City{'         '} : {route.params.Hostel.City}
              </Paragraph>
              <Paragraph>
                Contact {'  '}: {route.params.Hostel.PhoneNo}
              </Paragraph>
              <Paragraph>
                Address{'  '} : {route.params.Hostel.Address}
              </Paragraph>
            </Card.Content>
          </Card>

          <ItemDevider />
          <Text style={{...styles.text, fontWeight: 'bold', fontSize: 18}}>
            Rooms :{' '}
          </Text>
          {route.params.Rooms.length === 0 ? (
            <View>
              <Text style={styles.notFoundText}>No Room Added</Text>
              {global.user[0].AccountType === 'Hostel Manager' && (
                <CustomButton
                  title="Add Room"
                  onPress={() =>
                    navigation.replace('AddRooms', {Id: route.params.Hostel.Id})
                  }
                  style={{marginBottom: 10}}
                />
              )}
            </View>
          ) : (
            route.params.Rooms.map((item, key) => {
              return (
                <Card style={{marginBottom: 7}} key={key}>
                  <Card.Content>
                    <Title>Room Type : {item.RoomType}</Title>
                    <Paragraph>Description : {item.Description}</Paragraph>
                    <Paragraph>Price : {item.Price}</Paragraph>
                  </Card.Content>
                </Card>
              );
            })
          )}
          <ItemDevider />
          <Text style={{...styles.text, fontWeight: 'bold', fontSize: 18}}>
            Location :
          </Text>
          <View
            style={{
              backgroundColor: 'red',
              height: 300,

              backgroundColor: 'pink',
              marginVertical: 10,
              marginHorizontal: 10,
              borderRadius: 15,
              overflow: 'hidden',
            }}>
            <MapView
              style={{
                flex: 1,
              }}
              initialRegion={{
                latitude:
                  route.params?.Hostel.Latitude === null ||
                  route.params?.Hostel.Latitude === ''
                    ? 30.005495277822757
                    : route.params?.Hostel.Latitude,
                longitude:
                  route.params?.Hostel.Longitude === null ||
                  route.params?.Hostel.Longitude === ''
                    ? 69.41553150890356
                    : route.params?.Hostel.Longitude,

                // latitudeDelta: 2.819748261678967,
                // longitudeDelta: 3.680000826716423,
                latitudeDelta: 0.078,
                longitudeDelta: 0.23,
              }}
              onRegionChangeComplete={region => console.log(region)}
              scrollEnabled={true}
              zoomEnabled={false}
              zoomControlEnabled={true}
              showsUserLocation={false}
              showsMyLocationButton={false}>
              <Marker
                coordinate={{
                  latitude:
                    route.params?.Hostel.Latitude === null ||
                    route.params?.Hostel.Latitude === ''
                      ? 30.005495277822757
                      : route.params?.Hostel.Latitude,
                  longitude:
                    route.params?.Hostel.Longitude === null ||
                    route.params?.Hostel.Longitude === ''
                      ? 69.41553150890356
                      : route.params?.Hostel.Longitude,
                }}></Marker>
            </MapView>
          </View>

          {/* Showing Accept and Reject Button to Admin to Check and Verify Hostel */}
          {global.user.length > 0 &&
            global.user[0].AccountType === 'Admin' &&
            prevRoute.name === 'VerifyHostels' && (
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <CustomButton
                  title="Reject"
                  onPress={() => handleReject(route.params.Hostel.Id)}
                  style={{flex: 1, margin: 7}}
                />
                <CustomButton
                  title="Accept"
                  onPress={() => handleAccept(route.params.Hostel.Id)}
                  style={{flex: 1, margin: 7, backgroundColor: 'green'}}
                />
              </View>
            )}
          {/* Showing Book Room Button to User */}
          {global.user.length > 0 && global.user[0].AccountType === 'User' && (
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <CustomButton
                title="Feedback"
                onPress={() =>
                  navigation.navigate('Feedback', {
                    H_Id: route.params.Hostel.Id,
                  })
                }
                style={{flex: 1, margin: 7}}
              />
              <CustomButton
                title="Book Room"
                onPress={() =>
                  navigation.navigate('BookRoom', {Rooms: route.params.Rooms})
                }
                style={{flex: 1, margin: 7}}
              />
            </View>
          )}
        </ScrollView>
      )}
      {/* <Image source={route.params.image} style={styles.image} />
      <Text
        style={{
          fontSize: 18,
          marginLeft: 10,
          fontWeight: '500',
          color: '#000',
          marginVertical: 5,
        }}>
        Name : {route.params.name}
      </Text>
      <Text style={styles.text}>Price : {route.params.price}</Text>
      <Text style={styles.text}>Facilites : AC,Wifi,Study Room</Text>
      <Text style={styles.text}>City : Rawalpindi</Text>
      <Text style={styles.text}>Address : {route.params.address}</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('BookRoom')}>
        <Text style={styles.btnText}>Book Room</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Feedback')}>
        <Text style={styles.btnText}>Feedback</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default HostelDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
  },
  text: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
    marginVertical: 10,
  },
  notFoundText: {
    marginVertical: 10,
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color: COLOR.secondary,
  },
  btn: {
    backgroundColor: '#000',
    height: 50,
    width: '90%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    alignSelf: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
