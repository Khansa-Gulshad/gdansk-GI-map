// legend.js

// Declare legend variables at the top
let districtLegend, gridLegend, buildingLegend;

// Keep your existing calculateMinMax function exactly as is
function calculateMinMax(data, currentScenario) {
  try {
    const column = currentScenario <= 3 ? `suitable_area_km2_${currentScenario}` : 'GPS_roof';
    
    const allScores = data.features
      .map(f => {
        const val = f.properties[column];
        return val === null || val === undefined ? 0 : parseFloat(val);
      })
      .filter(score => !isNaN(score));

    if (allScores.length === 0) {
      return { currentMin: 0, currentMax: 1 };
    }

    const currentMin = Math.min(...allScores);
    const currentMax = Math.max(...allScores);
    
    if (currentMin === currentMax) {
      return {
        currentMin: currentMin > 0 ? 0 : currentMin - 1,
        currentMax: currentMax + 1
      };
    }

    return { currentMin, currentMax };
  } catch (error) {
    console.error("Error calculating min/max:", error);
    return { currentMin: 0, currentMax: 1 };
  }
}

// Modified to use the declared legend variables
function updateLegends(data, currentScenario, activeLayer) {
  try {
    const { currentMin, currentMax } = calculateMinMax(data, currentScenario);

    // Remove existing legends using the declared variables
    [districtLegend, gridLegend, buildingLegend].forEach(legend => {
      if (legend && map.hasControl(legend)) map.removeControl(legend);
    });

    // Create appropriate legend
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
        ).addTo(map);
        break;
    }
    
  } catch (error) {
    console.error("Error updating legends:", error);
  }
}

// Keep your existing createLegend function
function createLegend(title, currentMin, currentMax, position = 'bottomleft', unit = '') {
  const legend = L.control({ position });
  
  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'info legend');
    const steps = 5;
    const effectiveMax = currentMax === currentMin ? currentMax + 1 : currentMax;
    const stepSize = (effectiveMax - currentMin) / steps;

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
