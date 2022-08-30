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

const password_regex1 =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,30}$/;

const NewPasswordScreen = () => {
  const { height, fontScale } = useWindowDimensions();
  const { code, setCode } = useState("");
  const { password, setPassword } = useState("");
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const pwd = watch("password");

  const onSignInPressed = () => {
    navigation.navigate("SignIn");
  };
  const onConfirmed = () => {
    navigation.navigate("SignIn");
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={[styles.header, { fontSize: fontScale * 30 }]}>
          Reset your Password
        </Text>
        <CustomInput
          name="code"
          control={control}
          placeholder="Confirmation Code"
          rules={{
            required: "Code is required",
            minLength: {
              value: 6,
              message: "Password should be 6 digits long",
            },
            maxLength: {
              value: 6,
              message: "Password should be 6 digits long",
            },
          }}
        />
        <CustomInput
          placeholder="Enter new Password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 5,
              message: "Password should be min 5 characters long",
            },
            maxLength: {
              value: 30,
              message: "Password should be max 30 characters long",
            },
            pattern: {
              value: password_regex1,
              message:
                "password should contain atleast one number and one special character",
            },
          }}
          name="password"
          control={control}
          secureTextEntry={true}
        />
        <CustomInput
          placeholder="Re-enter Password"
          rules={{
            required: "Enter password again",
            validate: (value) => value === pwd || "Passwords do not match",
          }}
          name="passwordRepeat"
          control={control}
          secureTextEntry={true}
        />
        <CustomButton
          type="primary"
          onPress={handleSubmit(onConfirmed)}
          text="Confirm"
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

export default NewPasswordScreen;
