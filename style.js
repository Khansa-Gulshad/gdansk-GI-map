// Create base color scale
let colorScale = chroma.scale(['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641']);

function getColor(value) {
  // If value is null, NaN or invalid, return 0 as a fallback value
  if (value === null || isNaN(value)) {
    value = 0;  // Default to 0
  }
  return colorScale(value).hex();  // Return the color corresponding to the value
}

function updateColorScale(data, currentScenario) {
  let allScores = [];

  if (currentScenario <= 3) {
    const prop = `suitable_area_km2_${currentScenario}`;
    allScores = data.features
      .map(f => safeParse(f.properties[prop]));
  } else {
    allScores = data.features
      .map(f => safeParse(f.properties.GPS_roof));
  }

  // Filter out any remaining NaN values just in case
  allScores = allScores.filter(score => !isNaN(score));

  // Set default domain if no valid scores
  if (allScores.length === 0) {
    colorScale.domain([0, 1]);
    return;
  }

  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);
  colorScale.domain([minScore, maxScore]);
}

// Helper function to safely parse values, treating null/undefined as 0
function safeParse(value) {
  return value === null || value === undefined || isNaN(value) ? 0 : parseFloat(value);
}

// Updated style functions
function styleDistricts(feature) {
  const score = safeParse(feature.properties[`suitable_area_km2_${currentScenario}`]);
  return {
    fillColor: getColor(score),
    weight: 1,
    color: 'transparent',
    fillOpacity: 0.7
  };
}

function styleGrid(feature) {
  const score = safeParse(feature.properties[`suitable_area_km2_${currentScenario}`]);
  return {
    fillColor: getColor(score),
    weight: 1,
    color: 'transparent',
    fillOpacity: 0.6
  };
}

function styleBuildings(feature) {
  const score = safeParse(feature.properties.GPS_roof);
  return {
    fillColor: getColor(score),
    weight: 0,
    color: 'transparent',
    fillOpacity: 0.9
  };
}
