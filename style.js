// Create base color scale
let colorScale = chroma.scale(['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641']);

// Function to get the color corresponding to a value
function getColor(value) {
  return colorScale(value).hex();  // Return the color corresponding to the value
}

// Function to update the color scale based on GeoJSON data
function updateColorScale(data, currentScenario) {
  let allScores;

  if (currentScenario <= 3) {
    allScores = data.features.map(f => parseFloat(f.properties[`suitable_area_km2_${currentScenario}`])); // For districts and grid
  } else {
    allScores = data.features.map(f => parseFloat(f.properties.GPS_roof)); // For buildings
  }

  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);
  colorScale.domain([minScore, maxScore]);  // Update color scale domain
}

// Styling function for districts layer (based on scenario)
function styleDistricts(feature) {
  const score = parseFloat(feature.properties[`suitable_area_km2_${currentScenario}`]); // Use the appropriate column based on the scenario
  return {
    fillColor: getColor(score),
    weight: 1,
    color: 'transparent',
    fillOpacity: 0.7
  };
}

// Styling function for grid layer (similar to districts, based on scenario)
function styleGrid(feature) {
  const score = parseFloat(feature.properties[`suitable_area_km2_${currentScenario}`]); // Use the appropriate column for grid based on the scenario
  return {
    fillColor: getColor(score),
    weight: 1,
    color: 'transparent',
    fillOpacity: 0.6
  };
}

// Styling function for buildings layers (using GPS_roof for all scenarios)
function styleBuildings(feature) {
  const score = parseFloat(feature.properties.GPS_roof); // All building scenarios use the GPS_roof column
  return {
    fillColor: getColor(score),
    weight: 0,
    color: 'transparent',
    fillOpacity: 0.9
  };
}
