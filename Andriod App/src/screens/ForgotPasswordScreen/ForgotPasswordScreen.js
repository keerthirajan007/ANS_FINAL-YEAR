import {
  ScrollView,
  View,
  Text,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import CustomInput from "../../components/CustomInput/CustomInput";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";

const ForgotPassWordScreen = () => {
  const { height, fontScale } = useWindowDimensions();
  const { userName, setUserName } = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigation = useNavigation();
  const onSignInPressed = () => {
    navigation.navigate("SignIn");
  };
  const onFPPressed = (data) => {
    navigation.navigate("NewPassword");
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={[styles.header, { fontSize: fontScale * 30 }]}>
          Reset your Password
        </Text>
        <CustomInput
          placeholder="User Name"
          rules={{ required: "User Name is required" }}
          name="username"
          control={control}
        />
        <CustomButton
          type="primary"
          onPress={handleSubmit(onFPPressed)}
          text="Send"
        />
        <CustomButton
          type="tertiary"
          onPress={onSignInPressed}
          text="Back to Sign In"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    color: "blue",
    fontWeight: "bold",
    margin: 20,
  },
});

export default ForgotPassWordScreen;
