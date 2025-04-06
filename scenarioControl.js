// scenarioControl.js

document.addEventListener('DOMContentLoaded', function() {
  if (!window.geojsonLoader) {
    console.error("geojsonLoader not found!");
    return;
  }

  window.geojsonLoader.loadInitialLayers()  // Load initial layers
    .then(() => updateActiveLayerLegend())  // Update legend after initial layers are loaded
    .catch(err => console.error("Initial load error:", err));

  // Scenario button event listeners
  document.getElementById('scenario1-btn')?.addEventListener('click', () => {
    window.currentScenario = 1;
    window.geojsonLoader.updateLayersForScenario(window.currentScenario)
      .then(() => {
        updateActiveLayerLegend();  // Update legend after scenario change
        updateDistrictLayer();  // Ensure district layer is updated based on the new scenario
      })
      .catch(err => console.error("Scenario change error:", err));
  });

  document.getElementById('scenario2-btn')?.addEventListener('click', () => {
    window.currentScenario = 2;
    window.geojsonLoader.updateLayersForScenario(window.currentScenario)
      .then(() => {
        updateActiveLayerLegend();
        updateDistrictLayer();
      })
      .catch(err => console.error("Scenario change error:", err));
  });

  document.getElementById('scenario3-btn')?.addEventListener('click', () => {
    window.currentScenario = 3;
    window.geojsonLoader.updateLayersForScenario(window.currentScenario)
      .then(() => {
        updateActiveLayerLegend();
        updateDistrictLayer();
      })
      .catch(err => console.error("Scenario change error:", err));
  });
});

// Update the legend for the current active layer based on zoom level and scenario
function updateActiveLayerLegend() {
  const currentZoom = window.map?.getZoom() || 0;

  if (currentZoom > 12 && window.buildingsData) {
    updateLegends(window.buildingsData, window.currentScenario, 'buildings');
  } else if (currentZoom > 10 && window.gridData) {
    updateLegends(window.gridData, window.currentScenario, 'grid');
  } else if (window.districtsData) {
    updateLegends(window.districtsData, window.currentScenario, 'districts');
  }
}

// Update district layer data based on current scenario
function updateDistrictLayer() {
  const districtDataKey = `suitable_area_km2_${window.currentScenario}`;

  if (window.districtsData) {
    // Assuming you've already created district layers based on `districtsData`
    window.districtsLayer.setStyle({
      fillColor: (feature) => getColor(feature.properties[districtDataKey])
    });

    // Reapply the district layer to the map
    if (!window.map.hasLayer(window.districtsLayer)) {
      window.districtsLayer.addTo(window.map);
    }

    // Update the district legend
    updateLegends(window.districtsData, window.currentScenario, 'districts');
  }
}
