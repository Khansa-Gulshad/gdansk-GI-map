// Create base color scale
let colorScale = chroma.scale(['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641']);

function updateColorScale(data) {
  const allScores = data.features.map(f => parseFloat(f.properties.GPS_roof));
  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);

  colorScale.domain([minScore, maxScore]);
}

// Styling function for districts layer
function styleDistricts(feature) {
  const score = parseFloat(feature.properties[`suitable_area_km2_${currentScenario}`]);
  return {
    fillColor: getColor(score),
    weight: 1,
    color: 'transparent',
    fillOpacity: 0.7
  };
}

// Styling function for building layers
function styleBuildings(feature) {
  const score = parseFloat(feature.properties.GPS_roof);
  return {
    fillColor: getColor(score),
    weight: 0,
    color: 'transparent',
    fillOpacity: 0.9
  };
}
