// Initialize the map centered on Gdańsk
const map = L.map('map').setView([54.352, 18.6466], 13);

// Add Mapbox dark tile layer to the map
const mapboxLayer = L.tileLayer(
  'https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2hhbnNhZ3VsIiwiYSI6ImNtOGhqcWdqMDAyb2kybHI1Mnl2MHhwYjgifQ.9Je73sehr801s1_IynnRgw',
  {
    tileSize: 512,
    zoomOffset: -1,
    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>' // Map attribution
  }
);
mapboxLayer.addTo(map); // Add the map layer to the map

// GeoJSON files for scenarios 1, 2, and 3
const scenario1Url = 'filtered_buildings_scenario1.geojson';
const scenario2Url = 'filtered_buildings_scenario2.geojson';
const scenario3Url = 'filtered_buildings_scenario3.geojson';

// Create a base chroma color scale, it will dynamically update based on the score range
let colorScale = chroma.scale(['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641']);

function getColor(score) {
  return colorScale(score).hex(); // Convert score to color
}

// Style function for each building (based on GPS_roof score)
function style(feature) {
  const score = parseFloat(feature.properties.GPS_roof); // Extract score from the feature
  return {
    fillColor: getColor(score), // Apply color to the building based on its score
    weight: 0,
    color: 'transparent',
    fillOpacity: 0.9
  };
}

// Popup function to display information about each building
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

// Load GeoJSON data dynamically and update the layers
function loadGeoJSON(url, layerGroup) {
  fetch(url)
    .then(response => response.json()) // Fetch the GeoJSON data
    .then(data => {
      const allScores = data.features.map(f => parseFloat(f.properties.GPS_roof)); // Extract all scores
      const minScore = Math.min(...allScores); // Find the minimum score
      const maxScore = Math.max(...allScores); // Find the maximum score

      // Dynamically update the color scale range based on the data
      colorScale = colorScale.domain([minScore, maxScore]);

      // Update the legend to reflect the new data range
      legend.remove();   // Remove the previous legend
      legend.addTo(map); // Add the updated one

      // Create and add the GeoJSON layer to the specified layer group
      const layer = L.geoJSON(data, {
        style: style,
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

      map.fitBounds(layer.getBounds()); // Fit map to the bounds of the new layer
    })
    .catch(err => console.error('Error loading GeoJSON data:', err)); // Log errors if fetching fails
}

// Layer groups for each scenario
const scenario1Layer = L.layerGroup();
const scenario2Layer = L.layerGroup();
const scenario3Layer = L.layerGroup();

// Load data for all scenarios
loadGeoJSON(scenario1Url, scenario1Layer);
loadGeoJSON(scenario2Url, scenario2Layer);
loadGeoJSON(scenario3Url, scenario3Layer);

// Show Scenario 1 by default
scenario1Layer.addTo(map);

// Overlay map control for switching between scenarios
const overlayMaps = {
  'Scenario 1: All Buildings': scenario1Layer,
  'Scenario 2: Slope Categorized': scenario2Layer,
  'Scenario 3: Excluding Industrial': scenario3Layer
};

// Create the legend for greening score
let legend = L.control({ position: 'bottomleft' });

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

// Custom scenario control buttons with text (no icons)
const scenarioControl = L.Control.extend({
    options: {
        position: 'topright'
    },
    onAdd: function () {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        container.innerHTML = `
            <button class="leaflet-bar-btn" id="scenario1-btn">Scenario 1</button>
            <button class="leaflet-bar-btn" id="scenario2-btn">Scenario 2</button>
            <button class="leaflet-bar-btn" id="scenario3-btn">Scenario 3</button>
        `;
        return container;
    }
});

map.addControl(new scenarioControl()); // Add the scenario buttons to the map

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

// Info Panel Close Button functionality
document.getElementById('close-btn').addEventListener('click', function () {
  const panel = document.getElementById('info-panel');
  panel.style.display = 'none'; // Hide the info panel when close button is clicked
});
