// scenarioControl.js

// Scenario button event listeners - SIMPLE VERSION THAT WORKS
document.getElementById('scenario1-btn').addEventListener('click', () => {
  currentScenario = 1;
  updateLayersForScenario(currentScenario);
  updateActiveLayerLegend();
});

document.getElementById('scenario2-btn').addEventListener('click', () => {
  currentScenario = 2;
  updateLayersForScenario(currentScenario);
  updateActiveLayerLegend();
});

document.getElementById('scenario3-btn').addEventListener('click', () => {
  currentScenario = 3;
  updateLayersForScenario(currentScenario);
  updateActiveLayerLegend();
});

// Helper function to update legend for active layer
function updateActiveLayerLegend() {
  const currentZoom = map.getZoom();
  
  if (currentZoom > 12) {
    // Buildings layer
    updateLegends(buildingsData, currentScenario, 'buildings');
  } else if (currentZoom > 10) {
    // Grid layer
    updateLegends(gridData, currentScenario, 'grid');
  } else {
    // Districts layer
    updateLegends(districtsData, currentScenario, 'districts');
  }
}

// Initial legend update (call this after layers load)
function initializeLegends() {
  updateActiveLayerLegend();
}
