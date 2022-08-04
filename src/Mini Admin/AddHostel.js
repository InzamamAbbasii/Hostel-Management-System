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
import {api} from '../CONSTANTS/api';
import axios from 'axios';
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;

const AddHostel = ({navigation, route}) => {
  const [hostel, setHostel] = useState({
    name: '',
    phoneNo: '',
    floor: '',
    city: '',
    address: '',
    image: null,
  });
  const [image, setImage] = useState({
    fileURI: '',
    fileName: '',
    fileType: '',
  });
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (typeof route.params != 'undefined') {
        console.log(route.params);
        setHostel({...hostel, address: route.params.Address});
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
          console.log(response.assets[0]);
        }
        //   this.setState({image: response.assets[0].uri});
        //   this.updateProfile(response.assets[0].uri);
      });
    } catch (err) {
      console.warn(err);
    }
  };
  const handleSubmit = () => {
    if (
      hostel.name === '' ||
      hostel.phoneNo == '' ||
      hostel.floor == '' ||
      hostel.city == '' ||
      hostel.address == ''
    ) {
      alert('Please fill Required fields');
    } else {
      const params = {
        HostelName: hostel.name,
        PhoneNo: hostel.phoneNo,
        Floor: hostel.floor,
        City: hostel.city,
        Address: hostel.address,
        Image: '',
        Location: '',
      };

      axios
        .post(api.addHostel, params)
        .then(response => {
          console.log(response.data);
          navigation.navigate('AddRooms', {Id: response.data.Id});
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
            Add Hostel
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Input
            heading={'Name '}
            title="Enter Hostel Name"
            onChange={txt => setHostel({...hostel, name: txt})}
          />
          <Input
            heading={'Phone No'}
            title="Enter Phone No."
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
            onChange={txt => setHostel({...hostel, city: txt})}
          />
          <Input
            heading={'Address '}
            title="Enter Address or choose from Google Map "
            value={hostel.address}
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
            onPress={
              () => navigation.navigate('MapScreen')
              // alert(
              //   'Map Feature is currently not available.We will add this soon.Thanks😍',
              // )
            }
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
