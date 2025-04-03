// utilities.js
function safeParse(value) {
  return value === null || value === undefined ? 0 : parseFloat(value);
}

// utilities.js
window.districtsData = null;
window.gridData = null;
window.buildingsData = null;
window.currentScenario = 1;

window.districtLegend = null;
window.gridLegend = null;
window.buildingLegend = null;
