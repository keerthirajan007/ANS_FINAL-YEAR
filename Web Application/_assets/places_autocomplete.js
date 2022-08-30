let search_box = document.getElementById("geometry-search");
let search_button = document.getElementById("geometry-search-button");
let result_dropdown = document.getElementById("geometry-search-result");
let current_result;
let current_result_marker;

search_button.addEventListener("click", (event) => {
  if (result_dropdown.classList.contains("show")) {
    // result_dropdown.classList.add("show");
    // event.stopPropagation();
    // event.preventDefault();
  }
});

search_box.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    getAddressDetails();
  }
});

function getAddressDetails() {
  let val = search_box.value.toLowerCase();
  fetch(
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${val}&apiKey=3326962052d84f1d894770190b1e6925`,
    { method: "GET" }
  )
    .then((response) => response.json())
    .then((result) => {
      str = "";
      if (result.features) {
        current_result = result.features;
        result.features.forEach((e, i) => {
          str += `<div class="dropdown-divider"></div>
                  <a href="#" class="dropdown-item" onclick="setCurrentResGeoMetry(${i})">
                    <div><small class="text-wrap"><b>${e.properties.address_line1}</b></small></div>
                    <small class="text-muted text-wrap">${e.properties.address_line2}</small>
                  </a>`;
        });
        result_dropdown.innerHTML =
          `<button style="font-size:x-small" data-toggle="dropdown" type="button" class="btn-close float-right m-1" aria-label="Close"></button>` +
          str;
        if (!result_dropdown.classList.contains("show")) {
          result_dropdown.classList.add("show");
        }
      }
    })
    .catch((error) => console.log("error", error));
}

function setCurrentResGeoMetry(index) {
  let e = current_result[index];
  if (current_result_marker) {
    current_result_marker.remove();
  }
  current_result_marker = L.geoJSON(e).addTo(map);
  map.panTo(current_result_marker.getBounds().getCenter());
}
