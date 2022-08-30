let map;
let markers;
let baseMapUrl = "https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png";

async function loadMap() {
  map = L.map("map", {
    center: [11.1271, 78.6569],
    zoom: 10,
  });
  L.tileLayer(baseMapUrl).addTo(map);
}
async function loadMarkers() {
  const data = await (await fetch("../get_all_last_location.php")).json();
  console.log(data);

  if (markers) {
    // map.eachLayer((l) => {
    // map.removeLayer(l);
    // });
    markers.remove();
    // L.tileLayer(baseMapUrl).addTo(map);
  }

  let m = data.map((e) => {
    let layer = L.marker([e.lat, e.long], {
      icon: e.marker_status == "red" ? redIcon : blueIcon,
    });

    let text = L.tooltip({
      permanent: true,
      direction: "left",
      className: "text",
    }).setContent(e.user_name);
    layer.bindTooltip(text);

    let text1 = L.popup({
      // className: "custom-popup",
      offset: L.point(0, -25),
    }).setContent(e.user_name + " at " + e.last_checked + "<br>" + e.user_mail);
    layer.bindPopup(text1);
    return layer;
  });

  markers = L.featureGroup(m).addTo(map);
  map.fitBounds(markers.getBounds());
}

window.addEventListener("load", async (event) => {
  await loadMap();
  await loadMarkers();
  setInterval(async () => {
    console.log("updated");
    await loadMarkers();
  }, 10000);
});

window.addEventListener("resize", async (event) => {
  map.invalidateSize();
});

var LeafIcon = L.Icon.extend({
  options: {
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  },
});
var redIcon = new LeafIcon({ iconUrl: "./_assets/marker-icon-red.png" });
var blueIcon = new LeafIcon({ iconUrl: "./_assets/marker-icon-blue.png" });
