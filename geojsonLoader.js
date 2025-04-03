// GeoJSON URLs
const districtsUrl = 'combined_gdansk_districts_roof.geojson';
const gridUrl = 'combined_gdansk_grid.geojson';
const scenario1Url = 'filtered_buildings_scenario1.geojson';
const scenario2Url = 'filtered_buildings_scenario2.geojson';
const scenario3Url = 'filtered_buildings_scenario3.geojson';

// Create Layer Group for Districts, Grid, and Buildings
const districtsLayer = L.layerGroup();
const gridLayer = L.layerGroup();
let scenario1Layer = L.layerGroup();
let scenario2Layer = L.layerGroup();
let scenario3Layer = L.layerGroup();

// Load and add the Districts layer
fetch(districtsUrl)
  .then(response => response.json())
  .then(data => {
    updateColorScale(data); // Update color scale with loaded data
    L.geoJSON(data, {
      style: styleDistricts, // Apply updated style
      onEachFeature: onEachDistrictFeature
    }).addTo(districtsLayer);
    updateLegends(data); // Update legends dynamically
  })
  .catch(err => console.error('Error loading Districts GeoJSON:', err));

// Load and add the Grid layer
fetch(gridUrl)
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: styleGrid, // Apply updated style for grid
      onEachFeature: onEachGridFeature
    }).addTo(gridLayer);
  })
  .catch(err => console.error('Error loading Grid GeoJSON:', err));

// Load Building Scenario Layers (will be added on zoom in)
function loadScenarioLayer(url, layerGroup) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      updateColorScale(data); // Update color scale with loaded building data
      L.geoJSON(data, {
        style: styleBuildings, // Apply updated style for buildings
        onEachFeature: onEachBuildingFeature
      }).addTo(layerGroup);
      updateLegends(data); // Call updateLegends to update the legends based on new data
    })
    .catch(err => console.error(`Error loading GeoJSON for scenario: ${url}`, err));
}
