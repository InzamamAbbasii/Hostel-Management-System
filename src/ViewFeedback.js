import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  Dimensions,
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
const SCREEN_WIDTH = Dimensions.get('screen').width;
const ViewFeedback = ({navigation, route}) => {
  const [feedback, setFeedback] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [reviewsList, setReviewsList] = useState([]);
  const [messRating, setMessRating] = useState(0);
  const [facilitesList, setFacilitesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [averageRatingList, setAverageRatingList] = useState('');
  const [hostelName, setHostelName] = useState('');
  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = () => {
    setLoading(true);
    axios
      .get(api.get_Rating_and_Reviews, {params: {id: route.params.H_Id}})
      .then(response => {
        setReviewsList(response.data.UserRatingList);
        setHostelName(response.data.HostelName);
        setAverageRatingList(response.data.AverageRatingList);
      })
      .catch(err => alert(err))
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

  return (
    <ScrollView
      style={{backgroundColor: '#FFF', flex: 1}}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {loading && <Loading style={{top: 0}} />}

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
          {reviewsList.length == 0 && !loading ? (
            <Text style={{fontSize: 16, textAlign: 'center', color: 'red'}}>
              Not rated yet
            </Text>
          ) : (
            <View>
              <Card
                style={{
                  marginBottom: 7,
                  marginHorizontal: 20,
                  borderRadius: 10,
                  borderWidth: 0.5,
                  borderColor: COLOR.secondary,
                }}>
                <View style={{marginHorizontal: 25}}>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 18,
                      marginTop: 10,
                      fontWeight: 'bold',
                      textAlign: 'left',
                    }}>
                    {hostelName}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Rating
                      rated={averageRatingList?.AverageRating}
                      totalCount={5}
                      ratingColor="#f1c644"
                      ratingBackgroundColor="#d4d4d4"
                      size={15}
                      readonly // by default is false
                      icon="ios-star"
                      direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                    />
                    <Paragraph>
                      Rating:{averageRatingList.AverageRating}(
                      {averageRatingList.TotalReviews} reviews)
                    </Paragraph>
                  </View>
                </View>
                {averageRatingList?.Feedback_Facilites?.length == 0 ? (
                  <Text
                    style={{fontSize: 16, textAlign: 'center', color: 'red'}}>
                    Facilites are Not rated yet
                  </Text>
                ) : (
                  <View style={{marginHorizontal: 25, marginBottom: 10}}>
                    <Text
                      style={{
                        color: COLOR.secondary,
                        fontSize: 18,
                        marginTop: 10,
                        fontWeight: 'bold',
                        textAlign: 'left',
                      }}>
                      Facilites Ratings :
                    </Text>
                    {averageRatingList.Feedback_Facilites?.map(
                      (element, index1) => {
                        return (
                          <View
                            key={index1}
                            style={{
                              marginTop: 10,
                            }}>
                            <Text
                              style={{
                                color: '#000',
                                fontSize: 12,
                                fontWeight: 'bold',
                              }}>
                              {element?.Facility} :
                            </Text>
                            <View style={{flexDirection: 'row'}}>
                              <Rating
                                rated={element?.Ratings?.AverageRating_f}
                                totalCount={5}
                                ratingColor="#f1c644"
                                ratingBackgroundColor="#d4d4d4"
                                size={20}
                                readonly // by default is false
                                icon="ios-star"
                                direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                              />
                              <Paragraph>
                                Rating:{element.Ratings.AverageRating_f}(
                                {element.Ratings.TotalReviews_f} reviews)
                              </Paragraph>
                            </View>
                          </View>
                        );
                      },
                    )}
                  </View>
                )}
              </Card>
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
                Rating Detail :
              </Text>
              <FlatList
                data={reviewsList}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                renderItem={item => {
                  return (
                    <Card
                      style={{
                        marginBottom: 7,
                        marginHorizontal: 20,
                        borderRadius: 10,
                        backgroundColor: COLOR.primary,
                        width: SCREEN_WIDTH * 0.9,
                      }}>
                      <Card.Title
                        title={item.item.Name}
                        titleStyle={{color: '#FFF'}}
                        subtitle={
                          <Rating
                            rated={item.item.Rating}
                            totalCount={5}
                            ratingColor="#f1c644"
                            ratingBackgroundColor="#FFF"
                            size={15}
                            readonly // by default is false
                            icon="ios-star"
                            direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                          />
                        }
                        left={LeftContent}
                      />
                      <View style={{marginHorizontal: 25, marginBottom: 10}}>
                        {item?.item?.Facilities?.map((element, index1) => {
                          return (
                            <View
                              key={index1}
                              style={{
                                marginTop: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}>
                              <Text
                                style={{
                                  color: '#000',
                                  fontSize: 12,
                                  fontWeight: 'bold',
                                }}>
                                {element.Facility} :
                              </Text>

                              <Rating
                                rated={element.Rating}
                                totalCount={5}
                                ratingColor="#f1c644"
                                ratingBackgroundColor="#d4d4d4"
                                size={20}
                                readonly // by default is false
                                icon="ios-star"
                                direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                              />
                            </View>
                          );
                        })}
                      </View>
                      {item.item.Description && (
                        <Paragraph style={{marginLeft: 25, color: '#FFF'}}>
                          {item.item.Description}
                        </Paragraph>
                      )}
                    </Card>
                  );
                }}
              />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ViewFeedback;

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
