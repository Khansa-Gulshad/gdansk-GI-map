// Zoom event handling to switch between districts and buildings
map.on('zoomend', function () {
  if (map.getZoom() > 12) { // Zoomed in, show building layers
    if (map.hasLayer(districtsLayer)) {
      districtsLayer.remove(); // Remove district layer if zoomed in
    }

    // Add building layers based on the selected scenario
    if (currentScenario === 1) {
      loadScenarioLayer(scenario1Url, scenario1Layer);
    } else if (currentScenario === 2) {
      loadScenarioLayer(scenario2Url, scenario2Layer);
    } else if (currentScenario === 3) {
      loadScenarioLayer(scenario3Url, scenario3Layer);
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

// Button event listeners for scenarios (simplified)
document.getElementById('scenario1-btn').addEventListener('click', () => {
  currentScenario = 1;
  updateDistricts(); // Update district colors based on scenario 1
});

document.getElementById('scenario2-btn').addEventListener('click', () => {
  currentScenario = 2;
  updateDistricts(); // Update district colors based on scenario 2
});

document.getElementById('scenario3-btn').addEventListener('click', () => {
  currentScenario = 3;
  updateDistricts(); // Update district colors based on scenario 3
});
