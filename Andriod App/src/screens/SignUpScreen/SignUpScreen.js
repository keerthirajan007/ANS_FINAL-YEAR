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
import { useForm } from "react-hook-form";
import { addUser } from "../../../rest_controller";
import { CircleSnail } from "react-native-progress";
import { Switch } from "react-native";

const email_regex =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const phone_regex = /^[6-9]\d{9}$/;

const password_regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,30}$/;

const SignUpScreen = () => {
  const { height, fontScale } = useWindowDimensions();
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState("Register");
  const [hidePassword, setHidePassword] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const pwd = watch("password");

  const navigation = useNavigation();
  const onSignInPressed = () => {
    navigation.navigate("SignIn");
  };
  const onSignUpPressed = (data) => {
    setLoading(<CircleSnail color={["white"]} size={30} />);
    setDisabled(true);
    addUser(data)
      .then((res) => {
        setLoading("Register");
        setDisabled(false);
        if (res === true) {
          navigation.navigate("SignIn");
        } else {
          setError(res);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={[styles.header, { fontSize: fontScale * 30 }]}>
          Sign Up
        </Text>
        <CustomInput
          placeholder="User Name"
          rules={{
            required: "User Name is required",
            minLength: {
              value: 5,
              message: "Username should be min 5 characters long",
            },
            maxLength: {
              value: 30,
              message: "Username should be max 30 characters long",
            },
          }}
          name="username"
          control={control}
        />
        <CustomInput
          placeholder="Email"
          rules={{
            required: "Email is required",
            pattern: { value: email_regex, message: "Email is invalid" },
          }}
          name="email"
          control={control}
        />

        <CustomInput
          placeholder="Phone"
          rules={{
            required: "Phone no is required",
            minLength: { value: 10, message: "Phone no should be 10 digits" },
            maxLength: { value: 10, message: "Phone no should be 10 digits" },
            pattern: { value: phone_regex, message: "Phone no is invalid" },
          }}
          name="phone"
          control={control}
        />

        <CustomInput
          placeholder="Password"
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
              value: password_regex,
              message:
                "password should contain atleast one number and one special character",
            },
          }}
          name="password"
          control={control}
          secureTextEntry={hidePassword}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Switch
            onValueChange={(value) => setHidePassword(!value)}
            value={!hidePassword}
          />
          <Text>Show Password</Text>
        </View>
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
        <Text style={{ color: "red" }}>{error}</Text>
        <CustomButton
          disabled={disabled}
          type="primary"
          onPress={handleSubmit(onSignUpPressed)}
          text={loading}
        />
        <Text style={styles.agree}>
          By registering that you accept our Terms of use and Privacy Policy
        </Text>
        <CustomButton
          type="tertiary"
          onPress={onSignInPressed}
          text="Already have an account?"
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
  agree: {
    color: "gray",
  },
});

export default SignUpScreen;
