import { View } from "react-native";
import React, { useState, useEffect } from "react";
import { Auth, getAllZones } from "../../../rest_controller";
import LoadingScreen from "../../components/LoadingScreen";
import MapViewer from "./MapViewer";

export const data = {
  all_zones: {},
  current_location: undefined,
  user_data: {},
};

const mapboxToken =
  "pk.eyJ1Ijoia2VlcnRoaXJhamFuLTEyMyIsImEiOiJjbDN3eHV3YXAwYXhhM2RxcG1lODhub2s4In0.vXuDxslRYXMWNvzMNQDR_g";

const g_api = "AIzaSyASo1pWVxxuK2n_PunKJrBrSruJJ91_l4Y";

const ZonesScreen = () => {
  const [zones, setZones] = useState(
    <LoadingScreen thickness={7} color={["white"]} size={90} />
  );
  useEffect(() => {
    getAllZones().then((d) => {
      data.all_zones = d;
      setZones(<MapViewer data={d} />);
    });
    setInterval(() => {
      getAllZones().then((d) => {
        data.all_zones = d;
        console.log("Zone data updated");
        setZones(<MapViewer data={d} />);
      });
    }, 60000);
  }, []);
  return (
    <>
      <Auth
        callback={(d) => {
          data.user_data = d;
        }}
      />
      <View style={{ width: "100%", height: "100%" }}>{zones}</View>
    </>
  );
};

export default ZonesScreen;
