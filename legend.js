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

// Modified createLegend function to support units
function createLegend(title, currentMin, currentMax, position = 'bottomleft', unit = '') {
  const legend = L.control({ position });
  
  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'info legend');
    const steps = 5;
    const effectiveMax = currentMax === currentMin ? currentMax + 1 : currentMax;
    const stepSize = (effectiveMax - currentMin) / steps;

    // Add unit to title if provided
    const titleWithUnit = unit ? `${title} (${unit})` : title;
    div.innerHTML = `<b>${titleWithUnit}</b><br>`;
    
    for (let i = 0; i < steps; i++) {
      const from = (currentMin + i * stepSize).toFixed(2);
      const to = (currentMin + (i + 1) * stepSize).toFixed(2);
      const color = getColor((parseFloat(from) + parseFloat(to)) / 2);
      div.innerHTML += `<i style="background:${color}"></i> ${from} – ${to}${unit ? ' ' + unit : ''}<br>`;
    }
    
    return div;
  };
  
  return legend;
}

// Modified updateLegends to handle active layer
function updateLegends(data, currentScenario, activeLayer) {
  try {
    const { currentMin, currentMax } = calculateMinMax(data, currentScenario);

    // Remove existing legends
    [districtLegend, buildingLegend, gridLegend].forEach(legend => {
      if (map.hasControl(legend)) map.removeControl(legend);
    });

    // Only create legend for active layer
    switch(activeLayer) {
      case 'districts':
        districtLegend = createLegend(
          'Suitable Area - Districts', 
          currentMin, 
          currentMax,
          'bottomleft',
          'km²'
        ).addTo(map);
        break;
        
      case 'grid':
        gridLegend = createLegend(
          'Suitable Area - Grid', 
          currentMin, 
          currentMax,
          'bottomleft',
          'km²'
        ).addTo(map);
        break;
        
      case 'buildings':
        buildingLegend = createLegend(
          'Greening Potential Score', 
          currentMin, 
          currentMax,
          'bottomleft'
          // No units for buildings
        ).addTo(map);
        break;
    }
    
  } catch (error) {
    console.error("Error updating legends:", error);
  }
}
