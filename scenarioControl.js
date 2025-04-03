// scenarioControl.js

// Scenario button event listeners
document.getElementById('scenario1-btn').addEventListener('click', () => {
  currentScenario = 1;
  updateLayersForScenario(currentScenario)
    .then(() => updateActiveLayerLegend())
    .catch(err => console.error("Scenario change error:", err));
});

document.getElementById('scenario2-btn').addEventListener('click', () => {
  currentScenario = 2;
  updateLayersForScenario(currentScenario)
    .then(() => updateActiveLayerLegend())
    .catch(err => console.error("Scenario change error:", err));
});

document.getElementById('scenario3-btn').addEventListener('click', () => {
  currentScenario = 3;
  updateLayersForScenario(currentScenario)
    .then(() => updateActiveLayerLegend())
    .catch(err => console.error("Scenario change error:", err));
});

// Helper function to update legend for currently active layer
function updateActiveLayerLegend() {
  const currentZoom = map.getZoom();
  
  if (currentZoom > 12 && window.buildingsData) {
    updateLegends(window.buildingsData, window.currentScenario, 'buildings');
  } else if (currentZoom > 10 && window.gridData) {
    updateLegends(window.gridData, window.currentScenario, 'grid');
  } else if (window.districtsData) {
    updateLegends(window.districtsData, window.currentScenario, 'districts');
  }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  geoJSONLoader.loadInitialLayers()
    .then(() => updateActiveLayerLegend())
    .catch(err => console.error("Initial load error:", err));
});
