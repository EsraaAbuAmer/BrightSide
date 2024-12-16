import React from 'react';
import { TextInput as RNTextInput, StyleSheet, TextInputProps, View } from 'react-native';

// Extend TextInputProps to allow all default props plus custom ones
interface CustomTextInputProps extends TextInputProps {
  borderColor?: string; // Optional prop to customize border color
}

const TextInput: React.FC<CustomTextInputProps> = ({
  borderColor = '#ccc',
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, { borderColor }]}>
      <RNTextInput style={[styles.input, style]} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor:'#F5F2F2',
    padding:5,
  },
  input: {
    height: 40,
    fontSize: 16,
    
  },
});

export default TextInput;