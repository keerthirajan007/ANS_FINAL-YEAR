import {
  ScrollView,
  View,
  Text,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import CustomInput from "../../components/CustomInput/CustomInput";
import React, { useState } from "react";
import { Switch } from "react-native";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { validateUser } from "../../../rest_controller";
import { CircleSnail } from "react-native-progress";

const SignInScreen = () => {
  const { height, fontScale } = useWindowDimensions();
  const navigation = useNavigation();
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState("Sign In");
  const [hidePassword, setHidePassword] = useState(true);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSignInPressed = (data) => {
    setLoading(<CircleSnail color={["white"]} size={30} />);
    setDisabled(true);
    validateUser(data)
      .then((res) => {
        setLoading("Sign In");
        setDisabled(false);
        if (res === true) {
          navigation.navigate("Zones");
        } else {
          setError(res);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const onSignUpPressed = () => {
    navigation.navigate("SignUp");
  };
  const onFPPressed = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={[styles.header, { fontSize: fontScale * 30 }]}>
          Sign In
        </Text>

        <CustomInput
          placeholder="User Name"
          rules={{ required: "User Name is required" }}
          name="username"
          control={control}
        />

        <CustomInput
          name="password"
          rules={{ required: "Password is required" }}
          control={control}
          placeholder="Password"
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
        <Text style={{ color: "red" }}>{error}</Text>
        <CustomButton
          type="primary"
          onPress={handleSubmit(onSignInPressed)}
          disabled={disabled}
          text={loading}
        />
        <CustomButton
          type="tertiary"
          onPress={onFPPressed}
          text="Forgot Password?"
        />
        <CustomButton
          type="tertiary"
          onPress={onSignUpPressed}
          text="Don't have an account?"
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

export default SignInScreen;
