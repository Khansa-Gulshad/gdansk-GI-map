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

// Add scale control with custom options (Only once, removed duplicate)
L.control.scale({
  imperial: false,  // Disable feet
  metric: true,     // Use metric system (kilometers, meters)
  position: 'bottomright' // Change position to bottom-right
}).addTo(map);

// Add scenario control buttons to switch between scenarios
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

// Default selected scenario is 1
let currentScenario = 1;

// Handling scenario button clicks to change the current scenario
document.getElementById('scenario1-btn').addEventListener('click', () => {
  currentScenario = 1;
  updateDistricts(); // Update district colors based on scenario 1
  loadScenarioLayer(scenario1Url, scenario1Layer); // Load buildings for scenario 1
});

document.getElementById('scenario2-btn').addEventListener('click', () => {
  currentScenario = 2;
  updateDistricts(); // Update district colors based on scenario 2
  loadScenarioLayer(scenario2Url, scenario2Layer); // Load buildings for scenario 2
});

document.getElementById('scenario3-btn').addEventListener('click', () => {
  currentScenario = 3;
  updateDistricts(); // Update district colors based on scenario 3
  loadScenarioLayer(scenario3Url, scenario3Layer); // Load buildings for scenario 3
});
