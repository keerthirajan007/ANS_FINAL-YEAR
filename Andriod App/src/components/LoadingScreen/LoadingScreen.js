import { View, Text } from "react-native";
import { CircleSnail } from "react-native-progress";
import React from "react";

const LoadingScreen = ({
  color,
  size,
  thickness,
  backgroundColor = "gray",
}) => {
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: backgroundColor,
      }}
    >
      <CircleSnail
        spinDuration={1300}
        color={color}
        size={size}
        thickness={thickness}
      />
    </View>
  );
};

export default LoadingScreen;
