import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const MenuComponent = props => {
  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  return (
    <View
      style={{
        position: 'absolute',
        right: 40,
        top: 60,
        right: 5,
        backgroundColor: 'transparent',
        width: 'auto',
      }}>
      <Menu
        visible={visible}
        // style={{left: '5%', right: 5, top: 25}}
        anchor={
          <MaterialCommunityIcons
            name="dots-vertical"
            size={30}
            color={'#FFF'}
            onPress={showMenu}
          />
        }
        onRequestClose={() => setVisible(!visible)}>
        <MenuItem
          onPress={() => {
            setVisible(!visible);
            props.route.name !== 'SuperAdmin_ViewHostels' &&
              props.navigation.replace('SuperAdmin_ViewHostels');
          }}>
          <Text style={{color: '#000'}}>List View</Text>
        </MenuItem>
        <MenuItem
          onPress={() => {
            setVisible(!visible);
            props.route.name !== 'MapViewScreen' &&
              props.navigation.replace('MapViewScreen');
          }}>
          <Text style={{color: '#000'}}>Map View </Text>
        </MenuItem>
      </Menu>
    </View>
  );
};

export default MenuComponent;
