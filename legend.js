// Initialize legends for districts and buildings
let districtLegend = L.control({ position: 'bottomleft' });
let buildingLegend = L.control({ position: 'bottomleft' });

// Legend setup for districts
districtLegend.onAdd = function () {
  const div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += '<b>Greening Score (Districts)</b><br>';
  // Add legend logic...
  return div;
};

// Legend setup for buildings
buildingLegend.onAdd = function () {
  const div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += '<b>Greening Score (Buildings)</b><br>';
  // Add legend logic...
  return div;
};

// Current legend reference
let currentLegend = districtLegend;
currentLegend.addTo(map);

// Function to update the legend dynamically
function updateLegend(layerType) {
  let newLegend;
  
  // Determine which legend to show based on layerType
  if (layerType === 'districts') {
    newLegend = districtLegend;
  } else if (layerType === 'buildings') {
    newLegend = buildingLegend;
  }

  // Only update if the current legend is different
  if (currentLegend !== newLegend) {
    map.removeControl(currentLegend);  // Remove the current legend
    currentLegend = newLegend;         // Update the current legend reference
    currentLegend.addTo(map);          // Add the new legend
  }
}
