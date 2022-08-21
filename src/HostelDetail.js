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
import {SliderBox} from 'react-native-image-slider-box';

import {fonts} from './CONSTANTS/fonts';
import {api} from './CONSTANTS/api';
import {COLOR} from './CONSTANTS/Colors';
import CustomButton from './reuseable/CustomButton';
import axios from 'axios';

const HostelDetail = ({navigation, route}) => {
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];
  const [hostelImages, setHostelImages] = useState([]);
  useEffect(() => {
    console.log('prev screen', prevRoute.name, global.user[0].AccountType);
    // console.log(route.params.HostelImages);
    setHostelImages([]);
    route.params?.HostelImages?.forEach(element => {
      let imagepath = `${api.image}${element}`;
      setHostelImages(prevstate => [...prevstate, imagepath]);
    });
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
  return (
    <View style={styles.container}>
      {prevRoute.name === 'MyHostels' && global.user[0].AccountType === 'User' //on user login😃 when user want to see his own booked hostel
        ? route.params && (
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
                  <Title>Name : {route.params.Hostel.HostelName}</Title>
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
              <Card style={{marginBottom: 5, elevation: 2}}>
                <Card.Content>
                  <Paragraph>Type : {route.params?.Rooms?.RoomType}</Paragraph>
                  <Paragraph>
                    Total Beds : {route.params?.Rooms?.NoOfBeds}
                  </Paragraph>
                  <Paragraph>
                    Booking Date :{' '}
                    {new Date(
                      route.params?.Rooms?.BookingDate,
                    ).toLocaleDateString()}
                  </Paragraph>
                  <Paragraph>Price : {route.params?.Rooms?.Price}</Paragraph>
                </Card.Content>
              </Card>

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

              {/* Showing Checkout Button to User */}
              {route.params?.Status === 'Approved' && (
                <CustomButton
                  title="Checkout"
                  onPress={() => handleCheckout(route.params?.Id)}
                  style={{flex: 1, margin: 7}}
                />
              )}
            </ScrollView>
          )
        : route.params && (
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
                  <Title>Name : {route.params.Hostel.HostelName}</Title>
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
                    Contact {'   '}: {route.params.Hostel.PhoneNo}
                  </Paragraph>
                  <Paragraph>
                    Address{'  '} : {route.params.Hostel.Address}
                  </Paragraph>
                </Card.Content>
              </Card>

              <ItemDevider />
              {/* Only show when ADMIN 😂 is login and want to search */}

              {global.user.length > 0 &&
                global.user[0].AccountType === 'Admin' &&
                prevRoute.name === 'Search' &&
                route.params?.Users &&
                (route.params?.Users?.length === 0 ? (
                  <View>
                    <Text
                      style={{
                        ...styles.text,
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}>
                      Hostelers :{' '}
                    </Text>
                    <Text style={styles.notFoundText}>
                      No Person currently live in this hostel
                    </Text>
                  </View>
                ) : (
                  <View style={{backgroundColor: 'pink'}}>
                    <Text
                      style={{
                        ...styles.text,
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}>
                      Hostelers :
                    </Text>
                    {route.params?.Users?.map((item, key) => {
                      return (
                        <Card
                          style={{
                            marginBottom: 7,
                          }}
                          key={key}>
                          <Card.Content>
                            <Title>Name : {item.Name}</Title>
                            <Paragraph>
                              Email{'      '} : {item.Email}
                            </Paragraph>
                            {item.Reg_No != null && (
                              <Paragraph>
                                Reg_No{'       '} : {item.Reg_No}
                              </Paragraph>
                            )}
                            {item.InstitudeName != null && (
                              <Paragraph>
                                InstitudeName{'       '} : {item.InstitudeName}
                              </Paragraph>
                            )}
                            <Paragraph>
                              BookingDate :{' '}
                              {item.BookingDate == null
                                ? 'N/A'
                                : new Date(
                                    item.BookingDate,
                                  ).toLocaleDateString()}
                            </Paragraph>
                            <Paragraph>
                              RoomType{'       '} : {item.RoomType}
                            </Paragraph>
                            <Paragraph>
                              NoOfBeds{'       '} : {item.NoOfBeds}
                            </Paragraph>
                          </Card.Content>
                        </Card>
                      );
                    })}
                    <ItemDevider />
                  </View>
                ))}

              {global.user.length > 0 &&
                global.user[0].AccountType === 'Admin' &&
                prevRoute.name === 'Search' &&
                route.params?.UserRooms?.length > 0 && (
                  <View>
                    <Text
                      style={{
                        ...styles.text,
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}>
                      Room Detail :{' '}
                    </Text>

                    {route.params?.UserRooms?.map((item, key) => {
                      return (
                        <Card style={{marginBottom: 5, elevation: 2}} key={key}>
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
                    })}
                  </View>
                )}
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
                        navigation.replace('AddRooms', {
                          Id: route.params.Hostel.Id,
                        })
                      }
                      style={{marginBottom: 10}}
                    />
                  )}
                </View>
              ) : (
                route.params.Rooms.map((item, key) => {
                  return (
                    <Card key={key} style={{marginBottom: 5, elevation: 2}}>
                      <Card.Title title={item.RoomType} />
                      <Card.Content>
                        <Paragraph>Price : PKR {item.Price}</Paragraph>
                        <Paragraph>Total Rooms : {item.TotalRooms}</Paragraph>
                        {route.params.Hostel?.Status !== 'Pending' && (
                          <View>
                            <Paragraph>Total Bed : {item.TotalBeds}</Paragraph>
                            {item.BookedBeds == null ? (
                              <Paragraph>Booked Bed : 0</Paragraph>
                            ) : (
                              <Paragraph>
                                Booked Bed : {item.BookedBeds}
                              </Paragraph>
                            )}
                            {getAvailableRooms(
                              item.TotalBeds,
                              item.BookedBeds,
                            ) < 1 ? (
                              <Paragraph style={{color: 'red'}}>
                                Avaiable Bed :{' '}
                                {getAvailableRooms(
                                  item.TotalBeds,
                                  item.BookedBeds,
                                )}
                              </Paragraph>
                            ) : (
                              <Paragraph style={{color: 'green'}}>
                                Avaiable Bed :{' '}
                                {getAvailableRooms(
                                  item.TotalBeds,
                                  item.BookedBeds,
                                )}
                              </Paragraph>
                            )}
                          </View>
                        )}

                        <Paragraph>Facilites : {item.Facilites}</Paragraph>
                        <Paragraph>Description : {item.Description}</Paragraph>
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
                    title="View Feedback"
                    onPress={() =>
                      navigation.navigate('Feedback', {
                        H_Id: route.params.Hostel.Id,
                        AddFeedback: false,
                      })
                    }
                    style={{flex: 1, margin: 7}}
                  />
                  <CustomButton
                    title="Book Room"
                    onPress={() =>
                      navigation.navigate('BookRoom', {
                        Rooms: route.params.Rooms,
                      })
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
