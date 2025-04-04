// legend.js

// Use window references for all shared variables
window.districtLegend = null;
window.gridLegend = null;
window.buildingLegend = null;

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

// Modified to use window.map and window legend references
// Fixed legend update function
function updateLegends(data, currentScenario, activeLayer) {
  try {
    const { currentMin, currentMax } = calculateMinMax(data, currentScenario);

    // Determine which legend we're working with
    const legendType = activeLayer === 'districts' ? 'district' :
                      activeLayer === 'grid' ? 'grid' : 'building';

    // Remove existing legend if it exists
    if (window.legends[legendType] && window.map) {
      window.map.removeControl(window.legends[legendType]);
      window.legends[legendType] = null;
    }

    // Create new legend
    const legend = L.control({ position: 'bottomleft' });
    
    legend.onAdd = function() {
      const div = L.DomUtil.create('div', 'info legend');
      const steps = 5;
      const stepSize = (currentMax - currentMin) / steps;

      // Configure title and units
      let title, unit;
      switch(activeLayer) {
        case 'districts':
          title = 'Suitable Area (Districts)';
          unit = 'km²';
          break;
        case 'grid':
          title = 'Suitable Area (Grid)';
          unit = 'km²';
          break;
        case 'buildings':
          title = 'Greening Potential Score';
          unit = '';
          break;
      }

      div.innerHTML = `<b>${title}</b><br>`;
      
      for (let i = 0; i < steps; i++) {
        const from = (currentMin + i * stepSize).toFixed(2);
        const to = (currentMin + (i + 1) * stepSize).toFixed(2);
        const color = getColor((+from + +to) / 2);
        div.innerHTML += `<i style="background:${color}"></i> ${from} – ${to}${unit ? ' ' + unit : ''}<br>`;
      }
      
      return div;
    };

    // Add to map and store reference
    if (window.map) {
      legend.addTo(window.map);
      window.legends[legendType] = legend;
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
