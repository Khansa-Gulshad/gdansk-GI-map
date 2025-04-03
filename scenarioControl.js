// Scenario button event listeners
document.getElementById('scenario1-btn').addEventListener('click', () => {
  currentScenario = 1;
  updateActiveLayerLegend();  // Add this new function call
});

document.getElementById('scenario2-btn').addEventListener('click', () => {
  currentScenario = 2;
  updateActiveLayerLegend();  // Add this new function call
});

document.getElementById('scenario3-btn').addEventListener('click', () => {
  currentScenario = 3;
  updateActiveLayerLegend();  // Add this new function call
});

// Add this new helper function to the same file
function updateActiveLayerLegend() {
  const currentZoom = map.getZoom();
  
  if (currentZoom > 12) {
    updateLegends(buildingsData, currentScenario, 'buildings');
  } else if (currentZoom > 10) {
    updateLegends(gridData, currentScenario, 'grid');
  } else {
    updateLegends(districtsData, currentScenario, 'districts');
  }
