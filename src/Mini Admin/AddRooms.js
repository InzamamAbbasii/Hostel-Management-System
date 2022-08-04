import React, {useState} from 'react';
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
import {RadioButton} from 'react-native-paper';
import {bg} from '../CONSTANTS/images';
import {COLOR} from '../CONSTANTS/Colors';
import {fonts} from '../CONSTANTS/fonts';
import Input from '../reuseable/Input';
import CustomButton from '../reuseable/CustomButton';
import {api} from '../CONSTANTS/api';
import axios from 'axios';
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;

const AddRooms = ({navigation, route}) => {
  const [roomType, setRoomType] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
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
        },
      },
    ]);
  };

  const handleSubmit = () => {
    if (roomType === '' || description === '' || price === '') {
      alert('Please fill Required fields');
    } else {
      const params = {
        RoomType: roomType,
        Description: description,
        Price: price,
        H_Id: route.params.Id,
      };
      console.log(params);
      axios
        .post(api.addRoom, params)
        .then(response => {
          showAlert();
        })
        .catch(err => {
          alert(err);
        });
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
            Add Rooms
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.facilitesHeading}>Room Type</Text>
          <View style={styles.facilitesContainer}>
            <View style={styles.rowView}>
              <View style={styles.rowView}>
                <RadioButton
                  value="A"
                  color={COLOR.secondary}
                  status={roomType === 'A' ? 'checked' : 'unchecked'}
                  onPress={() => setRoomType('A')}
                />
                <Text style={styles.radioButtonText}>A</Text>
              </View>
              <View style={styles.rowView}>
                <RadioButton
                  value="B"
                  color={COLOR.secondary}
                  status={roomType === 'B' ? 'checked' : 'unchecked'}
                  onPress={() => setRoomType('B')}
                />
                <Text style={styles.radioButtonText}>B</Text>
              </View>
              <View style={styles.rowView}>
                <RadioButton
                  value="C"
                  color={COLOR.secondary}
                  status={roomType === 'C' ? 'checked' : 'unchecked'}
                  onPress={() => setRoomType('C')}
                />
                <Text style={styles.radioButtonText}>C</Text>
              </View>
            </View>
          </View>
          <Input
            heading={'Description '}
            multiline={true}
            title="Ac,Wifi,Attach Washroom ..."
            value={description.toString()}
            onChange={txt => setDescription(txt)}
          />
          <Input
            heading={'Price'}
            title="Price in PKR"
            value={price.toString()}
            onChange={txt => setPrice(txt)}
          />
        </View>
        <CustomButton
          title="Save"
          onPress={() => handleSubmit()}
          style={{marginTop: 40}}
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
