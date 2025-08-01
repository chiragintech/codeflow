// Error Demo - This file demonstrates various JavaScript errors with stack traces

function startProcess() {
  console.log("Starting process...");
  initializeSystem();
  loadData();
}

function initializeSystem() {
  console.log("Initializing system...");
  try {
    connectToDatabase();
  } catch (error) {
    console.log("Database connection failed, continuing...");
  }
  setupConfiguration();
}

function connectToDatabase() {
  console.log("Connecting to database...");
  // Simulate a database connection error
  throw new Error("Database connection timeout: Unable to connect to localhost:5432");
}

function setupConfiguration() {
  console.log("Setting up configuration...");
  validateConfig();
}

function validateConfig() {
  console.log("Validating configuration...");
  const config = getConfig();
  if (!config.apiKey) {
    throw new Error("Missing API key in configuration");
  }
}

function getConfig() {
  // Simulate missing configuration
  return {
    apiKey: null, // This will cause an error
    timeout: 5000
  };
}

function loadData() {
  console.log("Loading data...");
  try {
    const data = fetchData();
    processData(data);
  } catch (error) {
    console.log("Data loading failed:", error.message);
    handleDataError(error);
  }
}

function fetchData() {
  console.log("Fetching data...");
  // Simulate a network error
  throw new Error("Network error: Failed to fetch data from API endpoint");
}

function processData(data) {
  console.log("Processing data...");
  if (!data) {
    throw new Error("Invalid data: Data is null or undefined");
  }
  return data.map(item => item * 2);
}

function handleDataError(error) {
  console.log("Handling data error...");
  // This function handles errors gracefully
  console.log("Error handled successfully");
}

// Start the process
startProcess(); 