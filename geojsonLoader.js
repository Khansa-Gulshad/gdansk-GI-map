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

// Function to load and add a GeoJSON layer (districts, grid, buildings)
function loadGeoJSONLayer(url, layerGroup, styleFunc, featureFunc) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      updateColorScale(data, currentScenario); // Update color scale with loaded data based on scenario
      L.geoJSON(data, {
        style: styleFunc,  // Apply style function (e.g., styleDistricts, styleGrid, styleBuildings)
        onEachFeature: featureFunc  // Apply feature function (e.g., onEachDistrictFeature, onEachGridFeature, onEachBuildingFeature)
      }).addTo(layerGroup);
      updateLegends(data, currentScenario);  // Update legends based on new scenario data
    })
    .catch(err => console.error(`Error loading GeoJSON for ${url}:`, err));
}

// Function to load the Districts layer for the selected scenario
function loadDistrictsLayer() {
  loadGeoJSONLayer(districtsUrl, districtsLayer, styleDistricts, onEachDistrictFeature);
}

// Function to load the Grid layer for the selected scenario
function loadGridLayer() {
  loadGeoJSONLayer(gridUrl, gridLayer, styleGrid, onEachGridFeature);
}

// Function to load building scenario layers based on zoom level and scenario selection
function loadScenarioLayer(url, layerGroup) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      updateColorScale(data, currentScenario); // Update color scale for buildings based on the selected scenario
      L.geoJSON(data, {
        style: styleBuildings,  // Apply style for buildings
        onEachFeature: onEachBuildingFeature  // Apply feature function for buildings
      }).addTo(layerGroup);
      updateLegends(data, currentScenario);  // Update legend dynamically based on the selected scenario
    })
    .catch(err => console.error(`Error loading GeoJSON for scenario: ${url}`, err));
}

// Load the initial layers for the map (Districts and Grid for the default scenario 1)
loadDistrictsLayer();  // Load the District layer for the initial scenario
loadGridLayer();  // Load the Grid layer for the initial scenario

// Function to update layers dynamically based on the current scenario
function updateLayersForScenario(currentScenario) {
  // Remove old layers before re-adding new ones for the updated scenario
  districtsLayer.clearLayers();
  gridLayer.clearLayers();
  scenario1Layer.clearLayers();
  scenario2Layer.clearLayers();
  scenario3Layer.clearLayers();

  // Load the appropriate scenario data
  loadGeoJSONLayer(districtsUrl, districtsLayer, styleDistricts, onEachDistrictFeature);  // Reload districts for the selected scenario
  loadGeoJSONLayer(gridUrl, gridLayer, styleGrid, onEachGridFeature);  // Reload grid for the selected scenario

  // Depending on the scenario, load the appropriate building layers
  if (currentScenario === 1) {
    loadScenarioLayer(scenario1Url, scenario1Layer);  // Load scenario 1 buildings
  } else if (currentScenario === 2) {
    loadScenarioLayer(scenario2Url, scenario2Layer);  // Load scenario 2 buildings
  } else if (currentScenario === 3) {
    loadScenarioLayer(scenario3Url, scenario3Layer);  // Load scenario 3 buildings
  }

  // Update legend based on the selected scenario
  updateLegends(currentScenario);
}
