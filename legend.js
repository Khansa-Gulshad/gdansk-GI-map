// Function to calculate min/max values for color scale
function calculateMinMax(data) {
  const allScores = data.features.map(f => parseFloat(f.properties.GPS_roof));
  const currentMin = Math.min(...allScores);
  const currentMax = Math.max(...allScores);
  return { currentMin, currentMax };
}

// Function to update the color scale dynamically
function updateColorScale(data) {
  const { currentMin, currentMax } = calculateMinMax(data);
  colorScale.domain([currentMin, currentMax]);
}

// Function to update the legends dynamically
function updateLegends(data) {
  const { currentMin, currentMax } = calculateMinMax(data);

  // Remove existing legends before adding new ones
  if (map.hasControl(districtLegend)) {
    map.removeControl(districtLegend);
  }
  if (map.hasControl(buildingLegend)) {
    map.removeControl(buildingLegend);
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
}
