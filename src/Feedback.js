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

import {Rating} from 'react-native-rating-element';
import {redStr, whiteStr, profile} from './CONSTANTS/images';
import {COLOR} from './CONSTANTS/Colors';
import CustomButton from './reuseable/CustomButton';
import {api} from './CONSTANTS/api';
import axios from 'axios';
import {TabRouter} from '@react-navigation/native';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';

const Feedback = ({navigation, route}) => {
  const [feedback, setFeedback] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [reviewsList, setReviewsList] = useState([]);
  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = () => {
    axios
      .get(api.get_Rating_and_Reviews, {params: {id: route.params.H_Id}})
      .then(response => {
        setReviewsList(response.data);
      })
      .catch(err => alert(err));
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

  const handleSubmit = () => {
    const rating = starList.filter(item => item.Rated);
    console.log(rating.length, feedback);
    const params = {
      User_Id: global.user_id,
      H_Id: route.params.H_Id,
      Rating: rating.length,
      Description: feedback,
    };
    console.log(route.params);
    axios
      .post(api.addFeedback, params)
      .then(response => {
        alert('Thanks for your feedback😍');
        getReviews();
      })
      .catch(err => console.log(err));
  };
  // const LeftContent = props => <Avatar.Icon {...props} icon="folder" />;
  const LeftContent = props => (
    <Avatar.Image
      size={50}
      source={profile}
      style={{backgroundColor: '#FFF'}}
    />
  );

  return (
    <ScrollView
      style={{backgroundColor: '#FFF'}}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {route.params?.AddFeedback === true && (
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
        )}

        <Text
          style={{
            color: '#000',
            fontSize: 18,
            marginTop: 10,
            marginBottom: 20,
            fontWeight: 'bold',
            textAlign: 'left',
            marginLeft: 25,
          }}>
          Rating and Reviews
        </Text>
        <View>
          {reviewsList.length == 0 ? (
            <Text style={{fontSize: 16, textAlign: 'center', color: 'red'}}>
              Not rated yet
            </Text>
          ) : (
            reviewsList.map((item, key) => {
              return (
                <Card
                  key={key}
                  style={{
                    marginBottom: 7,
                    marginHorizontal: 20,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: COLOR.secondary,
                  }}>
                  <Card.Title
                    title={item.Name}
                    subtitle={
                      <Rating
                        rated={item.Rating}
                        totalCount={5}
                        ratingColor="#f1c644"
                        ratingBackgroundColor="#d4d4d4"
                        size={15}
                        readonly // by default is false
                        icon="ios-star"
                        direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                      />
                    }
                    left={LeftContent}
                  />

                  {item.Description && (
                    <Paragraph style={{marginLeft: 25}}>
                      {item.Description}
                    </Paragraph>
                  )}
                </Card>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    // alignItems: 'center',
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
