import * as React from 'react';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Searchbar,
} from 'react-native-paper';
import {View, ScrollView} from 'react-native';
const VerifyHostels = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = query => setSearchQuery(query);
  return (
    <ScrollView>
      <Card style={{marginBottom: 7}}>
        <Card.Cover source={require('../../assests/images/2.jpg')} />
        <Card.Content>
          <Title>The Residence Boys Hostel </Title>
          <Paragraph>Phone No : 0311-xxxxxxxx</Paragraph>
          <Paragraph>City : Rawalpindi</Paragraph>
          <Paragraph>Total Rooms : 20</Paragraph>
          <Paragraph>Address : Dheri Hassanabad, Rawalpindi</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>Reject</Button>
          <Button>Accept</Button>
        </Card.Actions>
      </Card>
      <Card style={{marginBottom: 7}}>
        <Card.Cover source={require('../../assests/images/5.jpg')} />
        <Card.Content>
          <Title>Ibrahim Shaheed Boys Hostel</Title>
          <Paragraph>Phone No : 0311-xxxxxxxx</Paragraph>
          <Paragraph>City : Rawalpindi</Paragraph>
          <Paragraph>Total Rooms : 20</Paragraph>
          <Paragraph>Satellite Town, Rawalpindi</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>Reject</Button>
          <Button>Accept</Button>
        </Card.Actions>
      </Card>
      <Card style={{marginBottom: 7}}>
        <Card.Cover source={require('../../assests/images/1.jpg')} />
        <Card.Content>
          <Title>Madina boys hostel</Title>
          <Paragraph>Phone No : 0311-xxxxxxxx</Paragraph>
          <Paragraph>City : Rawalpindi</Paragraph>
          <Paragraph>Total Rooms : 20</Paragraph>
          <Paragraph>New Katarian, Rawalpindi</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>Reject</Button>
          <Button>Accept</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

export default VerifyHostels;
