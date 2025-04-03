// Zoom-based layer control: dynamically show layers based on zoom level
map.on('zoomend', function () {
  const currentZoom = map.getZoom();
  
  // If zoom level > 12, show the building layers, otherwise show the district and grid layers
  if (currentZoom > 12) {
    // Show building layers when zoomed in (for the current scenario)
    if (!map.hasLayer(scenario1Layer) && currentScenario === 1) {
      loadScenarioLayer(scenario1Url, scenario1Layer).then(() => {
        updateLegends(buildingsData, currentScenario, 'buildings');
      });
    }
    if (!map.hasLayer(scenario2Layer) && currentScenario === 2) {
      loadScenarioLayer(scenario2Url, scenario2Layer).then(() => {
        updateLegends(buildingsData, currentScenario, 'buildings');
      });
    }
    if (!map.hasLayer(scenario3Layer) && currentScenario === 3) {
      loadScenarioLayer(scenario3Url, scenario3Layer).then(() => {
        updateLegends(buildingsData, currentScenario, 'buildings');
      });
    }

    // Hide the district and grid layers when zoomed in
    if (map.hasLayer(districtsLayer)) {
      districtsLayer.setStyle({ opacity: 0 });
    }
    if (map.hasLayer(gridLayer)) {
      gridLayer.setStyle({ opacity: 0 });
    }
  } else {
    // Determine if we're showing districts or grid based on zoom level
    const showGrid = currentZoom > 10; // Adjust this threshold as needed
    
    // Ensure that grid and district layers are added when zoomed out
    if (showGrid) {
      if (!map.hasLayer(gridLayer)) {
        gridLayer.addTo(map);
        updateLegends(gridData, currentScenario, 'grid');
      }
      if (map.hasLayer(districtsLayer)) {
        districtsLayer.setStyle({ opacity: 0 });
      }
    } else {
      if (!map.hasLayer(districtsLayer)) {
        districtsLayer.addTo(map);
        updateLegends(districtsData, currentScenario, 'districts');
      }
      if (map.hasLayer(gridLayer)) {
        gridLayer.setStyle({ opacity: 0 });
      }
    }
    
    // Remove building layers when zoomed out
    [scenario1Layer, scenario2Layer, scenario3Layer].forEach(layer => {
      if (map.hasLayer(layer)) layer.remove();
    });
  }
});
