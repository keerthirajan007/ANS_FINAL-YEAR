import { View, Text, StyleSheet } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import MapView, { Geojson, PROVIDER_GOOGLE } from "react-native-maps";
import CurrentMarker from "./CurrentMarker";
import * as Location from "expo-location";
import { WebView } from "react-native-webview";

import {
  PopupWindow,
  setModalData,
  setModalVisible,
  isModalVisible,
  setZoneDescription,
  setWebHeight,
  webHeight,
} from "./PopupWindow";

const webViewScript = `
  setTimeout(function() { 
    window.postMessage(document.documentElement.scrollHeight); 
  }, 500);
  true; // note: this is required, or you'll sometimes get silent failures
`;

let tempRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};
import { data as USER_DATA } from "./ZonesScreen";

const type_mapper = {
  inside: "Intrusion Alert Zone",
  outside: "Exit Alert Zone",
};

export let region;
export let setRegion;

const MapViewer = ({ data }) => {
  const map = useRef(null);
  [region, setRegion] = useState(tempRegion);

  let n = Object.keys(data);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      if (!USER_DATA.current_location) {
        let location = await Location.getCurrentPositionAsync({});
        USER_DATA.current_location = location.coords;
        setRegion({
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleGeoJsonOnPress = (data) => {
    let t = data.feature.properties;
    setModalData([
      [<Text style={styles.key}>Zone</Text>, t.zone_name],
      [<Text style={styles.key}>Type</Text>, type_mapper[t.zone_type]],
      [<Text style={styles.key}>Area</Text>, t.area_address],
      [<Text style={styles.key}>Grouped By </Text>, t.group],
      [<Text style={styles.key}>Created By</Text>, t.officer_name],
      [<Text style={styles.key}>Last Modified</Text>, t.modified],
    ]);
    setZoneDescription(
      <WebView
        style={{ height: webHeight }}
        originWhitelist={["*"]}
        scalesPageToFit={false}
        onMessage={(event) => {
          setWebHeight(parseInt(event.nativeEvent.data));
        }}
        javaScriptEnabled={true}
        injectedJavaScript={webViewScript}
        domStorageEnabled={true}
        source={{ html: t.description || "" }}
      />
    );
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={map}
        region={region}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        loadingEnabled={true}
        onRegionChange={(r) => (tempRegion = r)}
      >
        {n.map((e, i) => {
          let l = data[e].meta.layer;
          let s = l.style;
          return (
            <Geojson
              tappable={true}
              key={"geojson-" + i}
              geojson={l.data}
              strokeColor={s.color}
              strokeWidth={s.width}
              fillColor={s.fillColor + "80"}
              onPress={handleGeoJsonOnPress}
            />
          );
        })}
        <CurrentMarker
          latitude={region.latitude}
          longitude={region.longitude}
          mapRef={map}
        />
      </MapView>
      <PopupWindow />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  key: {
    color: "#3b71f3",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MapViewer;
