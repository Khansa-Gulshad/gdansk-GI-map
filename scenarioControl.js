// scenarioControl.js

// Wait for DOM and dependencies to load
document.addEventListener('DOMContentLoaded', function() {
  // Verify the loader is available
  if (!window.geoJSONLoader) {
    console.error("geoJSONLoader not found!");
    return;
  }

  // Initial load
  window.geoJSONLoader.loadInitialLayers()
    .then(() => updateActiveLayerLegend())
    .catch(err => console.error("Initial load error:", err));

  // Scenario button event listeners
  document.getElementById('scenario1-btn')?.addEventListener('click', () => {
    window.currentScenario = 1;
    window.geoJSONLoader.updateLayersForScenario(window.currentScenario)
      .then(() => updateActiveLayerLegend())
      .catch(err => console.error("Scenario change error:", err));
  });

  document.getElementById('scenario2-btn')?.addEventListener('click', () => {
    window.currentScenario = 2;
    window.geoJSONLoader.updateLayersForScenario(window.currentScenario)
      .then(() => updateActiveLayerLegend())
      .catch(err => console.error("Scenario change error:", err));
  });

  document.getElementById('scenario3-btn')?.addEventListener('click', () => {
    window.currentScenario = 3;
    window.geoJSONLoader.updateLayersForScenario(window.currentScenario)
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
