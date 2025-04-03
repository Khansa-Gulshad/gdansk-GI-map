// Scenario button event listeners
document.getElementById('scenario1-btn').addEventListener('click', () => {
  currentScenario = 1;
  updateDistricts();  // Update districts with scenario 1
  updateGrid();       // Update grid with scenario 1
  updateBuildings();  // Update buildings with scenario 1
});

document.getElementById('scenario2-btn').addEventListener('click', () => {
  currentScenario = 2;
  updateDistricts();  // Update districts with scenario 2
  updateGrid();       // Update grid with scenario 2
  updateBuildings();  // Update buildings with scenario 2
});

document.getElementById('scenario3-btn').addEventListener('click', () => {
  currentScenario = 3;
  updateDistricts();  // Update districts with scenario 3
  updateGrid();       // Update grid with scenario 3
  updateBuildings();  // Update buildings with scenario 3
});
