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
const BookingRequest = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = query => setSearchQuery(query);
  return (
    <ScrollView>
      <Card style={{marginBottom: 7}}>
        {/* <Card.Cover source={require('../../assests/images/1.jpg')} /> */}
        <Card.Content>
          {/* <Title>Rs 11,000</Title> */}
          <Title> Hassan Ali</Title>
          <Paragraph>Phone No : 0311-xxxxxxxx</Paragraph>
          <Paragraph>Booking Date : 24-08-2022</Paragraph>
          <Paragraph>Check Out : 24-08-2022</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>Reject</Button>
          <Button>Accept</Button>
        </Card.Actions>
      </Card>
      <Card style={{marginBottom: 7}}>
        {/* <Card.Cover source={require('../../assests/images/1.jpg')} /> */}
        <Card.Content>
          {/* <Title>Rs 11,000</Title> */}
          <Title> Bilal Abbasi</Title>
          <Paragraph>Phone No : 0311-xxxxxxxx</Paragraph>
          <Paragraph>Booking Date : 24-08-2022</Paragraph>
          <Paragraph>Check Out : 24-08-2022</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>Reject</Button>
          <Button>Accept</Button>
        </Card.Actions>
      </Card>
      <Card style={{marginBottom: 7}}>
        {/* <Card.Cover source={require('../../assests/images/1.jpg')} /> */}
        <Card.Content>
          {/* <Title>Rs 11,000</Title> */}
          <Title> Saim Ali</Title>
          <Paragraph>Phone No : 0311-xxxxxxxx</Paragraph>
          <Paragraph>Booking Date : 24-08-2022</Paragraph>
          <Paragraph>Check Out : 24-08-2022</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>Reject</Button>
          <Button>Accept</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

export default BookingRequest;
