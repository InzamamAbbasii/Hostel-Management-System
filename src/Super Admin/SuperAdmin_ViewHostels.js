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
const SuperAdmin_ViewHostels = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = query => setSearchQuery(query);
  return (
    <ScrollView>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <Card>
        <Card.Cover source={require('../../assests/images/2.jpg')} />
        <Card.Content>
          {/* <Title>Rs 11,000</Title> */}
          <Title>The Residence Boys Hostel </Title>
          <Paragraph>Dheri Hassanabad, Rawalpindi</Paragraph>
        </Card.Content>
      </Card>
      <Card>
        <Card.Cover source={require('../../assests/images/5.jpg')} />
        <Card.Content>
          {/* <Title>Rs 10,000</Title> */}
          <Title>Ibrahim Shaheed Boys Hostel</Title>
          <Paragraph>Satellite Town, Rawalpindi</Paragraph>
        </Card.Content>
      </Card>
      <Card>
        <Card.Cover source={require('../../assests/images/1.jpg')} />
        <Card.Content>
          {/* <Title>Rs 13,000</Title> */}
          <Title>Madina boys hostel</Title>
          <Paragraph>New Katarian, Rawalpindi</Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default SuperAdmin_ViewHostels;
