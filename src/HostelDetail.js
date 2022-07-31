import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

const HostelDetail = ({navigation, route}) => {
  return (
    <View style={styles.container}>
      <Image source={route.params.image} style={styles.image} />
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
      </TouchableOpacity>
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
