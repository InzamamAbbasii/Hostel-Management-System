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
  FlatList,
} from 'react-native';
import {RadioButton, Checkbox} from 'react-native-paper';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;

const AddHostel = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
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
  const [imagesList, setImagesList] = useState([]);
  const [facilitesList, setFacilitesList] = useState([
    {
      Id: 0,
      Name: 'Study Room',
      Status: 'unchecked',
    },
    {
      Id: 1,
      Name: 'Laundary',
      Status: 'unchecked',
    },
    {
      Id: 2,
      Name: 'Mess',
      Status: 'unchecked',
    },
    {
      Id: 3,
      Name: 'Canteen',
      Status: 'unchecked',
    },
  ]);
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
      ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        mediaType: 'any',
        multiple: true,
      }).then(image => {
        let list = [];
        image.forEach(element => {
          var filename = element.path.replace(/^.*[\\\/]/, '');
          console.log(element.mime, filename, element.path);
          let obj = {
            fileURI: element.path,
            fileName: filename,
            fileType: element.mime,
          };
          list.push(obj);
        });
        setImagesList(list);
      });
    } catch (err) {
      console.warn(err);
    }
  };

  // const ImagePick = async () => {
  //   try {
  //     //   console.log("Camera permission given");
  //     let options = {
  //       mediaType: 'photo',
  //       maxWidth: 300,
  //       maxHeight: 550,
  //       quality: 1,

  //     };
  //     launchImageLibrary(options, response => {
  //       if (response.didCancel) {
  //         //   alert('User cancelled camera picker');
  //         return;
  //       } else if (response.errorCode == 'camera_unavailable') {
  //         //   alert('Camera not available on device');
  //         return;
  //       } else if (response.errorCode == 'permission') {
  //         // alert('Permission not satisfied');
  //         return;
  //       } else if (response.errorCode == 'others') {
  //         //  alert(response.errorMessage);
  //         return;
  //       } else {
  //         setImage({
  //           fileURI: response.assets[0].uri,
  //           fileName: response.assets[0].fileName,
  //           fileType: response.assets[0].type,
  //         });
  //       }
  //       //   this.setState({image: response.assets[0].uri});
  //       //   this.updateProfile(response.assets[0].uri);
  //     });
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };
  const handleSubmit = async () => {
    // navigation.navigate('AddRooms', {Id: 0});
    // return;
    if (
      hostel.name === '' ||
      hostel.phoneNo === '' ||
      hostel.floor === '' ||
      hostel.city === '' ||
      hostel.address === ''
    ) {
      alert('Please fill Required fields');
    } else {
      setLoading(true);
      const facilites = facilitesList
        .filter(item => item.Status === 'checked')
        .map(item => item.Name)
        .toString();
      const formdata = new FormData();
      formdata.append('HostelName', hostel.name);
      formdata.append('PhoneNo', hostel.phoneNo);
      formdata.append('Floor', hostel.floor);
      formdata.append('Facilities', facilites);
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
      let userid = await AsyncStorage.getItem('user_id');
      // formdata.append('User_Id', global.user_id);
      formdata.append('User_Id', userid);
      formdata.append('Gender', hostel.gender);
      // imagesList.length > 0 && formdata.append('File', imagesList);

      for (let i = 0; i < imagesList.length; i++) {
        formdata.append(`images[${i}]`, {
          uri: imagesList[i].fileURI,
          name: imagesList[i].fileName,
          type: imagesList[i].fileType,
        });
      }
      // image.fileName !== '' &&
      //   formdata.append('File', {
      //     uri: image.fileURI, //Your Image File Path
      //     type: image.fileType,
      //     name: image.fileName,
      //   });
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
        })
        .finally(() => setLoading(false));
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
  return (
    <ImageBackground source={bg} style={{...StyleSheet.absoluteFillObject}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CustomHeader
          text={'Add Hostel'}
          navigation={navigation}
          onBackPress={() => navigation.goBack()}
        />
        {loading && <Loading />}
        <View style={{flex: 1, paddingHorizontal: 16}}>
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

          <Text style={styles.facilitesHeading}>Facilites</Text>
          <View style={styles.facilitesContainer}>
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
            heading={'City '}
            title="Enter City"
            value={hostel.city}
            onChange={txt => setHostel({...hostel, city: txt})}
          />

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
            // onPress={() => navigation.navigate('MapScreen')}
            onPress={() =>
              navigation.navigate('MapScreen', {
                Latitude: hostel.latittude,
                Longitude: hostel.longitude,
              })
            }
            titleStyle={{color: COLOR.secondary}}
            style={{
              borderWidth: 1,
              borderColor: COLOR.secondary,
              backgroundColor: '#FFFF',
              width: 130,
            }}
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
          <CustomButton
            title="Choose Image"
            onPress={() => ImagePick()}
            titleStyle={{color: COLOR.secondary}}
            style={{
              borderWidth: 1,
              borderColor: COLOR.secondary,
              backgroundColor: '#FFFF',
              width: 130,
            }}
          />
          <FlatList
            data={imagesList}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            renderItem={item => {
              return (
                <Image
                  source={{uri: item.item.fileURI}}
                  // resizeMode={'contain'}
                  style={{
                    ...styles.imageView,
                    width: SCREEN_WIDTH - 100,
                    height: 250,
                    marginHorizontal: 10,
                    backgroundColor: COLOR.primary,
                  }}
                />
              );
            }}
          />

          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
        </View>
        <CustomButton
          title="Add Rooms"
          // onPress={() => getPositionFromAddress()}
          onPress={() => handleSubmit()}
          style={{marginBottom: 20, width: '87%'}}
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
    // backgroundColor: '#FFF',
    // marginBottom: 10,
    // borderColor: '#E5E0EB',
    // borderWidth: 1,
    // borderRadius: 2,
    // padding: 5,
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
