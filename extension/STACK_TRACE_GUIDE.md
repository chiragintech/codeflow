# CodeFlow Stack Trace Visualization Guide

## 🎯 **Overview**

CodeFlow is a VS Code extension that visualizes JavaScript execution flow and **automatically captures stack traces** when errors occur. This allows you to see exactly where and why your code failed.

## 🚀 **Quick Start**

### 1. **Start the WebSocket Server**
```bash
cd codeflow/app
node server.js
```

### 2. **Run the Demo**
```bash
cd codeflow/chirag_a
node demo_stack_trace.js
```

### 3. **Open the Visualization**
1. Open VS Code/Cursor
2. Press `Cmd+Shift+P` (or `Ctrl+Shift+P`)
3. Type "CodeFlow: Graph Generator"
4. Click to run the command

## 🔍 **Understanding the Visualization**

### **Node Types**
- 🔴 **Red Diamond**: Error occurred (with stack trace)
- 🟢 **Green Circle**: Function executed successfully
- ⚪ **Gray Circle**: Function executed (neutral status)

### **Error Information**
Hover over any red diamond node to see:
- **Function name** and **status**
- **Error message** (if any)
- **Complete stack trace**
- **Function parameters** (if captured)

## 📊 **Example: Error Analysis**

When you run the demo, you'll see errors like:

### **1. Database Connection Error**
```
Function: connectToDatabase
Status: error
Error: Database connection timeout: Unable to connect to localhost:5432
Stack Trace:
Error: Database connection timeout: Unable to connect to localhost:5432
    at connectToDatabase (/path/to/error_demo.js:15:3)
    at initializeSystem (/path/to/error_demo.js:8:3)
    at startProcess (/path/to/error_demo.js:3:3)
```

### **2. Configuration Error**
```
Function: validateConfig
Status: error
Error: Missing API key in configuration
Stack Trace:
Error: Missing API key in configuration
    at validateConfig (/path/to/error_demo.js:25:3)
    at setupConfiguration (/path/to/error_demo.js:20:3)
    at initializeSystem (/path/to/error_demo.js:11:3)
    at startProcess (/path/to/error_demo.js:3:3)
```

## 🛠️ **Using with Your Own Code**

### **Step 1: Instrument Your Code**
```bash
cd codeflow/mysore
node index.js your_file.js
```

### **Step 2: Watch for Errors**
The extension will automatically:
- Capture all function calls
- Detect errors and exceptions
- Record stack traces
- Send data to the visualization

### **Step 3: Analyze the Flow**
1. Look for red diamond nodes
2. Hover to see error details
3. Follow the arrows to understand the call chain
4. Check parameters and variable states

## 🔧 **Advanced Features**

### **Error Propagation Tracking**
- See how errors bubble up through function calls
- Understand which functions handle vs. propagate errors
- Identify error handling patterns

### **Parameter Inspection**
- View function parameters at the time of error
- Understand what data was passed to failing functions
- Debug data-related issues

### **Execution Context**
- See the complete execution path leading to errors
- Understand the state when errors occurred
- Identify patterns in error-prone code paths

## 📝 **Best Practices**

### **For Error Analysis**
1. **Start with red nodes** - they indicate actual problems
2. **Follow the arrows** - understand the execution flow
3. **Check tooltips** - get detailed error information
4. **Look for patterns** - similar errors might indicate systemic issues

### **For Code Instrumentation**
1. **Instrument early** - add tracing before errors occur
2. **Use meaningful function names** - makes visualization clearer
3. **Handle errors gracefully** - use try-catch blocks
4. **Log important state** - capture relevant variables

## 🎨 **Customization**

### **Visual Settings**
The graph automatically adjusts based on:
- **Error severity** (affects node size and color)
- **Function complexity** (affects node shape)
- **Execution frequency** (affects node prominence)

### **Data Filtering**
- Focus on specific error types
- Filter by function names
- Show/hide successful executions

## 🚨 **Troubleshooting**

### **No Graph Appears**
1. Check if WebSocket server is running (`localhost:3000`)
2. Verify code instrumentation is working
3. Check browser console for connection errors

### **Missing Error Information**
1. Ensure errors are thrown (not just logged)
2. Check that instrumentation is capturing stack traces
3. Verify WebSocket connection is stable

### **Graph Not Updating**
1. Restart the WebSocket server
2. Reload the VS Code extension
3. Check for network connectivity issues

## 📚 **Example Use Cases**

### **API Development**
- Track API call failures
- See parameter validation errors
- Understand authentication issues

### **Database Operations**
- Monitor connection failures
- Track query execution errors
- Debug transaction issues

### **File Processing**
- Identify file read/write errors
- Track parsing failures
- Debug format validation issues

### **User Input Validation**
- See validation error patterns
- Track input processing failures
- Debug form submission issues

## 🎯 **Next Steps**

1. **Try the demo** - Run `node demo_stack_trace.js`
2. **Instrument your code** - Use the mysore/index.js script
3. **Analyze your errors** - Look for patterns in the visualization
4. **Improve error handling** - Use insights to make code more robust

---

**Happy debugging! 🐛✨** 