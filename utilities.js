// utilities.js
function safeParse(value) {
  return value === null || value === undefined ? 0 : parseFloat(value);
}

// Make these available globally since they're used across files
let districtsData, gridData, buildingsData;
let currentScenario = 1; // Default scenario
