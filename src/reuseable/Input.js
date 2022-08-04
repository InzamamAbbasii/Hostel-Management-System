import React, {useState, useEffect} from 'react';
import {View, Text, TextInput} from 'react-native';
import {COLOR} from '../CONSTANTS/Colors';
import {fonts} from '../CONSTANTS/fonts';
const Input = ({
  bgStyle,
  onChange,
  icon,
  title,
  keyboardType,
  heading,
  txtStyle,
  multiline,
  value,
}) => {
  // const [value, setValue] = useState('');

  return (
    <View>
      <View>
        <Text
          style={{
            marginTop: 10,
            marginLeft: 3,
            fontSize: 15,
            fontFamily: fonts.regular,
            color: '#303030',
          }}>
          {heading}
        </Text>
      </View>
      <View
        style={{
          borderWidth: 1,
          borderColor: '#E5E0EB',
          borderRadius: 7,
          marginTop: 4,
          // height: 44,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLOR.white,
        }}>
        <TextInput
          style={{
            ...txtStyle,
            padding: 5,
            textAlignVertical: 'center',
            flex: 1,
            fontFamily: fonts.regular,
            marginTop: 5,
            color: 'black',
            marginLeft: 5,
            // height: 38,
          }}
          value={value}
          placeholder={title}
          placeholderColor="#ABA7AF"
          keyboardType={keyboardType}
          multiline={multiline}
          // onChangeText={onChangeText}
          onChangeText={txt => handleonTextChange(txt)}
        />
        <View style={{marginRight: 13}}>{icon}</View>
      </View>
    </View>
  );

  function handleonTextChange(txt) {
    // setValue(txt);
    onChange && onChange(txt);
  }
};

export default Input;
