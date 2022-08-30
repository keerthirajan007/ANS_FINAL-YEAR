import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import LoadingScreen from "../../components/LoadingScreen";
import { Auth } from "../../../rest_controller";

const ProfileScreen = () => {
  const [profile, setProfile] = useState(
    <LoadingScreen thickness={7} color={["white"]} size={90} />
  );

  return (
    <>
      <Auth
        callback={(data) =>
          setProfile(
            <View
              style={{
                padding: 15,
                margin: 10,
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text style={styles.head}>User Name : </Text>
                <Text style={styles.data}>{data.user_name}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.head}>Email Id : </Text>
                <Text style={styles.data}>{data.user_mail}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.head}>Mobile : </Text>
                <Text style={styles.data}>{data.user_phone}</Text>
              </View>
            </View>
          )
        }
      />
      <View style={{ width: "100%", height: "100%" }}>{profile}</View>
    </>
  );
};

const styles = StyleSheet.create({
  head: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#3b71f3",
  },
  data: {
    fontSize: 25,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
