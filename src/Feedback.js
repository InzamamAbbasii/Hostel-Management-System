import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Rating} from 'react-native-rating-element';
import {redStr, whiteStr, profile} from './CONSTANTS/images';
import {COLOR} from './CONSTANTS/Colors';
import CustomButton from './reuseable/CustomButton';
import {api} from './CONSTANTS/api';
import axios from 'axios';
import {TabRouter} from '@react-navigation/native';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import Loading from './reuseable/Loading';

const Feedback = ({navigation, route}) => {
  const [feedback, setFeedback] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [reviewsList, setReviewsList] = useState([]);
  const [messRating, setMessRating] = useState(0);
  const [facilitesList, setFacilitesList] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getFacilites();
  }, []);
  const getFacilites = () => {
    setLoading(true);
    axios
      .get(api.get_hostel_facilities, {params: {hostel_id: route.params.H_Id}})
      .then(response => {
        if (response.data && response.data !== false) {
          setFacilitesList([]);
          let facilites = response.data.toString().split(',');
          facilites?.forEach((element, index) => {
            setFacilitesList(data => [
              ...data,
              {
                Id: index,
                Name: element,
                Rating: 0,
              },
            ]);
          });
        } else {
          console.log('not found...');
        }
      })
      .catch(err => alert(err))
      .finally(() => setLoading(false));
  };

  const [starList, setStarList] = useState([
    {id: 0, Rated: false},
    {id: 1, Rated: false},
    {id: 2, Rated: false},
    {id: 3, Rated: false},
    {id: 4, Rated: false},
  ]);

  const handleonStarPress = element => {
    setShowFeedbackForm(true);
    const newData = starList.map((item, index) => {
      if (index <= element.id) {
        return {
          ...item,
          Rated: true,
        };
      } else {
        return {
          ...item,
          Rated: false,
        };
      }
    });
    setStarList(newData);
  };

  const handleSubmit = async () => {
    setLoading(true);
    let id = await AsyncStorage.getItem('user_id');
    const rating = starList.filter(item => item.Rated);
    const params = {
      User_Id: id,
      H_Id: route.params.H_Id,
      Rating: rating.length,
      Description: feedback,
    };
    axios
      .post(api.addFeedback, params)
      .then(response => {
        saveFacilitesFeedback(response.data);
        // alert('Thanks for your feedback😍');
        // getReviews();
        // navigation.replace('UserDashboard');
      })
      .catch(err => console.log(err));
  };
  const saveFacilitesFeedback = async feedbackId => {
    let id = await AsyncStorage.getItem('user_id');
    // let filter = facilitesList.filter(item => item.Rating > 0);
    let newData = facilitesList.map(item => {
      return {
        H_Id: route.params.H_Id,
        User_Id: id,
        Facility: item.Name,
        Rating: item.Rating,
        F_Id: feedbackId,
      };
    });
    console.log(newData);
    var headers = {
      'Content-Type': 'application/json',
    };

    fetch(api.add_feedback_facilities, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(newData),
    })
      .then(response => {
        if (response.status == 200) {
          return response.json();
        } else throw 'Something went wrong';
      })
      .then(response => {
        alert('Thanks for your feedback😍');
        // getReviews();
        navigation.replace('UserDashboard');
      })
      .catch(error => {
        alert(error);
      })
      .finally(() => setLoading(false));
  };
  // const LeftContent = props => <Avatar.Icon {...props} icon="folder" />;
  const LeftContent = props => (
    <Avatar.Image
      size={50}
      source={profile}
      style={{backgroundColor: '#FFF'}}
    />
  );
  const handleOnRating = (id, rating) => {
    const newData = facilitesList.map(item => {
      if (item.Id === id) {
        return {
          ...item,
          Rating: rating,
        };
      } else {
        return {...item};
      }
    });
    setFacilitesList(newData);
  };
  return (
    <ScrollView
      style={{backgroundColor: '#FFF', flex: 1}}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View>
          <Text
            style={{
              color: '#000',
              fontSize: 18,
              marginTop: 20,
              fontWeight: 'bold',
              textAlign: 'left',
              marginLeft: 25,
            }}>
            Rate This Hostel
          </Text>
          <Text
            style={{
              color: '#000',
              fontSize: 12,
              marginLeft: 25,
            }}>
            Tell others what you think
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 5,
            }}>
            {starList.map((element, key) => {
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => {
                    handleonStarPress(element);
                  }}>
                  <Image
                    source={whiteStr}
                    resizeMode="center"
                    style={{
                      height: 40,
                      width: 40,
                      tintColor: element.Rated ? COLOR.secondary : '#C4C4C4',
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <View>
            <Text
              style={{
                color: '#000',
                fontSize: 18,
                marginTop: 20,
                fontWeight: 'bold',
                textAlign: 'left',
                marginLeft: 20,
              }}>
              Rate Hostel Facilites :
            </Text>
            {facilitesList.map((item, index) => {
              return (
                <View key={index} style={{marginLeft: 20, marginTop: 10}}>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}>
                    {item.Name} :
                  </Text>
                  <View style={{alignSelf: 'center'}}>
                    <Rating
                      rated={item.Rating}
                      totalCount={5}
                      ratingColor="#f1c644"
                      ratingBackgroundColor="#d4d4d4"
                      size={30}
                      readonly={false} // by default is false
                      icon="ios-star"
                      direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                      onIconTap={rating => handleOnRating(item.Id, rating)}
                    />
                  </View>
                </View>
              );
            })}
          </View>
          {!showFeedbackForm && (
            <TouchableOpacity onPress={() => setShowFeedbackForm(true)}>
              <Text
                style={{
                  color: 'green',
                  fontSize: 16,
                  fontWeight: '600',
                  marginTop: 10,
                  marginLeft: 25,
                }}>
                Write a review
              </Text>
            </TouchableOpacity>
          )}
          {showFeedbackForm && (
            <View>
              <TextInput
                placeholder="Your Feedback here...  (Optional)"
                style={{
                  backgroundColor: '#fff',
                  width: '85%',
                  marginTop: 30,
                  alignItems: 'flex-start',
                  textAlignVertical: 'top',
                  alignSelf: 'center',
                  borderWidth: 1,
                  borderColor: COLOR.secondary,
                  borderRadius: 10,
                  padding: 10,
                }}
                numberOfLines={10}
                multiline
                onChangeText={text => setFeedback(text)}
              />
              {starList.filter(item => item.Rated).length === 0 ? (
                <TouchableOpacity
                  style={{...styles.btn, backgroundColor: '#C4C4C4'}}
                  disabled
                  onPress={() => handleSubmit()}>
                  <Text style={styles.btnText}>Submit</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => handleSubmit()}>
                  <Text style={styles.btnText}>Submit</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
      {loading && <Loading style={{top: -80}} />}
    </ScrollView>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    // alignItems: 'center',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: COLOR.secondary,
    height: 50,
    width: '85%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    alignSelf: 'center',
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
