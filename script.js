// Initialize the map centered on Gdańsk
const map = L.map('map').setView([54.352, 18.6466], 13);

// Add Mapbox dark tile layer to the map
const mapboxLayer = L.tileLayer(
  'https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2hhbnNhZ3VsIiwiYSI6ImNtOGhqcWdqMDAyb2kybHI1Mnl2MHhwYjgifQ.9Je73sehr801s1_IynnRgw',
  {
    tileSize: 512,
    zoomOffset: -1,
    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
  }
);
mapboxLayer.addTo(map);

// Add scale control with custom options
L.control.scale({
  imperial: false,  // Disable feet
  metric: true,     // Use metric system (kilometers, meters)
  position: 'bottomright' // Change position to bottom-right
}).addTo(map);

// GeoJSON URLs
const districtsUrl = 'combined_gdansk_districts_roof.geojson'; // Replace with your districts GeoJSON URL
const scenario1Url = 'filtered_buildings_scenario1.geojson';
const scenario2Url = 'filtered_buildings_scenario2.geojson';
const scenario3Url = 'filtered_buildings_scenario3.geojson';

// Create base color scale
let colorScale = chroma.scale(['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641']);
let currentScenario = 1; // Default scenario (Scenario 1)

// Score-based color
function getColor(score) {
  return colorScale(score).hex();
}
// Styling function for districts layer
function styleDistricts(feature) {
  const score = parseFloat(feature.properties[`suitable_area_km2_${currentScenario}`]); // Use the selected scenario's area
  return {
    fillColor: getColor(score),
    weight: 1,
    color: 'transparent',
    fillOpacity: 0.7
  };
}

// Popups for districts showing the area for each scenario
function onEachDistrict(feature, layer) {
  const districtName = feature.properties.District;
  
  // Display area based on the current scenario
  const area = feature.properties[`suitable_area_km2_${currentScenario}`] !== undefined ? feature.properties[`suitable_area_km2_${currentScenario}`].toFixed(2) : '0.00';

  layer.bindPopup(
    `<b>District:</b> ${districtName}<br>` +
    `<b>Green Roof Area (Scenario ${currentScenario}):</b> ${area} km²`
  );
}

// Create Layer Group for Districts
const districtsLayer = L.layerGroup();

// Load Districts GeoJSON layer
fetch(districtsUrl)
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: styleDistricts,
      onEachFeature: onEachDistrict
    }).addTo(districtsLayer);
  })
  .catch(err => console.error('Error loading Districts GeoJSON:', err));

// Add Districts Layer to the map by default
districtsLayer.addTo(map);

// Building style
function style(feature) {
  const score = parseFloat(feature.properties.GPS_roof);
  return {
    fillColor: getColor(score),
    weight: 0,
    color: 'transparent',
    fillOpacity: 0.9
  };
}

// Popups
function onEachFeature(feature, layer) {
  if (feature.properties) {
    layer.bindPopup(
      `<b>Greening Potential Score:</b> ${(+feature.properties.GPS_roof).toFixed(2)}<br>` +
      `<b>Slope:</b> ${(+feature.properties.Slope).toFixed(2)}°<br>` +
      `<b>Height:</b> ${(+feature.properties.Height).toFixed(2)} m<br>` +
      `<b>Area:</b> ${(+feature.properties.Area1).toFixed(2)} m²<br>` +
      `<b>Shape Ratio:</b> ${(+feature.properties.shape_ratio).toFixed(2)}<br>` +
      (feature.properties.slope_category ? `<b>Slope Category:</b> ${feature.properties.slope_category}<br>` : '') +
      (feature.properties.slope_score ? `<b>Slope Score:</b> ${feature.properties.slope_score}<br>` : '')
    );
  }
}


// Dynamic GeoJSON loader with color scale + legend update
function loadGeoJSON(url, layerGroup) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const allScores = data.features.map(f => parseFloat(f.properties.GPS_roof));
      const minScore = Math.min(...allScores);
      const maxScore = Math.max(...allScores);

      colorScale = colorScale.domain([minScore, maxScore]); // Update range
      currentMin = minScore;
      currentMax = maxScore;

      legend.remove();
      legend.addTo(map);

      const layer = L.geoJSON(data, {
        style: style,
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

      map.fitBounds(layer.getBounds());
    })
    .catch(err => console.error('Error loading GeoJSON:', err));
}

// Layers
const scenario1Layer = L.layerGroup();
const scenario2Layer = L.layerGroup();
const scenario3Layer = L.layerGroup();

// Load all scenarios
loadGeoJSON(scenario1Url, scenario1Layer);
loadGeoJSON(scenario2Url, scenario2Layer);
loadGeoJSON(scenario3Url, scenario3Layer);

// Show Scenario 1 by default
scenario1Layer.addTo(map);

// Legend setup
let legend = L.control({ position: 'bottomleft' });
let currentMin = 0;
let currentMax = 1;

legend.onAdd = function () {
  const div = L.DomUtil.create('div', 'info legend');
  const steps = 5;
  const stepSize = (currentMax - currentMin) / steps;

  div.innerHTML += '<b>Greening Score</b><br>';
  for (let i = 0; i < steps; i++) {
    const from = (currentMin + i * stepSize).toFixed(2);
    const to = (currentMin + (i + 1) * stepSize).toFixed(2);
    const color = getColor((+from + +to) / 2);
    div.innerHTML += `<i style="background:${color}"></i> ${from} – ${to}<br>`;
  }

  return div;
};
legend.addTo(map);

// Custom scenario buttons
const scenarioControl = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function () {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    container.innerHTML = `
      <button class="scenario-btn" id="scenario1-btn">Scenario 1</button>
      <button class="scenario-btn" id="scenario2-btn">Scenario 2</button>
      <button class="scenario-btn" id="scenario3-btn">Scenario 3</button>
    `;
    return container;
  }
});
map.addControl(new scenarioControl());

// Button event listeners for scenarios
document.getElementById('scenario1-btn').addEventListener('click', () => {
  currentScenario = 1;
  updateDistricts(); // Update district colors based on scenario 1
  map.removeLayer(scenario2Layer);
  map.removeLayer(scenario3Layer);
  scenario1Layer.addTo(map);
});

document.getElementById('scenario2-btn').addEventListener('click', () => {
  currentScenario = 2;
  updateDistricts(); // Update district colors based on scenario 2
  map.removeLayer(scenario1Layer);
  map.removeLayer(scenario3Layer);
  scenario2Layer.addTo(map);
});

document.getElementById('scenario3-btn').addEventListener('click', () => {
  currentScenario = 3;
  updateDistricts(); // Update district colors based on scenario 3
  map.removeLayer(scenario1Layer);
  map.removeLayer(scenario2Layer);
  scenario3Layer.addTo(map);
});

// Update the district layer's color when switching scenarios
function updateDistricts() {
  // Clear and reload the districts layer with the updated colors based on the selected scenario
  districtsLayer.clearLayers();
  fetch(districtsUrl)
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, {
        style: styleDistricts,
        onEachFeature: onEachDistrict
      }).addTo(districtsLayer);
    })
    .catch(err => console.error('Error loading Districts GeoJSON:', err));
}

// Add Zoom Event to switch layers dynamically
map.on('zoomend', function () {
  if (map.getZoom() > 12) { // Adjust the zoom level for when to hide the district layer
    if (map.hasLayer(districtsLayer)) {
      districtsLayer.remove();
    }
    // Add building layers depending on the selected scenario
    if (currentScenario === 1) {
      scenario1Layer.addTo(map);
    } else if (currentScenario === 2) {
      scenario2Layer.addTo(map);
    } else if (currentScenario === 3) {
      scenario3Layer.addTo(map);
    }
  } else {
    // Show district layer if zoom level is less than or equal to 12
    if (!map.hasLayer(districtsLayer)) {
      districtsLayer.addTo(map);
    }
    // Remove building layers when zoomed out
    map.removeLayer(scenario1Layer);
    map.removeLayer(scenario2Layer);
    map.removeLayer(scenario3Layer);
  }
});

// Info panel close button
document.getElementById('close-btn').addEventListener('click', function () {
  document.getElementById('info-panel').style.display = 'none';
});
