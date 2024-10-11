function calculatePercentage(value, percentage) {
  return (value * percentage) / 100;
}

// Example usage:
const value = 100;
const percentage = 0.1; // 0.1% (not 10%)
const result = calculatePercentage(value, percentage);
console.log(`${percentage}% of ${value} is:`, result); // Output: 0.1
