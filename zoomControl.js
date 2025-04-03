// Zoom-based layer control: dynamically show layers based on zoom level
map.on('zoomend', function () {
  const currentZoom = map.getZoom();
  
  // If zoom level > 12, show the building layers, otherwise show the district and grid layers
  if (currentZoom > 12) {
    // Show building layers when zoomed in
    if (!map.hasLayer(scenario1Layer)) {
      loadScenarioLayer(scenario1Url, scenario1Layer); // Add building layer for scenario 1
    }
    if (!map.hasLayer(scenario2Layer)) {
      loadScenarioLayer(scenario2Url, scenario2Layer); // Add building layer for scenario 2
    }
    if (!map.hasLayer(scenario3Layer)) {
      loadScenarioLayer(scenario3Url, scenario3Layer); // Add building layer for scenario 3
    }
    
    // Hide the district and grid layers when zoomed in
    if (map.hasLayer(districtsLayer)) {
      districtsLayer.remove();
    }
    if (map.hasLayer(gridLayer)) {
      gridLayer.remove();
    }
  } else {
    // Show district and grid layers when zoomed out
    if (!map.hasLayer(districtsLayer)) {
      districtsLayer.addTo(map); // Add district layer when zoomed out
    }
    if (!map.hasLayer(gridLayer)) {
      gridLayer.addTo(map); // Add grid layer when zoomed out
    }
    
    // Remove building layers when zoomed out
    if (map.hasLayer(scenario1Layer)) {
      scenario1Layer.remove();
    }
    if (map.hasLayer(scenario2Layer)) {
      scenario2Layer.remove();
    }
    if (map.hasLayer(scenario3Layer)) {
      scenario3Layer.remove();
    }
  }
});
