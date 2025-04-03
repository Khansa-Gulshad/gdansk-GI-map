// Function to calculate min/max values for color scale
function calculateMinMax(data, currentScenario) {
  // Determine the property name based on the selected scenario
  const column = `suitable_area_km2_${currentScenario}`; // For districts and grid
  const allScores = data.features.map(f => parseFloat(f.properties[column])); // Use the correct column based on the scenario
  const currentMin = Math.min(...allScores);
  const currentMax = Math.max(...allScores);
  return { currentMin, currentMax };
}

// Function to update the color scale dynamically
function updateColorScale(data, currentScenario) {
  const { currentMin, currentMax } = calculateMinMax(data, currentScenario);
  colorScale.domain([currentMin, currentMax]);
}

// Function to update the legends dynamically
function updateLegends(data, currentScenario) {
  const { currentMin, currentMax } = calculateMinMax(data, currentScenario);

  // Remove existing legends before adding new ones
  if (map.hasControl(districtLegend)) {
    map.removeControl(districtLegend);
  }
  if (map.hasControl(buildingLegend)) {
    map.removeControl(buildingLegend);
  }
  if (map.hasControl(gridLegend)) {
    map.removeControl(gridLegend);
  }

  // Update the district legend
  districtLegend = L.control({ position: 'bottomleft' });
  districtLegend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
    const steps = 5;
    const stepSize = (currentMax - currentMin) / steps;

    div.innerHTML += '<b>Greening Score (Districts)</b><br>';
    for (let i = 0; i < steps; i++) {
      const from = (currentMin + i * stepSize).toFixed(2);
      const to = (currentMin + (i + 1) * stepSize).toFixed(2);
      const color = getColor((+from + +to) / 2);
      div.innerHTML += `<i style="background:${color}"></i> ${from} – ${to}<br>`;
    }
    return div;
  };
  districtLegend.addTo(map);

  // Update the building legend similarly
  buildingLegend = L.control({ position: 'bottomleft' });
  buildingLegend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
    const steps = 5;
    const stepSize = (currentMax - currentMin) / steps;

    div.innerHTML += '<b>Greening Score (Buildings)</b><br>';
    for (let i = 0; i < steps; i++) {
      const from = (currentMin + i * stepSize).toFixed(2);
      const to = (currentMin + (i + 1) * stepSize).toFixed(2);
      const color = getColor((+from + +to) / 2);
      div.innerHTML += `<i style="background:${color}"></i> ${from} – ${to}<br>`;
    }
    return div;
  };
  buildingLegend.addTo(map);

  // Update the grid legend
  gridLegend = L.control({ position: 'bottomleft' });
  gridLegend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
    const steps = 5;
    const stepSize = (currentMax - currentMin) / steps;

    div.innerHTML += '<b>Grid Scores</b><br>';
    for (let i = 0; i < steps; i++) {
      const from = (currentMin + i * stepSize).toFixed(2);
      const to = (currentMin + (i + 1) * stepSize).toFixed(2);
      const color = getColor((+from + +to) / 2);
      div.innerHTML += `<i style="background:${color}"></i> ${from} – ${to}<br>`;
    }
    return div;
  };
  gridLegend.addTo(map);
}
