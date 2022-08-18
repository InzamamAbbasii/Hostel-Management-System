import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
  ImageBackground,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {bg} from '../CONSTANTS/images';
import {COLOR} from '../CONSTANTS/Colors';
import {fonts} from '../CONSTANTS/fonts';
import Input from '../reuseable/Input';
import CustomButton from '../reuseable/CustomButton';
import CustomHeader from '../reuseable/CustomHeader';
import {api} from '../CONSTANTS/api';
import axios from 'axios';
import Geocoder from 'react-native-geocoder';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;

const AddHostel = ({navigation, route}) => {
  const [hostel, setHostel] = useState({
    name: '',
    phoneNo: '',
    floor: '',
    city: '',
    address: '',
    gender: 'Male',
    latittude: '',
    longitude: '',
    image: null,
  });
  const [image, setImage] = useState({
    fileURI: '',
    fileName: '',
    fileType: '',
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (typeof route.params !== 'undefined') {
        console.log(route.params.City);
        setHostel({
          ...hostel,
          address: route.params.Address,
          latittude: route.params.Latitude.toString(),
          longitude: route.params.Longitude.toString(),
          city: route.params.City !== null && route.params.City,
        });
      }
    });
    return () => unsubscribe;
  }, [route]);

  const ImagePick = async () => {
    try {
      //   console.log("Camera permission given");
      let options = {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 550,
        quality: 1,
      };
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          //   alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          //   alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          // alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          //  alert(response.errorMessage);
          return;
        } else {
          setImage({
            fileURI: response.assets[0].uri,
            fileName: response.assets[0].fileName,
            fileType: response.assets[0].type,
          });
        }
        //   this.setState({image: response.assets[0].uri});
        //   this.updateProfile(response.assets[0].uri);
      });
    } catch (err) {
      console.warn(err);
    }
  };
  const handleSubmit = async () => {
    // navigation.navigate('AddRooms', {Id: 0});
    if (
      hostel.name === '' ||
      hostel.phoneNo === '' ||
      hostel.floor === '' ||
      hostel.city === '' ||
      hostel.address === ''
    ) {
      alert('Please fill Required fields');
    } else {
      const formdata = new FormData();
      formdata.append('HostelName', hostel.name);
      formdata.append('PhoneNo', hostel.phoneNo);
      formdata.append('Floor', hostel.floor);
      formdata.append('City', hostel.city);
      formdata.append('Address', hostel.address);

      if (hostel.latittude === '' || hostel.longitude === '') {
        await getPositionFromAddress()
          .then(res => {
            console.log('response', res);
            formdata.append('Latitude', res.position.lat);
            formdata.append('Longitude', res.position.lng);
          })
          .catch(err => {
            alert(err);
            return;
          });
      } else {
        formdata.append('Latitude', hostel.latittude);
        formdata.append('Longitude', hostel.longitude);
      }

      formdata.append('User_Id', global.user_id);
      formdata.append('Gender', hostel.gender);

      image.fileName !== '' &&
        formdata.append('File', {
          uri: image.fileURI, //Your Image File Path
          type: image.fileType,
          name: image.fileName,
        });
      console.log(formdata);
      axios({
        url: api.addHostel,
        method: 'POST',
        data: formdata,
        headers: {
          // Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          if (response.data.Id) {
            navigation.navigate('AddRooms', {Id: response.data.Id});
          } else {
            alert('Something went wrong.Data not inserted.');
          }
        })
        .catch(err => {
          alert(err);
        });
    }
  };
  const getPositionFromAddress = async () => {
    return new Promise((resolve, reject) => {
      Geocoder.geocodeAddress(hostel.address)
        .then(res => {
          if (typeof res[0] === 'undefined')
            reject('Something went wrong.Please check details you enter.');
          else resolve(res[0]);
        })
        .catch(err => reject(err));
    });
  };
  return (
    <ImageBackground
      source={bg}
      style={{...StyleSheet.absoluteFillObject, paddingHorizontal: 16}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CustomHeader text={'Add Hostel'} navi={navigation} />
        <View style={{flex: 1}}>
          <Input
            heading={'Name '}
            title="Enter Hostel Name"
            onChange={txt => setHostel({...hostel, name: txt})}
          />
          <Input
            heading={'Phone No'}
            title="Enter Phone No."
            keyboardType={'phone-pad'}
            onChange={txt => setHostel({...hostel, phoneNo: txt})}
          />
          {/* <Input heading={'Rooms '} title="Enter Total Rooms" /> */}
          <Input
            heading={'Floor '}
            title="Enter Total Floor"
            onChange={txt => setHostel({...hostel, floor: txt})}
          />
          <Input
            heading={'City '}
            title="Enter City"
            value={hostel.city}
            onChange={txt => setHostel({...hostel, city: txt})}
          />

          <Text
            style={{
              marginTop: 10,
              marginLeft: 3,
              fontSize: 15,
              fontFamily: fonts.regular,
              color: '#303030',
            }}>
            Gender
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              backgroundColor: '#FFF',
              marginBottom: 10,
              borderColor: '#E5E0EB',
              borderWidth: 1,
              borderRadius: 2,
              padding: 5,
              marginTop: 4,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '50%',
              }}>
              <RadioButton
                value={'Male'}
                color={COLOR.secondary}
                status={hostel.gender === 'Male' ? 'checked' : 'unchecked'}
                onPress={() => setHostel({...hostel, gender: 'Male'})}
              />
              <Text style={styles.radioButtonText}>Male</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '50%',
              }}>
              <RadioButton
                value={'Female'}
                color={COLOR.secondary}
                status={hostel.gender === 'Female' ? 'checked' : 'unchecked'}
                onPress={() => setHostel({...hostel, gender: 'Female'})}
              />
              <Text style={styles.radioButtonText}>Female</Text>
            </View>
          </View>

          {/* <Input
            heading={'Latitude'}
            title="Enter Latitude or choose from Google Map "
            value={hostel.latittude}
            onChange={txt => setHostel({...hostel, latittude: txt})}
          />
          <Input
            heading={'Longitude'}
            title="Enter Longitude or choose from Google Map "
            value={hostel.longitude}
            onChange={txt => setHostel({...hostel, longitude: txt})}
          /> */}
          <Input
            heading={'Address '}
            title="Enter Address or choose from Google Map "
            value={hostel.address}
            multiline={true}
            onChange={txt => setHostel({...hostel, address: txt})}
          />
          <CustomButton
            title="Open Map"
            titleStyle={{color: COLOR.secondary}}
            style={{
              backgroundColor: COLOR.white,
              borderColor: '#E5E0EB',
              borderWidth: 1,
              width: 100,
            }}
            onPress={() => navigation.navigate('MapScreen')}
          />
          {/* <Text style={styles.facilitesHeading}>Facilites</Text>
          <View style={styles.facilitesContainer}>
            <View style={styles.rowView}>
              <View style={styles.rowView}>
                <RadioButton value="second" />
                <Text style={styles.radioButtonText}>Wifi</Text>
              </View>
              <View style={styles.rowView}>
                <RadioButton value="second" />
                <Text style={styles.radioButtonText}>Study Room</Text>
              </View>
              <View style={styles.rowView}>
                <RadioButton value="second" />
                <Text style={styles.radioButtonText}>Mess</Text>
              </View>
            </View>
            <View style={styles.rowView}>
              <View style={styles.rowView}>
                <RadioButton value="second" />
                <Text style={styles.radioButtonText}>Laundary</Text>
              </View>
              <View style={styles.rowView}>
                <RadioButton value="second" />
                <Text style={styles.radioButtonText}>AC</Text>
              </View>
            </View>
          </View> */}
          <TouchableOpacity
            style={styles.imageView}
            onPress={() => ImagePick()}>
            {image.fileURI === '' ? (
              <Text style={{color: '#000', fontSize: 16}}>Choose Image</Text>
            ) : (
              // <Text style={{color: '#000', fontSize: 16}}>{image.fileURI}</Text>
              <Image
                source={{uri: image.fileURI}}
                style={{height: '100%', width: '100%'}}
                resizeMode={'cover'}
              />
            )}
          </TouchableOpacity>
        </View>
        <CustomButton
          title="Add Rooms"
          // onPress={() => getPositionFromAddress()}
          onPress={() => handleSubmit()}
          style={{marginBottom: 20}}
        />
      </ScrollView>
    </ImageBackground>
  );
};

export default AddHostel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#eee',
    alignItems: 'center',
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  radioButtonText: {
    fontSize: 16,
    color: '#000',
    fontFamily: fonts.regular,
  },
  imageView: {
    height: 150,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#E5E0EB',
    borderWidth: 1,
    borderRadius: 2,
    marginVertical: 20,
  },
});
