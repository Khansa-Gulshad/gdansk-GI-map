// utilities.js
function safeParse(value) {
  return value === null || value === undefined ? 0 : parseFloat(value);
}

// Global references
window.districtsData = null;
window.gridData = null;
window.buildingsData = null;
window.currentScenario = 1;
window.districtLegend = null;
window.gridLegend = null;
window.buildingLegend = null;
window.map = null; // Will be set by mapInitialization.js
window.legends = {}; // Will be used by legend.js // Add this line to store map reference
