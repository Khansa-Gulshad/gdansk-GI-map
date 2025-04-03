// utilities.js

// Data Parsing Utility
function safeParse(value) {
  return value === null || value === undefined ? 0 : parseFloat(value);
}

// Global Data Stores
window.districtsData = null;       // For district GeoJSON data
window.gridData = null;            // For grid GeoJSON data
window.buildingsData = null;       // For buildings GeoJSON data

// Application State
window.currentScenario = 1;        // Current selected scenario (1-3)

// Legend References
window.districtLegend = null;      // Reference to districts legend control
window.gridLegend = null;          // Reference to grid legend control
window.buildingLegend = null;      // Reference to buildings legend control
