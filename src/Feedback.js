import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';

const Feedback = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text
        style={{
          color: '#000',
          fontSize: 38,
          marginTop: 10,
          marginBottom: 20,
          fontWeight: 'bold',
        }}>
        Feedback
      </Text>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={require('../assests/images/redStr.png')}
          style={styles.ratingStar}
        />
        <Image
          source={require('../assests/images/redStr.png')}
          style={styles.ratingStar}
        />
        <Image
          source={require('../assests/images/redStr.png')}
          style={styles.ratingStar}
        />
        <Image
          source={require('../assests/images/whiteStr.png')}
          style={styles.ratingStar}
        />
        <Image
          source={require('../assests/images/whiteStr.png')}
          style={styles.ratingStar}
        />
      </View>
      <TextInput
        placeholder="Your Feedback here..."
        style={{
          //   height: 150,
          backgroundColor: '#fff',
          width: '85%',
          marginTop: 30,
          alignItems: 'flex-start',
          //   textAlign: 'justify',
          textAlignVertical: 'top',
        }}
        numberOfLines={10}
        multiline
      />
      <TouchableOpacity
        style={styles.btn}
        onPress={() => alert('Thanks for your feedback😍')}>
        <Text style={styles.btnText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#000',
    height: 50,
    width: '85%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  ratingStar: {
    height: 50,
    width: 50,
    margin: 3,
  },
});
