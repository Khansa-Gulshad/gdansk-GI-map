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
    updateColorScale(data); // Update color scale with loaded data
    L.geoJSON(data, {
      style: styleDistricts, // Apply updated style
      onEachFeature: onEachDistrictFeature
    }).addTo(districtsLayer);
    updateLegends(data); // Update the legends based on the data
  })
  .catch(err => console.error('Error loading Districts GeoJSON:', err));

// Add Districts Layer to the map by default
districtsLayer.addTo(map);

// Load Building Scenario Layers (will be added on zoom in)
function loadScenarioLayer(url, layerGroup) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      updateColorScale(data); // Update color scale with loaded building data
      L.geoJSON(data, {
        style: styleBuildings, // Apply updated style
        onEachFeature: onEachBuildingFeature
      }).addTo(layerGroup);
      updateLegends(data); // Update the legends based on the data
    })
    .catch(err => console.error(`Error loading GeoJSON for scenario: ${url}`, err));
}

