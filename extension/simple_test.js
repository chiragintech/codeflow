// Simple test data for the CodeFlow extension
const testData = [
  {
    current_function: 'startProcess',
    raw_json: {
      method: 'startProcess',
      next_calls: ['initializeSystem', 'loadConfiguration'],
      sequence: 1,
      status: 'success'
    }
  },
  {
    current_function: 'initializeSystem',
    raw_json: {
      method: 'initializeSystem',
      next_calls: ['connectToDatabase'],
      sequence: 2,
      status: 'success'
    }
  },
  {
    current_function: 'loadConfiguration',
    raw_json: {
      method: 'loadConfiguration',
      next_calls: ['fetchInitialData'],
      sequence: 3,
      status: 'success'
    }
  },
  {
    current_function: 'connectToDatabase',
    raw_json: {
      method: 'connectToDatabase',
      next_calls: ['validateData'],
      sequence: 4,
      status: 'error'
    }
  },
  {
    current_function: 'fetchInitialData',
    raw_json: {
      method: 'fetchInitialData',
      next_calls: ['processData'],
      sequence: 5,
      status: 'success'
    }
  }
];

console.log("Test data ready for CodeFlow extension:");
testData.forEach((data, index) => {
  const { method, status, sequence } = data.raw_json;
  const icon = status === 'success' ? '✅' : '❌';
  console.log(`${icon} [${sequence}] ${method} (${status})`);
});

console.log("\nTo see this in the extension:");
console.log("1. Run 'CodeFlow: Graph Generator' command");
console.log("2. Look for 'CodeFlow Graph' in the Output panel"); 