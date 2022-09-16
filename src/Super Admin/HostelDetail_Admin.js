import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, {Marker} from 'react-native-maps';
import {SliderBox} from 'react-native-image-slider-box';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {fonts} from '../CONSTANTS/fonts';
import {api} from '../CONSTANTS/api';
import {COLOR} from '../CONSTANTS/Colors';
import CustomButton from '../reuseable/CustomButton';
import axios from 'axios';

const HostelDetail_Admin = ({navigation, route}) => {
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];
  const [hostelImages, setHostelImages] = useState([]);
  const [hostelersList, setHostelersList] = useState([]);

  const [userid, setUserid] = useState(0);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
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
    if (route.params) {
      // setRoomsList(route.params.Rooms);
      route.params?.Users && setHostelersList(route.params?.Users);
    }
    setHostelImages([]);
    route.params?.HostelImages?.forEach(element => {
      let imagepath = `${api.image}${element}`;
      setHostelImages(prevstate => [...prevstate, imagepath]);
    });
    route.params?.isFavorite && setIsFavorite(route.params.isFavorite);
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

  return (
    <View style={styles.container}>
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
              Contact {'   '}: {route.params.Hostel.PhoneNo}
            </Paragraph>
            <Paragraph>
              Address{'  '} : {route.params.Hostel.Address}
            </Paragraph>
          </Card.Content>
        </Card>

        <ItemDevider />
        {/* Only show when ADMIN 😂 is login and want to search */}

        {userRole === 'Admin' &&
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
                          : new Date(item.BookingDate).toLocaleDateString()}
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

        {userRole === 'Admin' &&
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
          <Text style={styles.notFoundText}>No Room Added</Text>
        ) : (
          <FlatList
            data={route.params.Rooms}
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
                  {route.params.Hostel?.Status !== 'Pending' && (
                    <View>
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
                    </View>
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
          //   route.params.Rooms.map((item, key) => {
          //     return (
          //       <Card key={key} style={{marginBottom: 5, elevation: 2}}>
          //         <Card.Title title={item.RoomType} />
          //         <Card.Content>
          //           <Paragraph>Price : PKR {item.Price}</Paragraph>
          //           <Paragraph>Total Rooms : {item.TotalRooms}</Paragraph>
          //           {route.params.Hostel?.Status !== 'Pending' && (
          //             <View>
          //               <Paragraph>Total Bed : {item.TotalBeds}</Paragraph>
          //               {item.BookedBeds == null ? (
          //                 <Paragraph>Booked Bed : 0</Paragraph>
          //               ) : (
          //                 <Paragraph>Booked Bed : {item.BookedBeds}</Paragraph>
          //               )}
          //               {getAvailableRooms(item.TotalBeds, item.BookedBeds) <
          //               1 ? (
          //                 <Paragraph style={{color: 'red'}}>
          //                   Avaiable Bed :{' '}
          //                   {getAvailableRooms(item.TotalBeds, item.BookedBeds)}
          //                 </Paragraph>
          //               ) : (
          //                 <Paragraph style={{color: 'green'}}>
          //                   Avaiable Bed :{' '}
          //                   {getAvailableRooms(item.TotalBeds, item.BookedBeds)}
          //                 </Paragraph>
          //               )}
          //             </View>
          //           )}

          //           <Paragraph>
          //             Facilites :{' '}
          //             {item.Facilites?.length === 0 ? 'N/A' : item.Facilites}
          //           </Paragraph>
          //           <Paragraph>
          //             Description :{' '}
          //             {item.Description?.length === 0 ? 'N/A' : item.Description}
          //           </Paragraph>
          //         </Card.Content>
          //       </Card>
          //     );
          //   })
        )}
        <ItemDevider />
        {route?.params?.Hostel?.Status === 'Approved' && (
          <View>
            <Text style={{...styles.text, fontWeight: 'bold', fontSize: 18}}>
              Hostelers :
            </Text>
            {hostelersList?.length === 0 ? (
              <View>
                <Text style={styles.notFoundText}>
                  Not Booked by any person
                </Text>
              </View>
            ) : (
              <FlatList
                data={hostelersList}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={item => {
                  return (
                    <View
                      style={{
                        ...styles.card,
                        width: 220,
                        backgroundColor: '#000',
                      }}>
                      <Text style={styles.card_Title}>{item.item.Name}</Text>
                      <Text style={styles.card_Text}>
                        Email : {item.item.Email}
                      </Text>
                      <Text style={styles.card_Text}>
                        PhoneNo : {item.item.PhoneNo}
                      </Text>
                      <Text style={styles.card_Text}>
                        CNIC : {item.item.CNIC}
                      </Text>
                      <Text style={styles.card_Text}>
                        Institude :{' '}
                        {item.item.InstitudeName == null
                          ? 'N/A'
                          : item.item.InstitudeName}
                      </Text>
                    </View>
                  );
                }}
              />
            )}
            <ItemDevider />
          </View>
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

              // latitudeDelta: 2.819748261678967,
              // longitudeDelta: 3.680000826716423,
              // latitudeDelta: 0.078,
              // longitudeDelta: 0.23,
              latitudeDelta: 0.0029664913116747016,
              longitudeDelta: 0.002545081079006195,
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
        {userRole === 'Admin' && prevRoute.name === 'VerifyHostels' && (
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
      </ScrollView>
    </View>
  );
};

export default HostelDetail_Admin;

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
    maxWidth: 270,
    marginHorizontal: 7,
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
