// var zones=document.getElementsByClassName("zone");
function onEachGlobeMapFeature(feature, layer) {
  // does this feature have a property named popupContent?
  if (feature.properties && feature.properties.popupContent) {
    layer.bindPopup(feature.properties.popupContent);
    layer.openPopup();
  }
}
function makeGeoJSONLayer(e, color) {
  let temp = {
    type: "Feature",
    geometry: JSON.parse(e.geometry),
    properties: {
      popupContent: `
        <div>
        <table class="table-hover" style="width:max-content;font-size:small">
          <tr>
            <td>Zone Name</td>
            <td>${e.zone_name}</td>
          </tr>
          <tr>
            <td>Area</td>
            <td>${e.area_address}</td>
          </tr>
          <tr>
            <td>Created By </td>
            <td>${e.officer_name}</td>
          </tr>
          <tr>
            <td>Created At </td>
            <td>${e.modified}</td>
          </tr>
        </table></div>`,
    },
  };

  return L.geoJSON(temp, {
    onEachFeature: onEachGlobeMapFeature,
    style: {
      fillColor: color,
      fillOpacity: 0.5,
      color: color,
      opacity: 1,
      weight: 2,
    },
  });
}
var marker;

function onLocationError(e) {
  alert(e.message);
}
var mapOptions = {
  center: [13.0827, 80.2707],
  zoom: 1,
};

// Creating a map object

// Creating a Layer object
var map = new L.map("map", mapOptions);

var layer = new L.TileLayer(
  "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
);

// Adding layer to the map
map.addLayer(layer);

var marker = "";
function onLocationFound(e) {
  if (marker) {
    marker.remove();
  }
  marker = L.marker(e.latlng).addTo(map);
  lat = e.latlng.lat;
  long = e.latlng.lng;
  uid = user_id_;
  let time = new Date().toISOString().slice(0, 19).replace("T", " ");
  console.log(lat, long);
  fetch(`./check_inside.php?long=${long}&lat=${lat}&uid=${uid}&time=${time}`)
    .then((d) => d.json())
    .then((data) => {
      if (data.length >= 1) {
        if (marker) {
          marker.remove();
        }
        marker = L.marker([lat, long], { icon: redIcon }).addTo(map);
        console.log(lat, long);
        console.log(data);
      }
    });
  fetch(`./check_outside.php?long=${long}&lat=${lat}&uid=${uid}&time=${time}`)
    .then((d) => d.json())
    .then((data) => {
      if (data.length >= 1) {
        if (marker) {
          marker.remove();
        }
        marker = L.marker([lat, long], { icon: redIcon }).addTo(map);
        console.log(lat, long);
        console.log(data);
      }
    });
}
map.on("locationfound", onLocationFound);

setInterval(() => {
  map.locate();
}, 5000);

map.locate({ setView: true, maxZoom: 15 });

for (var i = 0; i < zones.length; i++) {
  let f = {
    type: "Feature",
    properties: {},
    geometry: JSON.parse(zones[i].geometry),
  };
  L.geoJSON(f).addTo(map);
}

function myLocation() {
  console.log("Lalith");
  map.locate({ setView: true, maxZoom: 15 });
}

function zoneFinder(radius) {
  console.log(radius);
  fetch(`./get_near_zones.php?long=${long}&lat=${lat}&radius=${radius}`)
    .then((d) => d.json())
    .then((data) => {
      map.fitBounds(makeGeoJSONLayer(data, "red").getBounds());
    });
}

function makeGeoJSONLayer(featureCollection, color) {
  let temp = featureCollection.map((e, i) => {
    return {
      type: "Feature",
      geometry: JSON.parse(e.geometry),
      properties: {
        popupContent: `
        <div>
        <table class="table-hover" style="width:max-content;font-size:small">
          <tr>
            <td>Zone Name</td>
            <td>${e.zone_name}</td>
          </tr>
          <tr>
            <td>Area</td>
            <td>${e.area_address}</td>
          </tr>
          <tr>
            <td>Created By </td>
            <td>${e.officer_name}</td>
          </tr>
          <tr>
            <td>Created At </td>
            <td>${e.modified}</td>
          </tr>
        </table></div>`,
      },
    };
  });
  return L.geoJSON(temp, {
    onEachFeature: onEachGlobeMapFeature,
    style: {
      fillColor: color,
      fillOpacity: 0.5,
      color: color,
      opacity: 1,
      weight: 2,
    },
  });
}

var LeafIcon = L.Icon.extend({
  options: {
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  },
});
var redIcon = new LeafIcon({ iconUrl: "./_assets/marker-icon-red.png" });
