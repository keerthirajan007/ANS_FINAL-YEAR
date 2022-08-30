import React, { useState } from "react";
import { Auth, logOut } from "../../../rest_controller";
import ProfileScreen from "../ProfileScreen";
import ZonesScreen from "../ZonesScreen";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";
import Modal from "react-native-modal";
import {
  View,
  StyleSheet,
  Button,
  Pressable,
  ScrollView,
  Text,
} from "react-native";
import { get_near_zones } from "../../../rest_controller";
import LoadingScreen from "../../components/LoadingScreen";

const Drawer = createDrawerNavigator();

const Home = () => {
  return (
    <>
      <Auth />
      <Drawer.Navigator
        initialRouteName="Zones"
        drawerContent={(props) => {
          return (
            <DrawerContentScrollView {...props}>
              <DrawerItemList {...props} />
              <DrawerItem
                label="Logout"
                onPress={() => {
                  logOut().then(() => {
                    props.navigation.navigate("SignIn");
                  });
                }}
              />
            </DrawerContentScrollView>
          );
        }}
      >
        <Drawer.Screen
          options={{ headerTitle: (props) => <ZoneHeader /> }}
          name="Zones"
          component={ZonesScreen}
        />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
      </Drawer.Navigator>
    </>
  );
};

export let nearZonesModalData;
export let setNearZonesModalData;

function ZoneHeader() {
  [nearZonesModalData, setNearZonesModalData] = React.useState(
    <LoadingScreen
      backgroundColor="white"
      thickness={4}
      color={["#3b71f3"]}
      size={40}
    />
  );
  const [isNearZonesModalVisible, setNearZonesModalVisible] =
    React.useState(false);

  const toggleModal = () => {
    setNearZonesModalVisible(!isNearZonesModalVisible);
  };

  const setNearZones = () => {
    toggleModal();

    get_near_zones((tempData) => {
      setNearZonesModalData(
        <View style={tableStyles.container}>
          <Collapse>
            <CollapseHeader>
              <View>
                <Text style={tableStyles.title}>Zones within 1km</Text>
              </View>
            </CollapseHeader>
            <CollapseBody>
              <View style={tableStyles.body}>{tempData.z1km}</View>
            </CollapseBody>
          </Collapse>
          <Collapse>
            <CollapseHeader>
              <View>
                <Text style={tableStyles.title}>Zones within 5km</Text>
              </View>
            </CollapseHeader>
            <CollapseBody>
              <View style={tableStyles.body}>{tempData.z5km}</View>
            </CollapseBody>
          </Collapse>
          <Collapse>
            <CollapseHeader>
              <View>
                <Text style={tableStyles.title}>Zones within 10km</Text>
              </View>
            </CollapseHeader>
            <CollapseBody>
              <View style={tableStyles.body}>{tempData.z10km}</View>
            </CollapseBody>
          </Collapse>
          <Collapse>
            <CollapseHeader>
              <View>
                <Text style={tableStyles.title}>Zones within 50km</Text>
              </View>
            </CollapseHeader>
            <CollapseBody>
              <View style={tableStyles.body}>{tempData.z50km}</View>
            </CollapseBody>
          </Collapse>
          <Collapse>
            <CollapseHeader>
              <View>
                <Text style={tableStyles.title}>Zones within 100km</Text>
              </View>
            </CollapseHeader>
            <CollapseBody>
              <View style={tableStyles.body}>{tempData.z100km}</View>
            </CollapseBody>
          </Collapse>
        </View>
      );
    }, setNearZonesModalVisible);
  };

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ fontWeight: "bold" }}>Zones</Text>
      <View>
        <Button title="Zones Near Me" onPress={setNearZones} />
      </View>
      <Modal
        isVisible={isNearZonesModalVisible}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        onBackdropPress={toggleModal}
        backdropOpacity={0}
        backdropTransitionOutTiming={600}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: "white", maxHeight: "80%" }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                color: "#3b71f3",
                marginHorizontal: 10,
              }}
            >
              Zones Near Me
            </Text>
            <Pressable
              onPress={toggleModal}
              style={{
                backgroundColor: "#3b71f3",
                borderRadius: 30,
                width: 30,
                height: 30,
              }}
            >
              <Text
                style={{
                  textAlignVertical: "center",
                  fontSize: 20,
                  color: "white",
                  textAlign: "center",
                }}
              >
                x
              </Text>
            </Pressable>
          </View>
          {nearZonesModalData}
        </ScrollView>
      </Modal>
    </View>
  );
}

const tableStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    maxHeight: "100%",
  },
  head: {},
  title: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f1f8ff",
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#f1f9ff",
  },
  body: { flex: 1, backgroundColor: "white", padding: 5 },
  wrapper: { flexDirection: "row" },
  row: { height: 28 },
  text: { textAlign: "center" },
  close: {
    backgroundColor: "#3b71f3",
    borderRadius: 50,
    padding: 8,
    width: 35,
  },
});

export default Home;
