import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { colors } from "./colors";
import { data as USER_DATA } from "./src/screens/ZonesScreen/ZonesScreen";
import { setRegion, region } from "./src/screens/ZonesScreen/MapViewer";
import { Text, Pressable, StyleSheet } from "react-native";

export async function addUser(data) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: data.username,
      password: data.password,
      email: data.email,
      phone: data.phone,
    }),
  };
  const res = await (
    await fetch(
      "http://fypams.000webhostapp.com/rest_addUser.php",
      requestOptions
    )
  ).json();
  if (res.status == "success") {
    return true;
  } else {
    return res.reason;
  }
}
export async function validateUser(data) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: data.username, password: data.password }),
  };
  const res = await (
    await fetch(
      "http://fypams.000webhostapp.com/rest_validateUser.php",
      requestOptions
    )
  ).json();
  if (res.status == "success") {
    await AsyncStorage.setItem("auth_data", JSON.stringify(res.data));
  } else {
    return res.reason;
  }
  return true;
}

export function Auth({ callback = () => {} }) {
  const navigation = useNavigation();
  authUser().then((data) => {
    if (data === null) {
      navigation.navigate("SignIn");
    } else {
      data = JSON.parse(data);
      callback(data);
    }
  });
  return <></>;
}

export async function logOut() {
  await AsyncStorage.removeItem("auth_data");
  return true;
}

export async function authUser() {
  return await AsyncStorage.getItem("auth_data");
}

export async function getAllZones() {
  let t = util.classify(
    await (
      await fetch("http://fypams.000webhostapp.com/get_all_zones.php")
    ).json(),
    "group"
  );

  let n = Object.keys(t);

  n.forEach((e) => {
    let temp = colors.getNextColor();
    if (temp.length < 7) temp += "0000000".substring(0, 7 - temp.length);
    t[e] = {
      meta: {
        color: temp,
        layer: makeGeoJSONObject(t[e], temp),
        isHidden: false,
        isIncluded: true,
      },
      layers: t[e],
    };
  });
  return t;
}

function makeGeoJSONObject(featureCollection, color) {
  let temp = featureCollection.map((e, i) => {
    return {
      type: "Feature",
      geometry: JSON.parse(e.geometry),
      properties: {
        zone_name: e.zone_name,
        zone_type: e.zone_type,
        area_address: e.area_address,
        officer_name: e.officer_name,
        modified: e.modified,
        group: e.group_name,
        description: e.description,
      },
    };
  });
  return {
    data: { type: "FeatureCollection", features: temp },
    style: {
      fillColor: color,
      fillOpacity: 0.5,
      color: color,
      opacity: 1,
      weight: 2,
    },
  };
}

export async function get_near_zones(callback, setNearZonesModalVisible) {
  let temp = {
    z1km: <Text>Currently there are no zones available..</Text>,
    z5km: <Text>Currently there are no zones available..</Text>,
    z10km: <Text>Currently there are no zones available..</Text>,
    z50km: <Text>Currently there are no zones available..</Text>,
    z100km: <Text>Currently there are no zones available..</Text>,
    zothers: <Text>Currently there are no zones available..</Text>,
  };
  let latitude = USER_DATA.current_location.latitude;
  let longitude = USER_DATA.current_location.longitude;

  let _1km = await (
    await fetch(
      `http://fypams.000webhostapp.com/get_near_zones.php?lat=${latitude}&long=${longitude}&radius=${1}`
    )
  ).json();
  let _5km = await (
    await fetch(
      `http://fypams.000webhostapp.com/get_near_zones.php?lat=${latitude}&long=${longitude}&radius=${5}`
    )
  ).json();
  let _10km = await (
    await fetch(
      `http://fypams.000webhostapp.com/get_near_zones.php?lat=${latitude}&long=${longitude}&radius=${10}`
    )
  ).json();
  let _50km = await (
    await fetch(
      `http://fypams.000webhostapp.com/get_near_zones.php?lat=${latitude}&long=${longitude}&radius=${50}`
    )
  ).json();
  let _100km = await (
    await fetch(
      `http://fypams.000webhostapp.com/get_near_zones.php?lat=${latitude}&long=${longitude}&radius=${100}`
    )
  ).json();

  let componentArray = [];

  if (_1km.length > 0) {
    componentArray = _1km.map((e, i) =>
      nearZoneModalListElement(e, i, setNearZonesModalVisible)
    );
    temp.z1km = componentArray || temp.z1km;
  }
  if (_5km.length > 0) {
    componentArray = _5km.map((e, i) =>
      nearZoneModalListElement(e, i, setNearZonesModalVisible)
    );
    temp.z5km = componentArray || temp.z5km;
  }
  if (_10km.length > 0) {
    componentArray = _10km.map((e, i) =>
      nearZoneModalListElement(e, i, setNearZonesModalVisible)
    );
    temp.z10km = componentArray || temp.z10km;
  }
  if (_50km.length > 0) {
    componentArray = _50km.map((e, i) =>
      nearZoneModalListElement(e, i, setNearZonesModalVisible)
    );
    temp.z50km = componentArray || temp.z50km;
  }
  if (_100km.length > 0) {
    componentArray = _100km.map((e, i) =>
      nearZoneModalListElement(e, i, setNearZonesModalVisible)
    );
    temp.z100km = componentArray || temp.z100km;
  }

  if (callback) {
    callback(temp);
  }
}

const util = {
  classify(objArr, by) {
    let out = {};
    for (let i of objArr) (out[i[by]] || (out[i[by]] = [])).push(i);
    return out;
  },
};

const nearZoneModalListElement = (e, i, setNearZonesModalVisible) => {
  return (
    <Pressable
      onPress={() => panToGeojson(e, setNearZonesModalVisible)}
      key={"list" + i}
      style={styles.listContainer}
    >
      <Text style={styles.listZone} key={"list-header" + i}>
        {e.zone_name},({e.group_name})
      </Text>
      <Text style={styles.listArea} key={"list-footer" + i}>
        {e.area_address}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    borderBottomWidth: 2,
    borderBottomColor: "#f1f8ff",
  },
  listZone: {
    fontWeight: "bold",
  },
  listArea: {
    color: "gray",
  },
});

function panToGeojson(e, setNearZonesModalVisible) {
  let coords = JSON.parse(e.geometry).coordinates;
  // console.log(coords);
  let center = getCenter(coords[0]);
  setRegion({
    latitude: center.latitude,
    longitude: center.longitude,
    latitudeDelta: region.latitudeDelta,
    longitudeDelta: region.longitudeDelta,
  });
  setNearZonesModalVisible(false);
}

function getCenter(coordinates) {
  let x = coordinates.map((c) => c[0]);
  let y = coordinates.map((c) => c[1]);

  let minX = Math.min.apply(null, x);
  let maxX = Math.max.apply(null, x);

  let minY = Math.min.apply(null, y);
  let maxY = Math.max.apply(null, y);

  return {
    longitude: (minX + maxX) / 2,
    latitude: (minY + maxY) / 2,
  };
}
