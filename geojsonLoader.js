// GeoJSON URLs
const districtsUrl = 'combined_gdansk_districts_roof.geojson'; // Replace with your districts GeoJSON URL
const scenario1Url = 'filtered_buildings_scenario1.geojson';
const scenario2Url = 'filtered_buildings_scenario2.geojson';
const scenario3Url = 'filtered_buildings_scenario3.geojson';

// Create Layer Group for Districts and Buildings
const districtsLayer = L.layerGroup();
let scenario1Layer = L.layerGroup();
let scenario2Layer = L.layerGroup();
let scenario3Layer = L.layerGroup();

// Load Districts GeoJSON layer
fetch(districtsUrl)
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: styleDistricts,
      onEachFeature: onEachDistrictFeature
    }).addTo(districtsLayer);
  })
  .catch(err => console.error('Error loading Districts GeoJSON:', err));

// Add Districts Layer to the map by default
districtsLayer.addTo(map);

// Load Building Scenario Layers (will be added on zoom in)
function loadScenarioLayer(url, layerGroup) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, {
        style: styleBuildings,
        onEachFeature: onEachBuildingFeature
      }).addTo(layerGroup);
    })
    .catch(err => console.error(`Error loading GeoJSON for scenario: ${url}`, err));
}

// Update district colors based on the selected scenario
function updateDistricts() {
  // Reload the districts layer with updated styles
  fetch(districtsUrl)
    .then(response => response.json())
    .then(data => {
      districtsLayer.clearLayers();  // Remove old district data
      L.geoJSON(data, {
        style: styleDistricts, // Use the updated style
        onEachFeature: onEachDistrictFeature
      }).addTo(districtsLayer);
    })
    .catch(err => console.error('Error updating Districts GeoJSON:', err));
}
