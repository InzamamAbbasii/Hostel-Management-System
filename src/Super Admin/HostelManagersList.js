import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, ImageBackground, FlatList} from 'react-native';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import axios from 'axios';
import {api} from '../CONSTANTS/api';
import CustomHeader from '../reuseable/CustomHeader';
import {bg, profile} from '../CONSTANTS/images';
const LeftContent = props => (
  <Avatar.Image size={44} source={profile} style={{backgroundColor: '#FFF'}} />
);
const HostelManagersList = ({navigation}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getHostelManagersList();
  }, []);

  const getHostelManagersList = () => {
    axios
      .get(api.get_HostelManagers_List)
      .then(res => setData(res.data))
      .catch(err => err);
  };
  return (
    <ImageBackground
      source={bg}
      style={{
        ...StyleSheet.absoluteFillObject,
        paddingHorizontal: 16,
      }}>
      <CustomHeader text="Hostel Managers" navi={navigation} />
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.Id.toString()}
        renderItem={item => {
          return (
            <Card
              style={{marginVertical: 5, borderRadius: 15, elevation: 1}}
              onPress={() =>
                navigation.navigate('VerifyHostels', {Id: item.item.Id})
              }>
              <Card.Title
                title={`${item.item.FirstName} ${item.item.LastName}`}
                left={LeftContent}
              />
            </Card>
          );
        }}
      />
    </ImageBackground>
  );
};

export default HostelManagersList;

const styles = StyleSheet.create({});
