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
function loadGeoJSONLayer(url, layerGroup, styleFunc, featureFunc, isBuildingLayer = false) {
  return fetch(url)  // Return the promise
    .then(response => response.json())
    .then(data => {
      // Store the data based on layer type
      if (url === districtsUrl) districtsData = data;
      else if (url === gridUrl) gridData = data;
      else if (isBuildingLayer) buildingsData = data;

      updateColorScale(data, currentScenario);
      L.geoJSON(data, {
        style: styleFunc,
        onEachFeature: featureFunc
      }).addTo(layerGroup);
      
      return data; // Return data for further processing
    })
    .catch(err => {
      console.error(`Error loading GeoJSON for ${url}:`, err);
      throw err; // Re-throw to handle in calling function
    });
}

// Function to load the Districts layer
function loadDistrictsLayer() {
  return loadGeoJSONLayer(districtsUrl, districtsLayer, styleDistricts, onEachDistrictFeature)
    .then(data => {
      updateLegends(data, currentScenario, 'districts');
      return data;
    });
}

// Function to load the Grid layer
function loadGridLayer() {
  return loadGeoJSONLayer(gridUrl, gridLayer, styleGrid, onEachGridFeature)
    .then(data => {
      updateLegends(data, currentScenario, 'grid');
      return data;
    });
}

// Function to load building scenario layers
function loadScenarioLayer(url, layerGroup) {
  return loadGeoJSONLayer(url, layerGroup, styleBuildings, onEachBuildingFeature, true)
    .then(data => {
      updateLegends(data, currentScenario, 'buildings');
      return data;
    });
}

// Load initial layers (returns promise for all initial loads)
function loadInitialLayers() {
  return Promise.all([
    loadDistrictsLayer()
  ]);
}

// Function to update layers dynamically based on current scenario
function updateLayersForScenario(currentScenario) {
  // Clear existing layers
  districtsLayer.clearLayers();
  gridLayer.clearLayers();
  scenario1Layer.clearLayers();
  scenario2Layer.clearLayers();
  scenario3Layer.clearLayers();

  // Reload layers for new scenario
  return Promise.all([
    loadGeoJSONLayer(districtsUrl, districtsLayer, styleDistricts, onEachDistrictFeature),
    loadGeoJSONLayer(gridUrl, gridLayer, styleGrid, onEachGridFeature)
  ]).then(() => {
    // Load appropriate building layer based on scenario
    if (currentScenario === 1) {
      return loadScenarioLayer(scenario1Url, scenario1Layer);
    } else if (currentScenario === 2) {
      return loadScenarioLayer(scenario2Url, scenario2Layer);
    } else if (currentScenario === 3) {
      return loadScenarioLayer(scenario3Url, scenario3Layer);
    }
  });
}

// Initialize the map
loadInitialLayers().catch(err => {
  console.error("Error loading initial layers:", err);
});

// At the bottom, expose only the necessary functions
window.geojsonLoader = {  // <-- all lowercase to match filename
  updateLayersForScenario,
  loadInitialLayers
};
