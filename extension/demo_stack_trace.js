#!/usr/bin/env node

// CodeFlow Stack Trace Demo
// This script demonstrates how to use CodeFlow for stack trace visualization

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 CodeFlow Stack Trace Visualization Demo');
console.log('==========================================\n');

// Check if WebSocket server is running
function checkServer() {
  return new Promise((resolve) => {
    const http = require('http');
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      resolve(true);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

async function runDemo() {
  // Step 1: Check if server is running
  console.log('1️⃣ Checking WebSocket server...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ WebSocket server not running on localhost:3000');
    console.log('   Please start the server first:');
    console.log('   cd ../app && node server.js\n');
    return;
  }
  
  console.log('✅ WebSocket server is running\n');
  
  // Step 2: Run the error demo
  console.log('2️⃣ Running error demo with instrumentation...');
  
  const demoPath = path.join(__dirname, '../mysore/error_demo.js');
  const instrumentPath = path.join(__dirname, '../mysore/index.js');
  
  const child = spawn('node', [instrumentPath, demoPath], {
    stdio: 'pipe',
    cwd: path.join(__dirname, '../mysore')
  });
  
  child.stdout.on('data', (data) => {
    console.log('📤 Output:', data.toString().trim());
  });
  
  child.stderr.on('data', (data) => {
    console.log('❌ Error:', data.toString().trim());
  });
  
  child.on('close', (code) => {
    console.log('\n3️⃣ Demo completed!');
    console.log('==========================================');
    console.log('🎯 Next Steps:');
    console.log('   1. Open VS Code/Cursor');
    console.log('   2. Press Cmd+Shift+P (or Ctrl+Shift+P)');
    console.log('   3. Type "CodeFlow: Graph Generator"');
    console.log('   4. Click to run the command');
    console.log('   5. Look for red diamond nodes (errors)');
    console.log('   6. Hover over nodes to see stack traces\n');
    
    console.log('🔍 What you should see:');
    console.log('   • Red diamond nodes = Errors with stack traces');
    console.log('   • Green circle nodes = Successful function calls');
    console.log('   • Gray circle nodes = Neutral function calls');
    console.log('   • Arrows = Execution flow between functions');
    console.log('   • Tooltips = Detailed error info and stack traces\n');
    
    console.log('💡 Error Types in this demo:');
    console.log('   • Database connection timeout');
    console.log('   • Missing API key configuration');
    console.log('   • Network error during data fetch');
    console.log('   • Invalid data processing');
  });
}

// Run the demo
runDemo().catch(console.error); 