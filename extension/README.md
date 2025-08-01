# CodeFlow Extension

A powerful VS Code extension that provides real-time visualization of JavaScript execution flow with **stack trace analysis**. CodeFlow helps developers understand the exact sequence of method calls, parameters, and execution paths that lead to crashes or errors.

## 🎯 **Key Feature: Stack Trace Visualization**

When JavaScript files encounter errors, CodeFlow automatically:

- **Captures the complete stack trace** at the point of failure
- **Visualizes the error path** with red diamond nodes
- **Shows detailed error information** in tooltips
- **Tracks the execution flow** leading to the crash
- **Displays function parameters** and variable states

## 🔍 **Error Analysis Capabilities**

- **Real-time Error Detection**: See errors as they happen
- **Stack Trace Parsing**: Understand the exact call sequence
- **Error Propagation**: Track how errors bubble up through functions
- **Parameter Inspection**: See what values were passed to failing functions
- **Execution Context**: Understand the state when errors occurred

## Features

- **Real-time Execution Graph**: Visualize function calls as they happen
- **Error Detection**: Red nodes indicate errors, green nodes show successful execution
- **WebSocket Integration**: Connects to your backend server for live data
- **Execution Flow Analysis**: See the complete call stack and execution path
- **Dynamic Graph Generation**: Watch the graph build in real-time as your code runs

## How It Works

1. **Instrument Your Code**: Use the provided instrumentation script to track function calls
2. **Run Your Code**: Execute your instrumented code through the mysore/index.js script
3. **View the Graph**: Open the CodeFlow Graph Generator to see the execution flow
4. **Analyze Errors**: Red nodes show where errors occurred in your execution

## Commands

- `CodeFlow: Graph Generator` - Opens the real-time execution graph
- `CodeFlow: Refresh` - Refreshes the graph view
- `CodeFlow: Execute File` - Execute files and capture execution data

## Setup

1. Start your WebSocket server (runs on localhost:3000)
2. Instrument your code using the mysore/index.js script
3. Run your instrumented code to generate execution data
4. Open the CodeFlow Graph Generator to visualize the flow

## Requirements

- VS Code 1.97.0 or higher
- WebSocket server running on localhost:3000
- Node.js for code instrumentation

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `myExtension.enable`: Enable/disable this extension.
- `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
- Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
- Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
