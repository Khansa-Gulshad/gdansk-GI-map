// Function to safely calculate min/max values for color scale
function calculateMinMax(data, currentScenario) {
  try {
    // Determine the property name based on the selected scenario
    const column = currentScenario <= 3 ? `suitable_area_km2_${currentScenario}` : 'GPS_roof';
    
    // Safely extract and parse values, filtering out null/undefined/NaN
    const allScores = data.features
      .map(f => {
        const val = f.properties[column];
        return val === null || val === undefined ? 0 : parseFloat(val);
      })
      .filter(score => !isNaN(score)); // Additional safety check

    // Handle case where all values are null/undefined
    if (allScores.length === 0) {
      return { currentMin: 0, currentMax: 1 }; // Default range
    }

    const currentMin = Math.min(...allScores);
    const currentMax = Math.max(...allScores);
    
    // Handle case where all values are the same
    if (currentMin === currentMax) {
      return {
        currentMin: currentMin > 0 ? 0 : currentMin - 1,
        currentMax: currentMax + 1
      };
    }

    return { currentMin, currentMax };
  } catch (error) {
    console.error("Error calculating min/max:", error);
    return { currentMin: 0, currentMax: 1 }; // Fallback range
  }
}

// Function to generate a single legend (DRY principle - Don't Repeat Yourself)
function createLegend(title, currentMin, currentMax, position = 'bottomleft') {
  const legend = L.control({ position });
  
  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'info legend');
    const steps = 5;
    
    // Handle case where min equals max (all values same)
    const effectiveMin = currentMin;
    const effectiveMax = currentMax === currentMin ? currentMax + 1 : currentMax;
    const stepSize = (effectiveMax - effectiveMin) / steps;

    div.innerHTML = `<b>${title}</b><br>`;
    
    for (let i = 0; i < steps; i++) {
      const from = (effectiveMin + i * stepSize).toFixed(2);
      const to = (effectiveMin + (i + 1) * stepSize).toFixed(2);
      const color = getColor((parseFloat(from) + parseFloat(to)) / 2);
      div.innerHTML += `<i style="background:${color}"></i> ${from} – ${to}<br>`;
    }
    
    return div;
  };
  
  return legend;
}

// Function to update all legends dynamically
function updateLegends(data, currentScenario) {
  try {
    const { currentMin, currentMax } = calculateMinMax(data, currentScenario);

    // Remove existing legends
    [districtLegend, buildingLegend, gridLegend].forEach(legend => {
      if (map.hasControl(legend)) map.removeControl(legend);
    });

    // Create new legends with appropriate titles
    districtLegend = createLegend(
      'Greening Score (Districts)', 
      currentMin, 
      currentMax,
      'bottomleft'
    ).addTo(map);

    buildingLegend = createLegend(
      'Greening Score (Buildings)', 
      currentMin, 
      currentMax,
      'bottomleft'
    ).addTo(map);

    gridLegend = createLegend(
      'Grid Scores', 
      currentMin, 
      currentMax,
      'bottomleft'
    ).addTo(map);
    
  } catch (error) {
    console.error("Error updating legends:", error);
  }
}
