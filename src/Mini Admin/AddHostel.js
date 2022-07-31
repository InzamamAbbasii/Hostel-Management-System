import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {RadioButton} from 'react-native-paper';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;

const AddHostel = () => {
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* <ImageBackground
        source={require('../../assests/images/bg.png')}
        resizeMode={'stretch'}
        style={styles.backgroundImage}> */}
        <Text
          style={{
            color: '#000',
            fontSize: 28,
            marginTop: 10,
            marginBottom: 20,
            fontWeight: 'bold',
          }}>
          Add Hostel
        </Text>
        <View style={{flex: 1}}>
          <TextInput style={styles.textInput} placeholder="Enter Hostel Name" />
          <TextInput style={styles.textInput} placeholder="Enter Phone No" />
          <TextInput style={styles.textInput} placeholder="Rooms" />
          <TextInput style={styles.textInput} placeholder="Floor" />
          <Text style={{color: '#000', fontWeight: '500'}}>Facilites : </Text>
          <View
            style={{
              width: SCREEN_WIDTH - 30,
              backgroundColor: '#FFF',
              marginBottom: 10,
              borderColor: '#ccc',
              borderWidth: 1,
            }}>
            <View style={styles.rowView}>
              <View style={styles.rowView}>
                <RadioButton value="second" />
                <Text style={{fontSize: 16, color: '#000'}}>Wifi</Text>
              </View>
              <View style={styles.rowView}>
                <RadioButton value="second" />
                <Text style={{fontSize: 16, color: '#000'}}>Study Room</Text>
              </View>
              <View style={styles.rowView}>
                <RadioButton value="second" />
                <Text style={{fontSize: 16, color: '#000'}}>Mess</Text>
              </View>
            </View>
            <View style={styles.rowView}>
              <View style={styles.rowView}>
                <RadioButton value="second" />
                <Text style={{fontSize: 16, color: '#000'}}>Laundary</Text>
              </View>
              <View style={styles.rowView}>
                <RadioButton value="second" />
                <Text style={{fontSize: 16, color: '#000'}}>AC</Text>
              </View>
            </View>
          </View>
          <TextInput style={styles.textInput} placeholder="City" />
          <TextInput style={styles.textInput} placeholder="Address" />
          <View
            style={{
              height: 150,
              width: SCREEN_WIDTH - 30,
              backgroundColor: '#FFF',
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: '#ccc',
              borderWidth: 1,
            }}>
            <Text style={{color: '#000', fontSize: 16}}>Choose Image</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            alert('Hostel Added Successfully.Please wait for approvel.Thanks😍')
          }>
          <Text style={styles.btnText}>Submit</Text>
        </TouchableOpacity>
        {/* </ImageBackground> */}
      </View>
    </ScrollView>
  );
};

export default AddHostel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    width: SCREEN_WIDTH - 30,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 7,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#000',
    height: 50,
    width: SCREEN_WIDTH - 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
