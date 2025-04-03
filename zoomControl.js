// Zoom-based toggling: Control visibility of the layers
map.on('zoomend', function () {
  const currentZoom = map.getZoom();

  if (currentZoom > 12) {
    // Zoomed in, show the building layers
    if (!map.hasLayer(scenario1Layer)) {
      loadScenarioLayer(scenario1Url, scenario1Layer); // Load scenario 1 when zoomed in
    }
    if (!map.hasLayer(scenario2Layer)) {
      loadScenarioLayer(scenario2Url, scenario2Layer); // Load scenario 2 when zoomed in
    }
    if (!map.hasLayer(scenario3Layer)) {
      loadScenarioLayer(scenario3Url, scenario3Layer); // Load scenario 3 when zoomed in
    }
    // Hide the district and grid layers at higher zoom levels
    if (map.hasLayer(districtsLayer)) {
      districtsLayer.remove();
    }
    if (map.hasLayer(gridLayer)) {
      gridLayer.remove();
    }
  } else {
    // Zoomed out, show the district and grid layers
    if (!map.hasLayer(districtsLayer)) {
      districtsLayer.addTo(map); // Show district layer at lower zoom levels
    }
    if (!map.hasLayer(gridLayer)) {
      gridLayer.addTo(map); // Show grid layer at lower zoom levels
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
