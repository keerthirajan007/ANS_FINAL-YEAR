import { Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { data } from "./ZonesScreen";
import { doGeofence } from "../../../geofence";

const CurrentMarker = ({ mapRef, latitude, longitude }) => {
  const [location, setLocation] = useState({
    latitude: latitude,
    longitude: longitude,
  });

  const [pinColor, setPinColor] = useState("green");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      setInterval(async () => {
        let location = await Location.getCurrentPositionAsync({});
        // console.log(mapRef);
        await doGeofence("foreground-fetch", (inDanger) => {
          // console.log(inDanger);
          data.current_location = location.coords;
          setLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          if (inDanger) setPinColor("red");
          else setPinColor("green");
        });
      }, 5000);
    })();
  }, []);
  return (
    <>
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        pinColor={pinColor}
      >
        <Callout>
          <Text>
            Your Location : {location.latitude},{location.longitude}
          </Text>
        </Callout>
      </Marker>
    </>
  );
};

export default CurrentMarker;
