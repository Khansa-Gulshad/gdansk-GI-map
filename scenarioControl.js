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
  
  if (currentZoom > 12) {
    // Buildings layer active
    if (buildingsData) {
      updateLegends(buildingsData, currentScenario, 'buildings');
    } else {
      console.warn("Buildings data not loaded yet");
    }
  } else if (currentZoom > 10) {
    // Grid layer active
    if (gridData) {
      updateLegends(gridData, currentScenario, 'grid');
    } else {
      console.warn("Grid data not loaded yet");
    }
  } else {
    // Districts layer active
    if (districtsData) {
      updateLegends(districtsData, currentScenario, 'districts');
    } else {
      console.warn("Districts data not loaded yet");
    }
  }
}

// Initial legend update after all layers load (add this to your initialization)
loadInitialLayers()
  .then(() => updateActiveLayerLegend())
  .catch(err => console.error("Initial load error:", err));
