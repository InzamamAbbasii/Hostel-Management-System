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
  Alert,
} from 'react-native';
import {RadioButton, Checkbox} from 'react-native-paper';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
import Dashboard from './Dashboard';
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;

const EditHostel = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [hostel, setHostel] = useState({
    id: 0,
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
  const [oldImages, setOldImages] = useState([]); //already inserted in database
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

  //call only first render
  useEffect(() => {
    if (typeof route.params?.Id !== 'undefined') {
      getdetail(route.params.Id);
    }
  }, []);

  //call on every time when route change
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (
        typeof route.params !== 'undefined' &&
        typeof route.params?.Latitude != 'undefined'
      ) {
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

  const getdetail = id => {
    setLoading(true);
    axios
      .get(api.get_Hostel_Detail, {
        params: {
          id: id,
        },
      })
      .then(res => {
        if (res.data == false) {
          alert('Data not found');
        } else {
          let hostelinfo = res.data.HostelInfo;
          setOldImages(res.data.HostelImages);
          setHostel({
            ...hostel,
            id: id,
            name: hostelinfo.HostelName,
            phoneNo: hostelinfo.PhoneNo,
            floor: hostelinfo.Floor,
            city: hostelinfo.City,
            address: hostelinfo.Address,
            latittude: hostelinfo.Latitude,
            longitude: hostelinfo.Longitude,
            gender: hostelinfo.Gender,
          });
          let facilites = hostelinfo.Facilites.toString().split(',').join(' ');

          const newData = facilitesList.map(item => {
            if (facilites.includes(item.Name)) {
              return {
                ...item,
                Status: 'checked',
              };
            } else {
              return {...item};
            }
          });
          setFacilitesList(newData);
        }
      })
      .catch(err => alert(err))
      .finally(() => {
        setLoading(false);
      });
  };

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

  const handleSubmit = async () => {
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
      formdata.append('Id', hostel.id);
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
            alert('error in getting lat/lng.Please enter correct addresss');
            return;
          });
      } else {
        formdata.append('Latitude', hostel.latittude);
        formdata.append('Longitude', hostel.longitude);
      }
      // let userid = await AsyncStorage.getItem('user_id');
      // formdata.append('User_Id', userid);
      formdata.append('Gender', hostel.gender);
      for (let i = 0; i < imagesList.length; i++) {
        formdata.append(`images[${i}]`, {
          uri: imagesList[i].fileURI,
          name: imagesList[i].fileName,
          type: imagesList[i].fileType,
        });
      }
      console.log(formdata);
      axios({
        url: api.update_hostel,
        method: 'POST',
        data: formdata,
        headers: {
          // Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          if (response.data !== false) {
            navigation.replace('ViewHostels');
            alert('Hostel Updated Successfully!');
          } else {
            alert('Hostel Not Found');
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

  //----------delete Hostel-------------------
  const handleDeleteImage = id => {
    Alert.alert('Delete', 'Are you sure you want to delete Image?', [
      {
        text: 'No',
        // onPress: () => navigation.replace('Dashboard'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          delteImage(id);
        },
      },
    ]);
  };
  const delteImage = id => {
    axios
      .get(api.delete_hostel_Images, {
        params: {
          id: id,
        },
      })
      .then(res => {
        if (res.data) {
          alert('Image Deleted Successfully.');
          const newData = oldImages.filter(item => item.Id !== id);
          setOldImages(newData);
        } else {
          alert('Image Not Found');
        }
      })
      .catch(err => alert(err));
  };
  return (
    <ImageBackground source={bg} style={{...StyleSheet.absoluteFillObject}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <CustomHeader
          text={'Add Hostel'}
          onBackPress={() => navigation.goBack()}
        /> */}
        {loading && <Loading />}
        <View style={{flex: 1, paddingHorizontal: 16}}>
          <Input
            heading={'Name '}
            title="Enter Hostel Name"
            value={hostel.name}
            onChange={txt => setHostel({...hostel, name: txt})}
          />
          <Input
            heading={'Phone No'}
            title="Enter Phone No."
            keyboardType={'phone-pad'}
            value={hostel.phoneNo}
            onChange={txt => setHostel({...hostel, phoneNo: txt})}
          />
          {/* <Input heading={'Rooms '} title="Enter Total Rooms" /> */}
          <Input
            heading={'Floor '}
            title="Enter Total Floor"
            value={hostel.floor}
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
          <Input
            heading={'Address '}
            title="Enter Address or choose from Google Map "
            value={hostel.address}
            multiline={true}
            onChange={txt => setHostel({...hostel, address: txt})}
          />
          <CustomButton
            title="Open Map"
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
          <FlatList
            data={oldImages}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            renderItem={item => {
              return (
                <View>
                  <TouchableOpacity
                    onPress={() => handleDeleteImage(item.item.Id)}
                    style={{
                      position: 'absolute',
                      top: 30,
                      right: 20,
                      zIndex: 999,
                    }}>
                    <MaterialIcons name={'delete'} color={'red'} size={30} />
                  </TouchableOpacity>
                  <Image
                    source={{uri: `${api.image}/${item.item.Image}`}}
                    style={{
                      ...styles.imageView,
                      width: SCREEN_WIDTH - 100,
                      height: 250,
                      marginHorizontal: 10,
                      backgroundColor: COLOR.primary,
                    }}
                  />
                </View>
              );
            }}
          />
          <CustomButton
            title="Add More Image"
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
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      let newData = imagesList.filter(
                        element => element.fileName !== item.item.fileName,
                      );
                      setImagesList(newData);
                    }}
                    style={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      zIndex: 999,
                    }}>
                    <EntypoIcon name={'cross'} color={'red'} size={50} />
                  </TouchableOpacity>
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
                </View>
              );
            }}
          />
        </View>
        <CustomButton
          title="Save"
          // onPress={() => getPositionFromAddress()}
          onPress={() => handleSubmit()}
          style={{marginBottom: 20, width: '87%'}}
        />
      </ScrollView>
    </ImageBackground>
  );
};

export default EditHostel;

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
