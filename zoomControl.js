// Zoom event handling to switch between districts and buildings
map.on('zoomend', function () {
  if (map.getZoom() > 12) { // Zoomed in, show building layers
    if (map.hasLayer(districtsLayer)) {
      districtsLayer.remove(); // Remove district layer if zoomed in
    }

    // Add building layers based on the selected scenario
    if (currentScenario === 1) {
      loadGeoJSON(scenario1Url, scenario1Layer); // Add building scenario 1 layer
    } else if (currentScenario === 2) {
      loadGeoJSON(scenario2Url, scenario2Layer); // Add building scenario 2 layer
    } else if (currentScenario === 3) {
      loadGeoJSON(scenario3Url, scenario3Layer); // Add building scenario 3 layer
    }

    // Call updateLegend to switch to the building legend
    updateLegend('buildings');
  } else { // Zoomed out, show district layers
    if (!map.hasLayer(districtsLayer)) {
      districtsLayer.addTo(map); // Add district layer when zoomed out
    }

    // Remove building layers when zoomed out
    map.removeLayer(scenario1Layer);
    map.removeLayer(scenario2Layer);
    map.removeLayer(scenario3Layer);

    // Call updateLegend to switch to the district legend
    updateLegend('districts');
  }
});
