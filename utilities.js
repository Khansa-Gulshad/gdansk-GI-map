// utilities.js

// Helper function to safely parse values, treating null/undefined as 0
function safeParse(value) {
  return value === null || value === undefined || isNaN(value) ? 0 : parseFloat(value);
}
