// GeoJSON URLs
const districtsUrl = 'combined_gdansk_districts_roof.geojson';
const gridUrl = 'combined_gdansk_grid.geojson';
const scenario1Url = 'filtered_buildings_scenario1.geojson';
const scenario2Url = 'filtered_buildings_scenario2.geojson';
const scenario3Url = 'filtered_buildings_scenario3.geojson';

// Create Layer Groups globally
window.districtsLayer = L.layerGroup();
window.gridLayer = L.layerGroup();
window.scenario1Layer = L.layerGroup();
window.scenario2Layer = L.layerGroup();
window.scenario3Layer = L.layerGroup();

// Add empty layer groups to map (they will be populated later)
window.districtsLayer.addTo(window.map);
window.gridLayer.addTo(window.map);
window.scenario1Layer.addTo(window.map);
window.scenario2Layer.addTo(window.map);
window.scenario3Layer.addTo(window.map);

// Function to load and add a GeoJSON layer
function loadGeoJSONLayer(url, layerGroup, styleFunc, featureFunc, isBuildingLayer = false) {
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      // Store data globally
      if (url === districtsUrl) window.districtsData = data;
      else if (url === gridUrl) window.gridData = data;
      else if (isBuildingLayer) window.buildingsData = data;

      updateColorScale(data, window.currentScenario);
      
      const geojson = L.geoJSON(data, {
        style: styleFunc,
        onEachFeature: featureFunc
      });

      layerGroup.clearLayers();
      layerGroup.addLayer(geojson);

      return data;
    })
    .catch(err => {
      console.error(`Error loading GeoJSON for ${url}:`, err);
      throw err;
    });
}

// Specific load functions (if needed separately)
function loadDistrictsLayer() {
  return fetch(districtsUrl)
    .then(response => response.json())
    .then(data => {
      window.districtsData = data;
      updateColorScale(data, window.currentScenario);

      const geojson = L.geoJSON(data, {
        style: styleDistricts,
        onEachFeature: onEachDistrictFeature
      });

      window.districtsLayer.clearLayers();
      window.districtsLayer.addLayer(geojson);

      updateLegends(data, window.currentScenario, 'districts');
      return data;
    });
}

function loadGridLayer() {
  return fetch(gridUrl)
    .then(response => response.json())
    .then(data => {
      window.gridData = data;
      updateColorScale(data, window.currentScenario);

      const geojson = L.geoJSON(data, {
        style: styleGrid,
        onEachFeature: onEachGridFeature
      });

      window.gridLayer.clearLayers();
      window.gridLayer.addLayer(geojson);

      updateLegends(data, window.currentScenario, 'grid');
      return data;
    });
}

// Load a building scenario layer
function loadScenarioLayer(url, layerGroup) {
  return loadGeoJSONLayer(url, layerGroup, styleBuildings, onEachBuildingFeature, true)
    .then(data => {
      updateLegends(data, window.currentScenario, 'buildings');
      return data;
    });
}

// Load all initial layers (based on default scenario)
function loadInitialLayers() {
  return updateLayersForScenario(window.currentScenario); // usually scenario 1
}

// Function to update all layers for the selected scenario
function updateLayersForScenario(scenario) {
  // Clear all existing layers
  window.districtsLayer.clearLayers();
  window.gridLayer.clearLayers();
  window.scenario1Layer.clearLayers();
  window.scenario2Layer.clearLayers();
  window.scenario3Layer.clearLayers();

  // Load base layers
  return Promise.all([
    loadGeoJSONLayer(districtsUrl, window.districtsLayer, styleDistricts, onEachDistrictFeature),
    loadGeoJSONLayer(gridUrl, window.gridLayer, styleGrid, onEachGridFeature)
  ]).then(() => {
    // Load selected building layer
    if (scenario === 1) {
      return loadScenarioLayer(scenario1Url, window.scenario1Layer);
    } else if (scenario === 2) {
      return loadScenarioLayer(scenario2Url, window.scenario2Layer);
    } else if (scenario === 3) {
      return loadScenarioLayer(scenario3Url, window.scenario3Layer);
    }
  });
}

// Start loading when map is initialized
loadInitialLayers().catch(err => {
  console.error("Error loading initial layers:", err);
});

// Expose key functions globally
window.geojsonLoader = {
  updateLayersForScenario,
  loadInitialLayers
};

// ---------------------------------------------------
// Add the onEachFeature functions for hover effects
// ---------------------------------------------------

// Handle district hover effects
function onEachDistrictFeature(feature, layer) {
  // Add hover effect (glowing effect on hover)
  layer.on('mouseover', function() {
    layer.setStyle({
      fillColor: '#FF0000',  // Red for hover effect (change color on hover)
      fillOpacity: 1
    });
    window.map.getCanvas().style.cursor = 'pointer';  // Change cursor to pointer
  });

  // Reset to default style when mouse leaves
  layer.on('mouseout', function() {
    layer.setStyle(styleDistricts(feature));  // Reset to the default style
    window.map.getCanvas().style.cursor = '';  // Reset cursor
  });
}

// Handle grid hover effects
function onEachGridFeature(feature, layer) {
  // Add hover effect (glowing effect on hover)
  layer.on('mouseover', function() {
    layer.setStyle({
      fillColor: '#FFFF00',  // Yellow for hover effect (change color on hover)
      fillOpacity: 1
    });
    window.map.getCanvas().style.cursor = 'pointer';  // Change cursor to pointer
  });

  // Reset to default style when mouse leaves
  layer.on('mouseout', function() {
    layer.setStyle(styleGrid(feature));  // Reset to the default style
    window.map.getCanvas().style.cursor = '';  // Reset cursor
  });
}

// Handle building hover effects
function onEachBuildingFeature(feature, layer) {
  // Add hover effect (glowing effect on hover)
  layer.on('mouseover', function() {
    layer.setStyle({
      fillColor: '#00FF00',  // Green for hover effect (change color on hover)
      fillOpacity: 1
    });
    window.map.getCanvas().style.cursor = 'pointer';  // Change cursor to pointer
  });

  // Reset to default style when mouse leaves
  layer.on('mouseout', function() {
    layer.setStyle(styleBuildings(feature));  // Reset to the default style
    window.map.getCanvas().style.cursor = '';  // Reset cursor
  });
}
