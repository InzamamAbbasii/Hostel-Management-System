import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import MapView, {Marker} from 'react-native-maps';
import {SliderBox} from 'react-native-image-slider-box';
import {api} from '../CONSTANTS/api';
import {COLOR} from '../CONSTANTS/Colors';
import CustomButton from '../reuseable/CustomButton';
import CustomHeader from '../reuseable/CustomHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {style} from 'deprecated-react-native-prop-types/DeprecatedTextPropTypes';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';

const HostelDetail_HostelManager = ({navigation, route}) => {
  const [hostelImages, setHostelImages] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  let isFocus = useIsFocused();
  useEffect(() => {
    if (route.params) setRoomsList(route.params.Rooms);
    setHostelImages([]);
    route.params?.HostelImages?.forEach(element => {
      let imagepath = `${api.image}${element}`;
      setHostelImages(prevstate => [...prevstate, imagepath]);
    });
  }, [isFocus]);

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

  //-------------delete Room---------------
  const handleDeleteRoom = id => {
    Alert.alert('Delete', 'Are you sure you want to delete this room?', [
      {
        text: 'No',
        // onPress: () => navigation.replace('Dashboard'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          deleteRoom(id);
        },
      },
    ]);
  };
  const deleteRoom = id => {
    axios
      .get(api.delete_room, {
        params: {
          room_id: id,
        },
      })
      .then(res => {
        if (res.data) {
          const newData = roomsList.filter(item => item.Id !== id);
          setRoomsList(newData);
          alert('Room Deleted Successfully.');
        } else {
          alert('Room Not Found');
        }
      })
      .catch(err => alert(err));
  };

  //----------delete Hostel-------------------
  const handleDeleteHostel = id => {
    Alert.alert('Delete', 'Are you sure you want to delete this hostel?', [
      {
        text: 'No',
        // onPress: () => navigation.replace('Dashboard'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          delteHostel(id);
        },
      },
    ]);
  };
  const delteHostel = id => {
    axios
      .get(api.delete_hostel, {
        params: {
          id: id,
        },
      })
      .then(res => {
        if (res.data) {
          navigation.replace('Dashboard');
          alert('Hostel Deleted Successfully.');
        } else {
          alert('Hostel Not Found');
        }
      })
      .catch(err => alert(err));
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <CustomHeader
          text="Detail_HostelManager"
          onBackPress={() => navigation.goBack()}
        />
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
            <View
              style={{
                alignSelf: 'flex-end',
                flexDirection: 'row',
                width: 80,
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EditHostel', {
                    Id: route.params.Hostel.Id,
                  })
                }
                style={{
                  height: 30,
                  width: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FontAwesome name="edit" color={'red'} size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteHostel(route.params.Hostel.Id)}
                style={{
                  height: 30,
                  width: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialIcons name="delete" color={'red'} size={20} />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        <ItemDevider />

        <Text style={{...styles.text, fontWeight: 'bold', fontSize: 18}}>
          Rooms :{' '}
        </Text>
        {roomsList.length === 0 ? (
          <View>
            <Text style={styles.notFoundText}>No Room Added</Text>
            <CustomButton
              title="Add Room"
              onPress={() =>
                navigation.replace('AddRooms', {
                  Id: route.params.Hostel.Id,
                })
              }
              style={{marginBottom: 10}}
            />
          </View>
        ) : (
          <FlatList
            data={roomsList}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={item => {
              return (
                <View style={styles.card}>
                  <View style={{position: 'absolute', right: 50, top: 10}}>
                    <FontAwesome
                      name="edit"
                      color={'#FFF'}
                      size={20}
                      onPress={() =>
                        navigation.navigate('EditRoom', {Id: item.item.Id})
                      }
                    />
                  </View>
                  <View style={{position: 'absolute', right: 10, top: 10}}>
                    <MaterialIcons
                      name="delete"
                      color={'#FFF'}
                      size={20}
                      onPress={() => handleDeleteRoom(item.item.Id)}
                    />
                  </View>
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
            ListFooterComponent={
              roomsList.length < 3 ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.replace('AddRooms', {
                      Id: route.params.Hostel.Id,
                    })
                  }
                  style={{
                    ...styles.card,
                    height: 230,
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: COLOR.primary,
                    elevation: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Feather name="plus" color={'#000'} size={105} />
                </TouchableOpacity>
              ) : null
            }
          />
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
              // latitudeDelta: 0.078,
              // longitudeDelta: 0.23,

              latitudeDelta: 0.0010603951076291196,
              longitudeDelta: 0.0014433637261390686,
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
      </ScrollView>
    </View>
  );
};

export default HostelDetail_HostelManager;

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
    width: 250,
    // height: 230,
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
