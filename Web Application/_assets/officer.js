var data = {
  zones: {},
  all_zones: {},
  style_data: {},
  users: [],
};
//
let zone_type = {
  // alerted when user enters inside the zone
  inside: "Intrusion Alert Zone",
  // alerted when user enters outside the zone
  outside: "Exit Alert Zone",
};

let inside_group = [
  "",
  "Marine Border Zones",
  "Pandemic Affected Zone",
  "Radiation Affected Zone",
  "Fishing Activity Zone",
  "Mining Activity Zone",
  "Traffic/Road Construction Zone",
  "VIP Residential zone",
  "Military Activity Zone",
  "Naval Activity Zone",
  "Air force Activity Zone",
  "Other Intrusion Zone",
];

let outside_group = [
  "",
  "Pandemic Alert Zone",
  "Infrastructure Alert Zone",
  "Prisoner Alert Zone",
  "Patient Alert Zone",
  "Laboratory Alert Zone",
  "Zoo/Bio parks Alert Zone",
  "Naval Alert Zone",
  "Military Alert Zone",
  "Air Force Alert Zone",
  "Security Alert Zone",
  "Museum Alert Zone",
  "Other Exit Alert Zone",
];

let map;
let mini_map;
let globe_map;
let globe_layer;
let layers;
let existing_layer;
let current_obj = null;
let current_tab = "zones";
let baseMapUrl = "https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png";
let included_users_select2;
let included_users_innerhtml = "";
const layer_colors = new Colors();
let dom = {
  zones: {
    container: document.getElementById("zones-container"),
    upload: document.getElementById("zones-upload"),
    inside_table: document.getElementById("inside-zones-table"),
    outside_table: document.getElementById("outside-zones-table"),
    inside_table_body: document.getElementById("inside-zones-table-body"),
    outside_table_body: document.getElementById("outside-zones-table-body"),
  },
  allZones: {
    container: document.getElementById("all-zones-container"),
  },
  content: {
    container: document.getElementById("content"),
    lastCheck: document.getElementById("last-refreshed"),
    header: {
      title: document.getElementById("content-title"),
      left: document.getElementById("content-header-left"),
      right: document.getElementById("content-header-right"),
    },
  },
  navbar: {
    container: document.getElementById("header"),
    menu: document.getElementById("menu-button"),
  },
  warningModal: {
    container: document.getElementById("warning-modal"),
    content: document.getElementById("warning-modal-content"),
  },
  normalModal: {
    container: document.getElementById("normal-modal"),
    content: document.getElementById("normal-modal-content"),
    title: document.getElementById("normal-modal-title"),
    register: document.getElementById("normal-modal-register"),
    remove: document.getElementById("normal-modal-remove"),
  },
  geometryModal: {
    container: document.getElementById("drawer-modal"),
    content: document.getElementById("drawer-modal-content"),
    title: document.getElementById("drawer-modal-title"),
    save: document.getElementById("drawer-modal-save"),
  },
  descriptionModal: {
    container: document.getElementById("description-modal"),
    content: document.getElementById("description-modal-content"),
    text: document.getElementById("description-modal-content-text"),
    title: document.getElementById("description-modal-title"),
    save: document.getElementById("description-modal-save"),
  },
};

$(dom.descriptionModal.text).summernote({
  height: 300,
  tabDisable: true,
  dialogsInBody: true,
  toolbar: [
    [
      "style",
      [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "superscript",
        "subscript",
        "clear",
      ],
    ],
    ["font", ["fontname", "fontsize", "fontsizeunit"]],
    ["color", ["forecolor", "backcolor"]],
    ["insert", ["link", "hr"]],
    ["para", ["style", "ul", "ol", "paragraph", "height"]],
    ["misc", ["fullscreen", "codeview", "undo", "redo", "help"]],
  ],
  styleTags: [
    "p",
    { title: "Blockquote", tag: "blockquote", value: "blockquote" },
    "pre",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
  ],
  oninit: function () {
    $("[data-event=fullscreen]").click();
  },
});

dom.zones.inside_dataTable = $(dom.zones.inside_table).DataTable({
  lengthChange: false,
  autoWidth: true,
  scrollX: true,
  select: true,
  scrollCollapse: true,
  buttons: [
    "copy",
    {
      extend: "csv",
      text: "CSV",
      filename: () => {
        var d = new Date(); // for now
        return (
          "Zones at " +
          d.toLocaleDateString().replace(/\//g, "-") +
          " " +
          d.toLocaleTimeString().replace(/\:/g, "-")
        );
      },
    },
    {
      extend: "excel",
      text: "Excel",
      filename: () => {
        var d = new Date(); // for now
        return (
          "Zones at " +
          " " +
          d.toLocaleDateString().replace(/\//g, "-") +
          " " +
          d.toLocaleTimeString().replace(/\:/g, "-")
        );
      },
    },
    "print",
    "colvis",
  ],
  fixedColumns: {
    left: 1,
  },
});

dom.zones.outside_dataTable = $(dom.zones.outside_table).DataTable({
  lengthChange: false,
  autoWidth: true,
  scrollX: true,
  select: true,
  scrollCollapse: true,
  buttons: [
    "copy",
    {
      extend: "csv",
      text: "CSV",
      filename: () => {
        var d = new Date(); // for now
        return (
          "Zones at " +
          d.toLocaleDateString().replace(/\//g, "-") +
          " " +
          d.toLocaleTimeString().replace(/\:/g, "-")
        );
      },
    },
    {
      extend: "excel",
      text: "Excel",
      filename: () => {
        var d = new Date(); // for now
        return (
          "Zones at " +
          " " +
          d.toLocaleDateString().replace(/\//g, "-") +
          " " +
          d.toLocaleTimeString().replace(/\:/g, "-")
        );
      },
    },
    "print",
    "colvis",
  ],
  fixedColumns: {
    left: 1,
  },
});

dom.zones.inside_dataTable
  .buttons()
  .container()
  .appendTo("#inside-zones-table_wrapper .col-md-6:eq(0)");

dom.zones.outside_dataTable
  .buttons()
  .container()
  .appendTo("#outside-zones-table_wrapper .col-md-6:eq(0)");

var mainLoader = document.getElementById("main-loader");
dom.warningModal.switch = $(dom.warningModal.container);
dom.normalModal.switch = $(dom.normalModal.container);
dom.geometryModal.switch = $(dom.geometryModal.container);
dom.descriptionModal.switch = $(dom.descriptionModal.container);

dom.navbar.menu.addEventListener("click", handleResize);

function setMainContentFromSideBar(value, others) {
  dom.navbar.menu.click();
  setMainContent(value, others);
}

const adjustOutSideZones = () => {
  setTimeout(() => {
    dom.zones.inside_dataTable.columns.adjust();
    dom.zones.outside_dataTable.columns.adjust();
  }, 200);
};

function setMainContent(value, others = {}) {
  mainLoader.hidden = false;
  dom.zones.container.hidden = true;
  dom.allZones.container.hidden = true;

  if (value == "zones") {
    dom.zones.container.hidden = false;
    setTimeout(() => {
      dom.zones.inside_dataTable.columns.adjust();
      dom.zones.outside_dataTable.columns.adjust();
    }, 150);
  } else if (value == "all-zones") {
    dom.allZones.container.hidden = false;
    globe_map.invalidateSize();
    globe_map.fitBounds(globe_layer.getBounds());
  }
  current_tab = value;
  mainLoader.hidden = true;
}

function handleResize(e) {
  dom.content.container.style["height"] =
    window.innerHeight - dom.navbar.container.clientHeight + "px";
  setTimeout(() => globe_map.invalidateSize(), 300);
}

window.addEventListener("resize", handleResize);

window.addEventListener("load", async (e) => {
  setMaps();
  await setZones();
  await setAllZones();
  setMainContent(current_tab);
  handleResize();
});

async function setAllZones() {
  data.all_zones = util.classify(
    await (await fetch("./get_all_zones.php")).json(),
    "officer_name"
  );

  let t = data.all_zones;
  let n = Object.keys(t);

  if (globe_layer) {
    globe_layer.remove();
    globe_map.eachLayer((l) => globe_map.removeLayer(l));
    L.tileLayer(baseMapUrl).addTo(globe_map);
  }

  n.forEach((e) => {
    let temp = layer_colors.getNextColor();
    t[e] = {
      meta: {
        color: temp,
        _layer: makeGeoJSONLayer(t[e], temp),
        isHidden: false,
        isIncluded: true,
      },
      layers: t[e],
    };
    globe_map.addLayer(t[e].meta._layer);
  });

  globe_layer = L.featureGroup(n.map((e) => t[e].meta._layer));
  console.log(data.all_zones);
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
      fillOpacity: 0.5,
      color: color,
      opacity: 1,
      weight: 2,
    },
  });
}

async function setZones() {
  data.zones = util.classify(
    await (await fetch("./get_zones.php")).json(),
    "zone_type"
  );

  data.users = await (await fetch("./get_users.php")).json();
  included_users_innerhtml = "";
  data.users.forEach(
    (e) =>
      (included_users_innerhtml += `<option value="${e.user_id}">${e.user_name}</option>`)
  );

  let d1 = (data.zones.inside || []).map((e, i) => {
    return [
      `<a role="button" class="btn btn-sm btn-outline-primary btn-flat" href='#' onclick="setModifyZoneModal('inside',${i})">View/Edit</a>`,
      `<a target="_blank" href="./intruders.php?zone_id=${e.zone_id}" role="button" class="btn btn-sm btn-outline-primary btn-flat">View Intruders</a>`,
      `<a target="_blank" href="./visualize.php?zone_id=${e.zone_id}" role="button" class="btn btn-sm btn-outline-primary btn-flat">Track</a>`,
      e.s_no,
      e.zone_name,
      e.area_address,
      e.created,
      e.modified,
    ];
  });

  dom.zones.inside_dataTable.clear().rows.add(d1).draw();

  let d2 = (data.zones.outside || []).map((e, i) => {
    return [
      `<a role="button" class="btn btn-sm btn-outline-primary btn-flat" href='#' onclick="setModifyZoneModal('outside',${i})">View/Edit</a>`,
      `<a target="_blank" href="./extruders.php?zone_id=${e.zone_id}" role="button" class="btn btn-sm btn-outline-primary btn-flat">View Extruders</a>`,
      `<a target="_blank" href="./visualize.php?zone_id=${e.zone_id}" role="button" class="btn btn-sm btn-outline-primary btn-flat">Track</a>`,
      e.s_no,
      e.zone_name,
      e.area_address,
      e.created,
      e.modified,
    ];
  });

  dom.zones.outside_dataTable.clear().rows.add(d2).draw();
}

function setMaps() {
  // setting geometry modal map

  map = L.map("drawer-modal-content", {
    pmIgnore: false,
    center: [11.1271, 78.6569],
    zoom: 10,
  });
  L.tileLayer(baseMapUrl).addTo(map);
  map.pm.addControls({
    position: "topleft",
    drawCircle: false,
    drawCircleMarker: false,
    drawMarker: false,
    drawPolyline: false,
    drawText: false,
  });

  map.on("pm:drawend", (e) => {
    layers = map.pm.getGeomanDrawLayers(true).getLayers();
    if (existing_layer && layers.length > 0) {
      layers[0].remove();
      alert("Only one shape is allowed");
    } else if (layers.length > 1) {
      layers[1].remove();
      alert("Only one shape is allowed");
    }
  });

  map.on("pm:remove", (e) => {
    if (existing_layer) {
      if (e.layer == existing_layer.getLayers()[0]) {
        existing_layer.remove();
        existing_layer = undefined;
      }
    }
  });

  // adding index button in the map
  L.Control.IndexControl = L.Control.extend({
    onAdd: function (map) {
      var el = L.DomUtil.create("div", "");

      el.innerHTML =
        '<button onclick="setGlobalMapOfficerFilterModal()" class="btn btn-default btn-flat" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-filter" ></i> Filter</button>';

      return el;
    },

    onRemove: function (map) {
      // Nothing to do here
    },
  });

  L.control.IndexControl = function (opts) {
    return new L.Control.IndexControl(opts);
  };

  globe_map = L.map("all-zones-map", {
    fullscreenControl: true,
    pmIgnore: true,
    center: [11.1271, 78.6569],
    zoom: 10,
  });
  L.tileLayer(baseMapUrl).addTo(globe_map);

  L.control
    .IndexControl({
      position: "topright",
    })
    .addTo(globe_map);
}

function setGlobalMapOfficerFilterModal() {
  let t = data.all_zones;
  let n = Object.keys(data.all_zones);
  let str = `<div class="input-group">
                  <input oninput="globalMapSearchFunction(this)" class="form-control" type="search" placeholder="Search" aria-label="Search">
              </div>
              <div class='p-3 row'>`;
  n.forEach((e, i) => {
    let temp = t[e];
    if (temp.meta.isIncluded) {
      str += `
      <div data-officer='${e}' class="col-lg-3 col-md-4 col-sm-6 col-12 custom-control custom-checkbox global-map-officer-target">
      <input onchange="setFilteredMap(this,'${e}')" id="officer-filter-${e}" class="custom-control-input custom-control-input-primary custom-control-input-outline" type="checkbox" value="" ${
        temp.meta.isHidden ? "" : "checked"
      }>
      <label style="word-break: break-word" class="custom-control-label" for="officer-filter-${e}">
        <span onclick="setBoundsForOfficer(this,'${e}')" style="margin:1px;padding:0 8px;border:1px solid ${
        temp.meta.color
      };background:${temp.meta.color + "80"}"></span>
      ${e}
      </label>
      </div>`;
    }
  });
  dom.normalModal.title.innerHTML = "Filter Based on officers";
  dom.normalModal.register.hidden = true;
  dom.normalModal.content.innerHTML = str + "</div>";
  dom.normalModal.switch.modal("show");
}

function setFilteredMap(e, type) {
  let t = data.all_zones[type];
  if (e.checked) {
    globe_map.addLayer(t.meta._layer);
    t.meta.isHidden = false;
  } else {
    globe_map.removeLayer(t.meta._layer);
    t.meta.isHidden = true;
  }
}

function setBoundsForOfficer(e, type) {
  event.stopPropagation();
  event.preventDefault();
  let t = data.all_zones[type];
  if (!t.meta.isHidden) {
    globe_map.fitBounds(t.meta._layer.getBounds());
  }
}

function globalMapSearchFunction(e) {
  var filter = e.value.toLowerCase();
  var nodes = document.getElementsByClassName("global-map-officer-target");

  for (i = 0; i < nodes.length; i++) {
    if (nodes[i].getAttribute("data-officer").toLowerCase().includes(filter)) {
      nodes[i].style.display = "block";
    } else {
      nodes[i].style.display = "none";
    }
  }
}

function setAddZoneModal() {
  current_obj = {
    index: -1,
    description: "",
    geometry: "",
    zone: "",
    area: "",
    msg: "",
    zone_type: "inside",
    group_name: inside_group[1],
    included_users: [],
  };

  let str = inside_group.reduce(
    (p, c) => p + `<option value="${c}">${c}</option>`
  );

  dom.normalModal.remove.hidden = true;
  dom.normalModal.title.textContent = "Adding New Zone";
  dom.normalModal.content.innerHTML = `
      <div class="form-group">
      <label for="zone-type">Zone Type</label>
      <div class="input-group">
          <select class="form-control" onchange="zoneModalChangeController(this,'zone_type')" name="zone-type" id="zone-type">
            <option selected value="inside">${zone_type.inside}</option>
            <option value="outside">${zone_type.outside}</option>
          </select>
      </div>
    </div>
    <div class="form-group">
      <label for="group-name">Group</label>
      <div class="input-group">
          <select id="modal-group-name" class="form-control" onchange="zoneModalChangeController(this,'group_name')">
            ${str}
          </select>
      </div>
    </div>
    <div hidden class="form-group" id="modal-included-users-container">
    <label for="group-name">Included Users</label>
    <div class="input-group">
        <select id="modal-included-users" multiple="multiple" class="form-control" onchange="zoneModalChangeController(this,'included_users')">
            ${included_users_innerhtml}
        </select>
    </div>
    </div>
    <div class="form-group">
        <label for="zone-name">Zone Name</label>
        <div class="input-group">
            <input class="form-control" onchange="zoneModalChangeController(this,'zone')" name="zone-name" id="zone-name" type="text" placeholder="Enter the Zone Name" />
        </div>
    </div>
    <div class="form-group">
        <label for="zone-name">Area Name</label>
        <div class="input-group">
            <input class="form-control" onchange="zoneModalChangeController(this,'area')" name="area-name" id="area-name" type="text" placeholder="Enter the Area Name" />
        </div>
    </div>
    <div class="form-group">
        <label for="zone-msg">Warning Message</label>
        <div class="input-group">
            <input class="form-control" onchange="zoneModalChangeController(this,'msg')" name="zone-msg" id="zone-msg" type="text" placeholder="Enter the Zone Warning Message" />
        </div>
    </div>
    <div class="form-group">
        <label for="zone-msg">Zone Map</label>
        <div class="input-group" >
        <button style="width:fit-content;height:fit-content" onclick="setGeometryModal()" type="button" class="btn btn-primary btn-flat">
                Add/Modify GeoMetry Data
            </button>
            <div class="m-1" id="zone-map" style="width:80%;height:300px">
            </div>
        </div>
    </div>
    <div class="form-group">
        <label for="zone-msg">Description</label>
        <div class="input-group m-2" id="zone-description">
        </div>
        <div>
            <button onclick="setDescriptionModal()" type="button" class="btn btn-primary btn-flat">
                Add/Modify Description
            </button>
        </div>
    </div>
    `;
  setTimeout(() => {
    included_users_select2 = $("#modal-included-users");
    included_users_select2.select2();
  }, 200);
  dom.normalModal.switch.modal("show");
  dom.normalModal.register.hidden = false;
  dom.normalModal.register.onclick = () => {
    console.log(current_obj);
    let valid = false;
    for (var i of Object.keys(current_obj)) {
      if (!current_obj[i]) {
        if (i == "included_users" && current_obj["zone_type"] == "inside") {
          valid = true;
        } else {
          alert("Fill All the Fields");
          valid = false;
          break;
        }
      } else {
        valid = true;
      }
    }

    if (valid) {
      submitZoneModal();
      dom.normalModal.switch.modal("hide");
    }
  };
  setTimeout(function () {
    mini_map = L.map("zone-map", {
      pmIgnore: true,
      center: [11.1271, 78.6569],
      zoom: 10,
    });
    L.tileLayer(baseMapUrl).addTo(mini_map);
    mini_map.invalidateSize();
  }, 200);
}

function zoneModalChangeController(e, key) {
  dom.normalModal.register.hidden = false;
  if (key == "zone_type") {
    let group = document.getElementById("modal-group-name");
    let users = document.getElementById("modal-included-users-container");
    if (e.value == "inside") {
      group.innerHTML = inside_group.reduce(
        (p, c) => p + `<option value="${c}">${c}</option>`
      );
      users.hidden = true;
      current_obj["included_users"] = [];
    } else {
      group.innerHTML = outside_group.reduce(
        (p, c) => p + `<option value="${c}">${c}</option>`
      );
      users.hidden = false;
      current_obj["included_users"] = included_users_select2.val();
    }
    current_obj[key] = e.value;
  } else if (key == "included_users") {
    current_obj["included_users"] = included_users_select2.val();
  } else {
    console.log(key);
    current_obj[key] = e.value;
  }
}

function setModifyZoneModal(type, index) {
  let e = data.zones[type][index];
  dom.normalModal.remove.hidden = false;
  dom.normalModal.remove.onclick = () => {
    removeZone(type, index);
    dom.normalModal.switch.modal("hide");
  };
  current_obj = {
    index: index + "",
    zone_id: e.zone_id,
    description: e.description,
    geometry: {
      type: "Feature",
      geometry: JSON.parse(e.geometry),
      properties: {},
    },
    zone: e.zone_name,
    area: e.area_address,
    msg: e.message,
    zone_type: e.zone_type,
    group_name: e.group_name,
    included_users: JSON.parse(e.included_users || "[]"),
  };

  let str = "";
  if (e.zone_type == "inside") {
    str = inside_group.reduce(
      (p, c) =>
        p +
        `<option ${
          e.group_name == c ? "selected" : ""
        } value="${c}">${c}</option>`
    );
  } else {
    str = outside_group.reduce(
      (p, c) =>
        p +
        `<option ${
          e.group_name == c ? "selected" : ""
        } value="${c}">${c}</option>`
    );
  }

  dom.normalModal.title.textContent = "Modifying " + e.zone_name;
  dom.normalModal.content.innerHTML = `
          <div class="form-group">
          <label for="zone-type">Zone Type</label>
          <div class="input-group">
              <select class="form-control" onchange="zoneModalChangeController(this,'zone_type')" name="zone-type" id="zone-type">
                <option ${
                  e.zone_type == "inside" ? "selected" : ""
                } value="inside">${zone_type.inside}</option>
                <option ${
                  e.zone_type == "outside" ? "selected" : ""
                } value="outside">${zone_type.outside}</option>
              </select>
          </div>
        </div>
        <div class="form-group">
          <label for="group-name">Group</label>
          <div class="input-group">
              <select id="modal-group-name" class="form-control" onchange="zoneModalChangeController(this,'group_name')">
                ${str}
              </select>
          </div>
        </div>
        <div ${
          e.zone_type == "inside" ? "hidden" : ""
        } class="form-group" id="modal-included-users-container">
        <label for="group-name">Included Users</label>
        <div class="input-group">
            <select id="modal-included-users" multiple="multiple" class="form-control" onchange="zoneModalChangeController(this,'included_users')">
                ${included_users_innerhtml}
            </select>
        </div>
      </div>
        <div class="form-group">
            <label for="zone-name">Zone Name</label>
            <div class="input-group">
                <input class="form-control" onchange="zoneModalChangeController(this,'zone')" name="zone-name" id="zone-name" type="text" placeholder="Enter the Zone Name" value="${
                  current_obj.zone
                }"/>
            </div>
        </div>
        <div class="form-group">
            <label for="zone-name">Area Name</label>
            <div class="input-group">
                <input class="form-control" onchange="zoneModalChangeController(this,'area')" name="area-name" value="${
                  current_obj.area
                }" id="area-name" type="text" placeholder="Enter the Area Name" />
            </div>
        </div>
        <div class="form-group">
            <label for="zone-msg">Warning Message</label>
            <div class="input-group">
                <input class="form-control" onchange="zoneModalChangeController(this,'msg')" name="zone-msg" id="zone-msg" value="${
                  current_obj.msg
                }" type="text" placeholder="Enter the Zone Warning Message" />
            </div>
        </div>
        <div class="form-group">
            <label for="zone-msg">Zone Map</label>
            <div class="input-group" >
            <button style="width:fit-content;height:fit-content" onclick="setGeometryModal()" type="button" class="btn btn-primary btn-flat">
                    Add/Modify Geometry Data
                </button>
                <div class="m-1" id="zone-map" style="width:80%;height:300px">
                </div>
            </div>
        </div>
        <div class="form-group">
            <label for="zone-msg">Description</label>
            <div class="input-group m-2" id="zone-description">${
              current_obj.description
            }
            </div>
            <div>
                <button onclick="setDescriptionModal()" type="button" class="btn btn-primary btn-flat">
                    Add/Modify Description
                </button>
            </div>
        </div>
`;
  console.log(current_obj.included_users);
  setTimeout(() => {
    included_users_select2 = $("#modal-included-users");
    included_users_select2.select2();
    included_users_select2.val(current_obj.included_users).trigger("change");
  }, 200);
  dom.normalModal.switch.modal("show");
  dom.normalModal.register.hidden = false;
  dom.normalModal.register.onclick = () => {
    let valid = false;
    for (var i of Object.keys(current_obj)) {
      if (current_obj[i]) {
        valid = true;
      } else {
        if (i == "included_users" && current_obj["zone_type"] == "inside") {
          valid = true;
        } else {
          valid = false;
          alert("Fill All the Fields");
          break;
        }
      }
    }

    if (valid) {
      submitZoneModal();
      dom.normalModal.switch.modal("hide");
    }
  };
  setTimeout(function () {
    mini_map = L.map("zone-map", {
      pmIgnore: false,
      center: [11.1271, 78.6569],
      zoom: 10,
    });
    L.tileLayer(baseMapUrl).addTo(mini_map);
    let temp = L.geoJSON(current_obj.geometry, {
      snapIgnore: false,
    }).addTo(mini_map);
    mini_map.fitBounds(temp.getBounds());
    mini_map.invalidateSize();
  }, 200);
}

function setGeometryModal() {
  dom.geometryModal.switch.modal("show");

  // remove existing layer is it present in the map
  map.eachLayer(function (layer) {
    map.removeLayer(layer);
  });
  existing_layer = undefined;
  L.tileLayer(baseMapUrl).addTo(map);

  if (current_obj.geometry) {
    existing_layer = L.geoJSON(current_obj.geometry, {
      snapIgnore: false,
    }).addTo(map);
  }

  dom.geometryModal.save.onclick = () => {
    let temp;
    if (existing_layer) {
      temp = existing_layer.getLayers()[0];
    } else {
      temp = layers[0];
    }
    mini_map.eachLayer((l) => {
      mini_map.removeLayer(l);
    });

    L.tileLayer(baseMapUrl).addTo(mini_map);
    current_obj.geometry = temp.toGeoJSON();
    mini_map.addLayer(temp);
    mini_map.fitBounds(temp.getBounds());
    dom.geometryModal.switch.modal("hide");
  };

  // dom.geometryModal.container.style.display = "block";
  setTimeout(function () {
    map.invalidateSize();
    if (existing_layer) map.fitBounds(existing_layer.getBounds(), true);
  }, 300);
}

function setDescriptionModal() {
  dom.descriptionModal.switch.modal("show");
  $(dom.descriptionModal.text).summernote("code", current_obj.description);

  dom.descriptionModal.save.onclick = () => {
    current_obj.description = dom.descriptionModal.text.value;
    let temp = document.getElementById("zone-description");
    temp.innerHTML = current_obj.description;
    dom.descriptionModal.switch.modal("hide");
  };
}

function submitZoneModal() {
  let url = "";
  if (current_obj.index == -1) {
    url = "../../add_zone.php";
  } else {
    url = "../../modify_zone.php";
  }

  fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      zone_name: current_obj.zone,
      zone_id: current_obj.zone_id,
      description: current_obj.description,
      area_address: current_obj.area,
      message: current_obj.msg,
      group_name: current_obj.group_name,
      zone_type: current_obj.zone_type,
      included_users: current_obj.included_users,
      message: current_obj.msg,
      geometry: current_obj.geometry.geometry,
    }),
  })
    // .then((res) => res.text())
    .then((res) => res.json())
    .then(async (data) => {
      if (data.status == "success") {
        await setZones();
        await setAllZones();
      } else {
        console.log(data.reason);
      }
    });
}

function removeZone(type, index) {
  let e = data.zones[type][index];
  fetch("../../remove_zone.php", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      zone_id: e.zone_id,
    }),
  })
    // .then((res) => res.text())
    .then((res) => res.json())
    .then(async (data) => {
      if (data.status == "success") {
        await setZones();
      } else {
        console.log(data.reason);
      }
    });
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
