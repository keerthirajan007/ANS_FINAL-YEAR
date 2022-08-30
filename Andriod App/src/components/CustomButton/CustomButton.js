import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";

const CustomButton = ({ disabled, onPress, text, type, bgColor, fgColor }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || false}
      style={[
        styles.container,
        styles["container_" + type],
        bgColor ? { backgroundColor: bgColor } : {},
        disabled ? { opacity: 0.7 } : {},
      ]}
    >
      <Text
        style={[
          styles.text,
          styles["text_" + type],
          fgColor ? { color: fgColor } : {},
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  container_primary: {
    backgroundColor: "#3b71f3",
  },
  container_secondary: {
    borderColor: "#3b71f3",
    borderWidth: 2,
  },
  container_tertiary: {},
  text: {
    fontWeight: "bold",
    color: "white",
  },
  text_tertiary: {
    color: "gray",
  },
  text_secondary: {
    color: "#3b71f3",
  },
});
export default CustomButton;
