// Initialize the map centered on Gdańsk
const map = L.map('map').setView([54.352, 18.6466], 13);

// Add Mapbox dark tile layer
const mapboxLayer = L.tileLayer(
  'https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2hhbnNhZ3VsIiwiYSI6ImNtOGhqcWdqMDAyb2kybHI1Mnl2MHhwYjgifQ.9Je73sehr801s1_IynnRgw',
  {
    tileSize: 512,
    zoomOffset: -1,
    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
  }
);
mapboxLayer.addTo(map);

// GeoJSON scenario files
const scenario1Url = 'filtered_buildings_scenario1.geojson';
const scenario2Url = 'filtered_buildings_scenario2.geojson';
const scenario3Url = 'filtered_buildings_scenario3.geojson';

// Color scale based on GPS_roof score
/ Create a color scale from red (low) to green (high)
const colorScale = chroma.scale(['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641']).domain([0, 1]);

function getColor(score) {
    return colorScale(score).hex(); // returns color like "#a3f56b"
}


// Style function for each feature
function style(feature) {
  const score = feature.properties.GPS_roof;
  console.log("GPS_roof:", score);
  return {
    fillColor: getColor(score),
    weight: 0,
    color: 'transparent',
    fillOpacity: 0.9
  };
}

// Popup binding function
function onEachFeature(feature, layer) {
  if (feature.properties) {
    layer.bindPopup(
      `<b>Building ID:</b> ${feature.properties.id}<br>` +
      `<b>Greening Potential Score:</b> ${feature.properties.GPS_roof}<br>` +
      `<b>Slope:</b> ${feature.properties.Slope}<br>` +
      `<b>Height:</b> ${feature.properties.Height}<br>` +
      `<b>Area:</b> ${feature.properties.Area1}<br>` +
      `<b>Shape Ratio:</b> ${feature.properties.shape_ratio}<br>` +
      (feature.properties.slope_category ? `<b>Slope Category:</b> ${feature.properties.slope_category}<br>` : '') +
      (feature.properties.slope_score ? `<b>Slope Score:</b> ${feature.properties.slope_score}<br>` : '')
    );
  }
}

// Load GeoJSON and fit bounds
function loadGeoJSON(url, layerGroup) {
  console.log("Fetching:", url);
  fetch(url)
    .then(response => {
      console.log("Response:", response);
      return response.json();
    })
    .then(data => {
      console.log("Loaded GeoJSON:", data);
      const layer = L.geoJSON(data, {
        style: style,
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

      map.fitBounds(layer.getBounds());
    })
    .catch(err => console.error('Error loading GeoJSON data:', err));
}

// Layer groups for each scenario
const scenario1Layer = L.layerGroup();
const scenario2Layer = L.layerGroup();
const scenario3Layer = L.layerGroup();

// Load all scenarios
loadGeoJSON(scenario1Url, scenario1Layer);
loadGeoJSON(scenario2Url, scenario2Layer);
loadGeoJSON(scenario3Url, scenario3Layer);

// Show scenario 1 by default
scenario1Layer.addTo(map);

// Overlay control (scenarios only)
const overlayMaps = {
  'Scenario 1: All Buildings': scenario1Layer,
  'Scenario 2: Slope Categorized': scenario2Layer,
  'Scenario 3: Excluding Industrial': scenario3Layer
};

const legend = L.control({ position: 'bottomleft' });

legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
    const grades = [0, 0.2, 0.4, 0.6, 0.8];
    const labels = [];

    div.innerHTML += '<b>Greening Score</b><br>';

    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 0.01) + '"></i> ' +
            grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
L.control.layers(null, overlayMaps).addTo(map); // 🧼 Base layer removed from here

