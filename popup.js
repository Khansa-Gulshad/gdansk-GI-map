// Function to handle district popups
function onEachDistrictFeature(feature, layer) {
  const districtName = feature.properties.District;
  const area = feature.properties[`suitable_area_km2_${currentScenario}`] !== null 
    ? feature.properties[`suitable_area_km2_${currentScenario}`].toFixed(2) 
    : '0.00';  // Show area for the selected scenario

  layer.bindPopup(
    `<b>District:</b> ${districtName}<br>` +
    `<b>Green Roof Area (Scenario ${currentScenario}):</b> ${area} km²`
  );
}

// Function to handle grid popups (optional, based on grid data properties)
function onEachGridFeature(feature, layer) {
  const gridId = feature.properties.Grid_ID; // Assuming Grid_ID is a property in the grid GeoJSON
  const area = feature.properties[`suitable_area_km2_${currentScenario}`] !== null
    ? feature.properties[`suitable_area_km2_${currentScenario}`].toFixed(2)
    : '0.00';  // Display area for the selected scenario
  
  layer.bindPopup(
    `<b>Grid ID:</b> ${gridId}<br>` +
    `<b>Area (Scenario ${currentScenario}):</b> ${area} km²`
  );
}

// Function to handle building popups
function onEachBuildingFeature(feature, layer) {
  if (feature.properties) {
    layer.bindPopup(
      `<b>Greening Potential Score:</b> ${(+feature.properties.GPS_roof).toFixed(2)}<br>` + // GPS_roof used for greening score
      `<b>Slope:</b> ${(+feature.properties.Slope).toFixed(2)}°<br>` +
      `<b>Height:</b> ${(+feature.properties.Height).toFixed(2)} m<br>` +
      `<b>Area:</b> ${(+feature.properties.Area1).toFixed(2)} m²<br>` +
      `<b>Shape Ratio:</b> ${(+feature.properties.shape_ratio).toFixed(2)}<br>` +
      (feature.properties.slope_category ? `<b>Slope Category:</b> ${feature.properties.slope_category}<br>` : '') +
      (feature.properties.slope_score ? `<b>Slope Score:</b> ${feature.properties.slope_score}<br>` : '')
    );
  }
}
