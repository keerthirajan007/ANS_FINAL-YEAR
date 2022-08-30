let map;
let lines;
let arrows;
let zones;
let zone_data;
let layer_colors = new Colors();
let baseMapUrl = "https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png";
let title = document.getElementById("card-title");
let zone_id_mapper;

let zone_type = {
  // alerted when user enters inside the zone
  inside: "Intrusion Alert Zone",
  // alerted when user enters outside the zone
  outside: "Exit Alert Zone",
};

async function loadMap() {
  map = L.map("map", {
    center: [11.1271, 78.6569],
    zoom: 10,
    maxZoom: 30,
  });
  L.tileLayer(baseMapUrl, {}).addTo(map);
}

async function loadZones() {
  zone_data = await (
    await fetch(`../get_all_zones.php?condition=${condition1}`)
  ).json();

  console.log(zone_data);
  zone_id_mapper = {};
  if (zones) {
    zones.remove();
  }
  let str = "Tracking Zones (";
  zone_data.forEach((e, i) => {
    if (i !== 0) str += "," + e.zone_name;
    else str += e.zone_name;
    zone_id_mapper[e.zone_id] = e;
  });
  title.innerHTML = str + ")";
  zones = makeGeoJSONLayer(zone_data, "#007bff");
  zones.addTo(map);
  map.fitBounds(zones.getBounds());
}

function onEachGlobeMapFeature(feature, layer) {
  // does this feature have a property named popupContent?
  if (feature.properties && feature.properties.popupContent) {
    layer.bindPopup(feature.properties.popupContent);
    layer.openPopup();
  }
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
      fillOpacity: 0,
      color: color,
      opacity: 1,
      weight: 2,
    },
  });
}

async function loadLines() {
  const data = util.classify(
    await (await fetch(`../get_visualize.php?condition=${condition}`)).json(),
    "zone_id"
  );
  // console.log(data);

  if (lines) {
    lines.remove();
  }
  let keys = Object.keys(data);
  let polylines = [];

  keys.forEach((zone_based) => {
    let user_based_obj = util.classify(data[zone_based], "user_name");
    let user_based_obj_keys = Object.keys(user_based_obj);
    let z = zone_id_mapper[zone_based];
    let stmt =
      z.zone_type == "outside"
        ? "Extruder of Zone " + z.zone_name
        : "Intruder of Zone " + z.zone_name;
    let color = z.zone_type == "outside" ? "red" : "black";
    user_based_obj_keys.forEach((l) => {
      let coords = user_based_obj[l].map((e) => [
        Number(e.lat),
        Number(e.long),
      ]);
      console.log(coords);
      // let color = layer_colors.getNextColor();
      let tempLayer = L.polyline(coords, { color: color, width: 2 });
      let f = user_based_obj[l][0];
      let text = L.tooltip({
        permanent: true,
        direction: "",
        className: "text",
      }).setContent(f.user_name);
      tempLayer.bindTooltip(text);

      let text1 = L.popup({
        offset: L.point(0, 7),
      }).setContent(f.user_name + "<br>" + f.user_mail + "<br>" + stmt);
      tempLayer.bindPopup(text1);

      polylines.push(tempLayer);
    });
  });

  lines = L.featureGroup(polylines).addTo(map);
  map.fitBounds(lines.getBounds());
  // arrows = L.layerGroup(arrow_array).addTo(map);
}

window.addEventListener("load", async (event) => {
  await loadMap();
  await loadZones();
  await loadLines();
  setInterval(async () => {
    console.log("updated");
    await loadLines();
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

function getArrows(arrLatlngs, color, arrowCount, mapObj) {
  if (
    typeof arrLatlngs === undefined ||
    arrLatlngs == null ||
    !arrLatlngs.length ||
    arrLatlngs.length < 2
  )
    return [];

  if (typeof arrowCount === "undefined" || arrowCount == null) arrowCount = 1;

  if (typeof color === "undefined" || color == null) color = "";
  else color = "color:" + color;

  var result = [];
  for (var i = 1; i < arrLatlngs.length; i++) {
    var icon = L.divIcon({
      className: "arrow-icon",
      bgPos: [5, 5],
      html:
        '<div style="' +
        color +
        ";transform: rotate(" +
        getAngle(arrLatlngs[i - 1], arrLatlngs[i], -1).toString() +
        'deg)">▶</div>',
    });
    for (var c = 1; c <= arrowCount; c++) {
      result.push(
        L.marker(
          myMidPoint(
            arrLatlngs[i],
            arrLatlngs[i - 1],
            c / (arrowCount + 1),
            mapObj
          ),
          { icon: icon }
        )
      );
    }
  }
  return result;
}

function getAngle(latLng1, latlng2, coef) {
  var dy = latlng2[0] - latLng1[0];
  var dx = Math.cos((Math.PI / 180) * latLng1[0]) * (latlng2[1] - latLng1[1]);
  var ang = (Math.atan2(dy, dx) / Math.PI) * 180 * coef;
  return ang.toFixed(2);
}

function myMidPoint(latlng1, latlng2, per, mapObj) {
  if (!mapObj) throw new Error("map is not defined");

  var halfDist,
    segDist,
    dist,
    p1,
    p2,
    ratio,
    points = [];

  p1 = mapObj.project(new L.latLng(latlng1));
  p2 = mapObj.project(new L.latLng(latlng2));

  halfDist = distanceTo(p1, p2) * per;

  if (halfDist === 0) return mapObj.unproject(p1);

  dist = distanceTo(p1, p2);

  if (dist > halfDist) {
    ratio = (dist - halfDist) / dist;
    var res = mapObj.unproject(
      new Point(p2.x - ratio * (p2.x - p1.x), p2.y - ratio * (p2.y - p1.y))
    );
    return [res.lat, res.lng];
  }
}

function distanceTo(p1, p2) {
  var x = p2.x - p1.x,
    y = p2.y - p1.y;

  return Math.sqrt(x * x + y * y);
}

function toPoint(x, y, round) {
  if (x instanceof Point) {
    return x;
  }
  if (isArray(x)) {
    return new Point(x[0], x[1]);
  }
  if (x === undefined || x === null) {
    return x;
  }
  if (typeof x === "object" && "x" in x && "y" in x) {
    return new Point(x.x, x.y);
  }
  return new Point(x, y, round);
}

function Point(x, y, round) {
  this.x = round ? Math.round(x) : x;
  this.y = round ? Math.round(y) : y;
}

const util = {
  classify(objArr, by) {
    let out = {};
    for (let i of objArr) (out[i[by]] || (out[i[by]] = [])).push(i);
    return out;
  },
  isEqual(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length) return false;
    for (let i in a) if (a[i] != b[i]) return false;
    return true;
  },
  changeIndex(a, b) {
    let o = [];
    for (let i in a) if (!this.isEqual(a[i], b[i])) o.push(i);
    return o;
  },
  findFirst(objArr, key, value) {
    for (let i of objArr) {
      if (i[key] == value) return i;
    }
    return {};
  },
};
