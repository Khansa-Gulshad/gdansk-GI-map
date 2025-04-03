// Create base color scale
let colorScale = chroma.scale(['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641']);

function getColor(value) {
  // If value is null, NaN or invalid, return 0 as a fallback value
  if (value === null || isNaN(value)) {
    value = 0;  // Default to 0
  }
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
  let score = parseFloat(feature.properties[`suitable_area_km2_${currentScenario}`]);

  // If score is null or invalid, set it to 0
  if (isNaN(score) || score === null) {
    score = 0;  // Default to 0 if invalid
  }

  return {
    fillColor: getColor(score),  // Use the updated color scale
    weight: 1,
    color: 'transparent',
    fillOpacity: 0.7
  };
}

// Styling function for grid layer (similar to districts, based on scenario)
function styleGrid(feature) {
  let score = parseFloat(feature.properties[`suitable_area_km2_${currentScenario}`]);

  // If score is null or invalid, set it to 0
  if (isNaN(score) || score === null) {
    score = 0;  // Default to 0 if invalid
  }

  return {
    fillColor: getColor(score),  // Use the updated color scale
    weight: 1,
    color: 'transparent',
    fillOpacity: 0.6
  };
}
// Styling function for buildings layers (using GPS_roof for all scenarios)
function styleBuildings(feature) {
  let score = parseFloat(feature.properties.GPS_roof);

  // If score is null or invalid, set it to 0
  if (isNaN(score) || score === null) {
    score = 0;  // Default to 0 if invalid
  }

  return {
    fillColor: getColor(score),  // Use the updated color scale
    weight: 0,
    color: 'transparent',
    fillOpacity: 0.9
  };
}
