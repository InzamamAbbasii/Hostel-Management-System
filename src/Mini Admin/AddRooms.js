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
import {RadioButton, Checkbox} from 'react-native-paper';
import {bg} from '../CONSTANTS/images';
import {COLOR} from '../CONSTANTS/Colors';
import {fonts} from '../CONSTANTS/fonts';
import Input from '../reuseable/Input';
import CustomButton from '../reuseable/CustomButton';
import CustomHeader from '../reuseable/CustomHeader';

import {api} from '../CONSTANTS/api';
import axios from 'axios';
import Geocoder from 'react-native-geocoder';
import Loading from '../reuseable/Loading';
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;

const AddRooms = ({navigation, route}) => {
  const [roomType, setRoomType] = useState('');
  const [totalRooms, setTotalRooms] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [Room_Types_List, setRoom_Types_List] = useState([
    {
      Id: 0,
      Type: 'Single Bed',
      Status: 'unchecked',
    },
    {
      Id: 1,
      Type: 'Double Bed',
      Status: 'unchecked',
    },
    {
      Id: 2,
      Type: 'Three Bed',
      Status: 'unchecked',
    },
  ]);

  const [facilitesList, setFacilitesList] = useState([
    {
      Id: 0,
      Name: 'Wifi',
      Status: 'unchecked',
    },
    {
      Id: 2,
      Name: 'AC',
      Status: 'unchecked',
    },
    {
      Id: 3,
      Name: 'TV',
      Status: 'unchecked',
    },
  ]);

  const handleOnRadioButtonChange = id => {
    const newData = Room_Types_List.map(item => {
      if (item.Id === id) {
        setRoomType(item.Type);
        return {
          ...item,
          Status: 'checked',
        };
      } else {
        return {...item, Status: 'unchecked'};
      }
    });
    setRoom_Types_List(newData);
  };
  const handleOnCheckboxChange = id => {
    const newData = facilitesList.map(item => {
      if (item.Id === id) {
        return {
          ...item,
          Status: item.Status === 'checked' ? 'unchecked' : 'checked',
        };
      } else {
        return {...item};
      }
    });
    setFacilitesList(newData);
  };
  const showAlert = () => {
    Alert.alert('Room Added', 'Do you want to add more?', [
      {
        text: 'No',
        onPress: () => navigation.replace('Dashboard'),
        style: 'cancel',
      },
      {
        text: 'Add More',
        onPress: () => {
          setRoomType('');
          setDescription('');
          setPrice('');
          setTotalRooms('');
          // let resetList = facilitesList.map(
          //   item => item.Status === 'unchecked',
          // );
          // setFacilitesList(resetList);
        },
      },
    ]);
  };

  const handleSubmit = () => {
    if (roomType === '' || totalRooms === '' || price === '') {
      alert('Please fill Required fields');
    } else {
      setLoading(true);
      const facilites = facilitesList
        .filter(item => item.Status === 'checked')
        .map(item => item.Name);
      const params = {
        RoomType: roomType,
        Price: price,
        TotalRooms: totalRooms,
        Description: description,
        Facilites: facilites.toString(),
        H_Id: route.params.Id,
      };
      console.log('add room params', params);
      axios
        .post(api.addRoom, params)
        .then(response => {
          showAlert();
        })
        .catch(err => {
          alert(err);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <ImageBackground source={bg} style={{...StyleSheet.absoluteFillObject}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CustomHeader text={'Add Rooms'} navi={navigation} />
        {loading && <Loading />}
        <View style={{flex: 1, paddingHorizontal: 16}}>
          <Text style={styles.facilitesHeading}>Room Type</Text>
          <View style={styles.roomTypesContainer}>
            {Room_Types_List.map((item, key) => {
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
                  <Text style={styles.radioButtonText}>{item.Type}</Text>
                </View>
              );
            })}
          </View>
          <Input
            heading={'Rooms'}
            title="Total No.of rooms"
            keyboardType={'number-pad'}
            value={totalRooms.toString()}
            onChange={txt => setTotalRooms(txt)}
          />
          <Input
            heading={'Price'}
            title="Price in PKR"
            value={price.toString()}
            keyboardType={'number-pad'}
            onChange={txt => setPrice(txt)}
          />

          <Text style={styles.facilitesHeading}>Facilites</Text>
          <View style={styles.roomTypesContainer}>
            {facilitesList.map((item, key) => {
              return (
                <View
                  key={key}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '50%',
                  }}>
                  <Checkbox
                    value={item.Name}
                    color={COLOR.secondary}
                    status={item.Status}
                    onPress={() => handleOnCheckboxChange(item.Id)}
                  />
                  <Text style={styles.radioButtonText}>{item.Name}</Text>
                </View>
              );
            })}
          </View>

          <Input
            heading={'Description '}
            multiline={true}
            numberOfLines={8}
            txtStyle={{textAlignVertical: 'top'}}
            title="Description (optional)"
            value={description.toString()}
            onChange={txt => setDescription(txt)}
          />
        </View>
        <CustomButton
          title="Save"
          onPress={() => handleSubmit()}
          style={{marginBottom: 20, width: '90%'}}
        />
      </ScrollView>
    </ImageBackground>
  );
};

export default AddRooms;
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
  roomTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderColor: '#E5E0EB',
    borderWidth: 1,
    borderRadius: 2,
    padding: 5,
    marginTop: 4,
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
});
