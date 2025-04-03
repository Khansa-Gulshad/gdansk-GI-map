// scenarioControl.js

// scenarioControl.js
document.addEventListener('DOMContentLoaded', function() {
  if (!window.geojsonLoader) {  // lowercase to match
    console.error("geojsonLoader not found!");
    return;
  }

  window.geojsonLoader.loadInitialLayers()  // lowercase to match
    .then(() => updateActiveLayerLegend())
    .catch(err => console.error("Initial load error:", err));
  
  // Scenario button event listeners
  document.getElementById('scenario1-btn')?.addEventListener('click', () => {
    window.currentScenario = 1;
    window.geojsonLoader.updateLayersForScenario(window.currentScenario)
      .then(() => updateActiveLayerLegend())
      .catch(err => console.error("Scenario change error:", err));
  });

  document.getElementById('scenario2-btn')?.addEventListener('click', () => {
    window.currentScenario = 2;
    window.geojsonLoader.updateLayersForScenario(window.currentScenario)
      .then(() => updateActiveLayerLegend())
      .catch(err => console.error("Scenario change error:", err));
  });

  document.getElementById('scenario3-btn')?.addEventListener('click', () => {
    window.currentScenario = 3;
    window.geojsonLoader.updateLayersForScenario(window.currentScenario)
      .then(() => updateActiveLayerLegend())
      .catch(err => console.error("Scenario change error:", err));
  });
}); // <-- This closes the DOMContentLoaded callback

function updateActiveLayerLegend() {
  const currentZoom = map?.getZoom() || 0;
  
  if (currentZoom > 12 && window.buildingsData) {
    updateLegends(window.buildingsData, window.currentScenario, 'buildings');
  } else if (currentZoom > 10 && window.gridData) {
    updateLegends(window.gridData, window.currentScenario, 'grid');
  } else if (window.districtsData) {
    updateLegends(window.districtsData, window.currentScenario, 'districts');
  }
}
