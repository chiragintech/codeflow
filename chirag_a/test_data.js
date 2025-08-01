const WebSocket = require('ws');

// Connect to the WebSocket server
const ws = new WebSocket('ws://localhost:3000');

ws.on('open', function open() {
  console.log('Connected to WebSocket server');
  
  // Send some test data
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

  // Send data with delays to simulate real-time flow
  testData.forEach((data, index) => {
    setTimeout(() => {
      ws.send(JSON.stringify(data));
      console.log(`Sent: ${data.current_function}`);
    }, index * 1000); // Send each message 1 second apart
  });

  // Close connection after sending all data
  setTimeout(() => {
    console.log('Test complete');
    ws.close();
  }, testData.length * 1000 + 1000);
});

ws.on('error', function error(err) {
  console.error('WebSocket error:', err);
}); 