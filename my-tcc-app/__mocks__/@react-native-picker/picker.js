// __mocks__/@react-native-picker/picker.js
import React from "react";
import { View, Text } from "react-native";

// Mock do Picker para testes
const Picker = ({ selectedValue, onValueChange, children, enabled = true, numberOfLines = 1, style }) => (
  <View
    testID="mock-picker"
    style={style}
  >
    <Text>Selected: {selectedValue}</Text>
    {React.Children.map(children, child => {
      if (child.type === Picker.Item) {
        return <Text testID={`picker-item-${child.props.value}`}>{child.props.label}</Text>;
      }
      return null;
    })}
  </View>
);

Picker.Item = ({ label, value, style }) => (
  <View>
    <Text style={style}>{label}</Text>
  </View>
);

export { Picker };
