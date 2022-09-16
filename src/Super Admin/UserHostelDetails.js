import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, {Marker} from 'react-native-maps';
import {SliderBox} from 'react-native-image-slider-box';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {api} from '../CONSTANTS/api';
import {COLOR} from '../CONSTANTS/Colors';
import CustomButton from '../reuseable/CustomButton';
import CustomHeader from '../reuseable/CustomHeader';
import axios from 'axios';

const UserHostelDetails = ({navigation, route}) => {
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];
  const [hostelImages, setHostelImages] = useState([]);
  const mapViewRef = useRef(null);
  const [userid, setUserid] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [coordinates, setCoordinates] = useState({
    latitude: 29.887874368635273,
    longitude: 69.44955177728671,
    latitudeDelta: 2.819748261678967,
    longitudeDelta: 3.680000826716423,
  });

  useEffect(() => {
    // getHostelLocation();

    const getUser = async () => {
      let id = await AsyncStorage.getItem('user_id');
      let user = await AsyncStorage.getItem('user');

      if (id !== null) setUserid(id);
      if (user !== null) {
        let parse = JSON.parse(user);
        setUserRole(parse.AccountType);
      }
    };
    getUser();
    setHostelImages([]);
    route.params?.HostelImages?.forEach(element => {
      let imagepath = `${api.image}${element}`;
      setHostelImages(prevstate => [...prevstate, imagepath]);
    });
    route.params?.isFavorite && setIsFavorite(route.params.isFavorite);
  }, []);

  const getHostelLocation = () => {
    // if (
    //   route.params?.Hostel.Latitude !== null ||
    //   route.params?.Hostel.Longitude
    // ) {
    let r = {
      latitude: route.params.Hostel.Latitude,
      longitude: route.params.Hostel.Longitude,
      // latitudeDelta: 2.819748261678967,
      // longitudeDelta: 3.680000826716423,
      latitudeDelta: 0.078,
      longitudeDelta: 0.23,
    };
    console.log(r);
    setCoordinates(r);
    // mapViewRef.current.animateToRegion(r, 2000);
    mapViewRef.current.animateCamera({
      center: {
        latitude: 33.64170455932617,
        longitude: 73.0739517211914,
      },
      heading: 0,
      pitch: 90,
    });

    // mapViewRef.current.animateToRegion({

    //   // latitudeDelta: 0.1,
    //   // longitudeDelta: 0.1,
    //   latitudeDelta: 2.819748261678967,
    //   longitudeDelta: 3.680000826716423,
    // });
    // setCoordinates({
    //   latitude: route.params.Hostel.Latitude,
    //   longitude: route.params.Hostel.Longitude,
    //   // latitudeDelta: 2.819748261678967,
    //   // longitudeDelta: 3.680000826716423,
    //   latitudeDelta: 0.1,
    //   longitudeDelta: 0.1,
    // });
    // }
  };

  const getAvailableRooms = (totalRooms, bookedRooms) => {
    let tRooms = totalRooms === null ? 0 : totalRooms;
    let bRooms = bookedRooms === null ? 0 : bookedRooms;
    return tRooms - bRooms;
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

  //user and MyHostels case
  const handleCheckout = requestid => {
    console.log({requestid});
    axios
      .get(api.checkout, {
        params: {
          requestId: requestid,
        },
      })
      .then(response => {
        console.log(response.data);
        if (response.data.success === true) {
          navigation.replace('Feedback', {
            H_Id: response.data.data.H_Id,
            AddFeedback: true,
          });
          alert(response.data.message);
        } else {
          alert(response.data.message);
        }
      })
      .catch(err => alert(err));
  };

  const handleFavorite = () => {
    console.log({userid}, route.params?.Hostel?.Id);
    if (isFavorite === true) removeFavorite();
    else addFavorite();
  };

  const addFavorite = () => {
    const params = {
      User_Id: userid,
      H_Id: route.params?.Hostel?.Id,
    };
    axios
      .post(api.add_Favorite, params)
      .then(response => {
        setIsFavorite(true);
      })
      .catch(err => {
        alert(err);
      });
  };

  const removeFavorite = () => {
    axios
      .get(api.remove_Favorite, {
        params: {
          userid: userid,
          hostelid: route.params?.Hostel?.Id,
        },
      })
      .then(res => setIsFavorite(false))
      .catch(err => alert(err));
  };
  return (
    <View style={styles.container}>
      <CustomHeader
        text="User Hostel Detail"
        navigation={navigation}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView>
        {hostelImages.length === 0 ? (
          <Text style={styles.notFoundText}>No Image Added</Text>
        ) : (
          <SliderBox
            images={hostelImages}
            sliderBoxHeight={250}
            dotColor={COLOR.secondary}
            inactiveDotColor="#FFF"
          />
        )}

        <Card style={{marginBottom: 7}}>
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                // justifyContent: 'space-between',
              }}>
              <Title style={{flex: 1}}>
                Name : {route.params.Hostel.HostelName}
              </Title>
            </View>
            <Paragraph>
              City{'         '} : {route.params.Hostel.City}
            </Paragraph>
            <Paragraph>
              Floor{'       '} : {route.params.Hostel.Floor}
            </Paragraph>
            {route.params.Hostel.Facilites !== null && (
              <Paragraph>
                Facilites{'  '} : {route.params.Hostel.Facilites}
              </Paragraph>
            )}
            <Paragraph>
              Contact {'  '}: {route.params.Hostel.PhoneNo}
            </Paragraph>
            <Paragraph>
              Address{'  '} : {route.params.Hostel.Address}
            </Paragraph>
          </Card.Content>
        </Card>
        <Text style={{...styles.text, fontWeight: 'bold', fontSize: 18}}>
          Room Detail :{' '}
        </Text>
        {route.params.Rooms.length === 0 ? (
          <View>
            <Text style={styles.notFoundText}>No Room Added</Text>
          </View>
        ) : (
          route.params.Rooms.map((item, key) => {
            return (
              <Card key={key} style={{marginBottom: 5, elevation: 2}}>
                <Card.Content>
                  <Paragraph>Type : {item.RoomType}</Paragraph>
                  <Paragraph>Total Beds : {item.NoOfBeds}</Paragraph>
                  <Paragraph>
                    Booking Date :{' '}
                    {new Date(item.BookingDate).toLocaleDateString()}
                  </Paragraph>
                  <Paragraph>Price : {item.Price}</Paragraph>
                </Card.Content>
              </Card>
            );
          })
        )}

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
              latitudeDelta: 0.0029664913116747016,
              longitudeDelta: 0.002545081079006195,
              // latitudeDelta: 0.078,
              // longitudeDelta: 0.23,
            }}
            // onRegionChangeComplete={region => onRegionChange(region)}
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
      </ScrollView>
    </View>
  );
};

export default UserHostelDetails;

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
  card: {
    marginVertical: 10,
    elevation: 2,
    marginHorizontal: 7,
    width: 270,
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
