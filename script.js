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

// Create a base chroma scale (domain will be updated dynamically)
let colorScale = chroma.scale(['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641']);

function getColor(score) {
  return colorScale(score).hex();
}

// Style each building
function style(feature) {
  const score = parseFloat(feature.properties.GPS_roof);
  return {
    fillColor: getColor(score),
    weight: 0,
    color: 'transparent',
    fillOpacity: 0.9
  };
}

// Popup for each feature
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

// Load GeoJSON data and fit bounds
function loadGeoJSON(url, layerGroup) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const allScores = data.features.map(f => parseFloat(f.properties.GPS_roof));
      const minScore = Math.min(...allScores);
      const maxScore = Math.max(...allScores);

      // Dynamically update color scale domain
      colorScale = colorScale.domain([minScore, maxScore]);
      currentMin = minScore;
      currentMax = maxScore;
      legend.remove();   // Remove previous legend
      legend.addTo(map); // Add updated one
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

// Overlay toggle (only for scenarios)
const overlayMaps = {
  'Scenario 1: All Buildings': scenario1Layer,
  'Scenario 2: Slope Categorized': scenario2Layer,
  'Scenario 3: Excluding Industrial': scenario3Layer
};

// legend
let legend = L.control({ position: 'bottomleft' });

// Keep reference to latest data range
let currentMin = 0;
let currentMax = 1;

legend.onAdd = function () {
  const div = L.DomUtil.create('div', 'info legend');
  const steps = 5;
  const stepSize = (currentMax - currentMin) / steps;

  div.innerHTML += '<b>Greening Score</b><br>';

  for (let i = 0; i < steps; i++) {
    const from = (currentMin + stepSize * i).toFixed(2);
    const to = (currentMin + stepSize * (i + 1)).toFixed(2);
    const color = getColor((parseFloat(from) + parseFloat(to)) / 2);

    div.innerHTML += `<i style="background:${color}"></i> ${from} – ${to}<br>`;
  }

  return div;
};

legend.addTo(map);

// Custom scenario control buttons with icons
const scenarioControl = L.Control.extend({
    options: {
        position: 'topright'
    },
    onAdd: function () {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        container.innerHTML = `
            <button class="leaflet-bar-btn" id="scenario1-btn"><i class="fas fa-map"></i> Scenario 1</button>
            <button class="leaflet-bar-btn" id="scenario2-btn"><i class="fas fa-layer-group"></i> Scenario 2</button>
            <button class="leaflet-bar-btn" id="scenario3-btn"><i class="fas fa-industry"></i> Scenario 3</button>
        `;
        return container;
    }
});

map.addControl(new scenarioControl());

// Switch to Scenario 1 when button clicked
document.getElementById('scenario1-btn').addEventListener('click', function () {
    map.removeLayer(scenario2Layer);
    map.removeLayer(scenario3Layer);
    scenario1Layer.addTo(map);
});

// Switch to Scenario 2 when button clicked
document.getElementById('scenario2-btn').addEventListener('click', function () {
    map.removeLayer(scenario1Layer);
    map.removeLayer(scenario3Layer);
    scenario2Layer.addTo(map);
});

// Switch to Scenario 3 when button clicked
document.getElementById('scenario3-btn').addEventListener('click', function () {
    map.removeLayer(scenario1Layer);
    map.removeLayer(scenario2Layer);
    scenario3Layer.addTo(map);
});


// Info Panel Close Button
document.getElementById('close-btn').addEventListener('click', function () {
  const panel = document.getElementById('info-panel');
  panel.style.display = 'none';
});

