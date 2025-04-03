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

// Function to load and add a GeoJSON layer
function loadGeoJSONLayer(url, layerGroup, styleFunc, featureFunc) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      updateColorScale(data); // Update color scale with loaded data
      L.geoJSON(data, {
        style: styleFunc, // Apply the style function (e.g., styleDistricts, styleGrid)
        onEachFeature: featureFunc // Apply the feature function (e.g., onEachDistrictFeature)
      }).addTo(layerGroup);
      updateLegends(data); // Call updateLegends to update the legends based on new data
    })
    .catch(err => console.error(`Error loading GeoJSON for ${url}:`, err));
}

// Load and add the Districts layer
loadGeoJSONLayer(districtsUrl, districtsLayer, styleDistricts, onEachDistrictFeature);

// Load and add the Grid layer
loadGeoJSONLayer(gridUrl, gridLayer, styleGrid, onEachGridFeature);

// Function to load building scenario layers based on zoom level
function loadScenarioLayer(url, layerGroup) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      updateColorScale(data); // Update color scale with loaded building data
      L.geoJSON(data, {
        style: styleBuildings, // Apply style for buildings
        onEachFeature: onEachBuildingFeature // Apply feature function for buildings
      }).addTo(layerGroup);
      updateLegends(data); // Call updateLegends to update the legends based on new data
    })
    .catch(err => console.error(`Error loading GeoJSON for scenario: ${url}`, err));
}
