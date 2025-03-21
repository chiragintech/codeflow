import * as vscode from "vscode";
import { exec } from "child_process";
import { getNonce } from "./getNonce";
import * as path from "path";
import * as fs from "fs";
let data_read = "";
const txtFilePath = path.join(__dirname, "./t.txt");
fs.readFile(txtFilePath, "utf8", (err, data_read) => {
    if (err) {
      console.error("Error:", err);
      return;
    }
    console.log("File data:", data_read);
});


export class InitialPanel {
  static kill() {
    if (InitialPanel.currentPanel) {
      InitialPanel.currentPanel.dispose();
      InitialPanel.currentPanel = undefined;
    }
  }
  public static currentPanel: InitialPanel | undefined;
  public static readonly viewType = "initial";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (InitialPanel.currentPanel) {
      InitialPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      InitialPanel.viewType,
      "CodeFlow",
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "media"),
          vscode.Uri.joinPath(extensionUri, "out/compiled"),
        ],
      }
    );

    InitialPanel.currentPanel = new InitialPanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    const txtFilePath = path.join(__dirname, "./t.txt");
    fs.readFile(txtFilePath, "utf8", (err, fileData) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }
      console.log("File data:", fileData);
      // Send the file data to the webview
      this._panel.webview.postMessage({
        type: "fileData",
        content: fileData,
      });
    });
    this._update();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.type) {
          case "executeFile":
            await this._executeFile();
            break;
          case "onInfo":
            if (!message.value) {
              return;
            }
            vscode.window.showInformationMessage(message.value);
            if (!message.value) {
              return;
            }
            vscode.window.showErrorMessage(message.value);
            if (!message.value) {
              return;
            }
            vscode.window.showErrorMessage(message.value);
            break;
        }
      },
      null,
      this._disposables
    );
  }

  public async _executeFile() {
    // Get all files in the workspace
    const files = await vscode.workspace.findFiles("**/*");

    if (files.length === 0) {
      vscode.window.showInformationMessage("No files found in the workspace.");
      return;
    }

    const selectedFile = await vscode.window.showQuickPick(
      files.map((file) => file.fsPath),
      { placeHolder: "Select a file to execute" }
    );

    if (!selectedFile) {
      return;
    }

    // Create logs directory if it doesn't exist
    const logsDir = path.join(this._extensionUri.fsPath, "logs");
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(logsDir));

    // Execute the selected file
    exec(`node "${selectedFile}"`, async (error, stdout, stderr) => {
      // Create log data
      const logData = `File: ${selectedFile}\nOutput:\n${stdout}\nError:\n${stderr}\n\nExecuted at: ${new Date().toISOString()}\n\n`;

      // Save logs to file
      const logFilePath = path.join(logsDir, "execution.log");
      try {
        await vscode.workspace.fs.writeFile(
          vscode.Uri.file(logFilePath),
          Buffer.from(logData, "utf8")
        );

        // Update webview with execution results
        this._panel.webview.postMessage({
          type: "log",
          content: logData,
        });

        vscode.window.showInformationMessage(`Logs saved to ${logFilePath}`);
      } catch (err: any) {
        vscode.window.showErrorMessage(`Failed to save logs: ${err.message}`);
      }

      if (error) {
        vscode.window.showErrorMessage(`Execution Error: ${error.message}`);
      }
    });
  }

  public dispose() {
    InitialPanel.currentPanel = undefined;
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _update() {
    const webview = this._panel.webview;
    this._panel.webview.html = this._getHtmlForWebview(webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );

    const stylesResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "css", "styles.css")
    );
    const stylesMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
<html>
<head>
  <title>LLM Chat + Dynamic Graph</title>
  <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
  <style>
    /* Use a modern, clean font from Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
  
    /* General Page Styling */
    body {
      font-family: 'Poppins', sans-serif;
      margin: 0;
      padding: 0;
      /* Vibrant gradient background */
      background: linear-gradient(135deg, #c33764 0%, #1d2671 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #333;
    }
  
    h2 {
      margin-top: 40px;
      margin-bottom: 20px;
      font-size: 2rem;
      font-weight: 600;
      color: #ffffff;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
    }
  
    /* Chat Container */
    .chat-container {
      width: 80%;
      max-width: 800px;
      /* Slight transparency to let background show through a bit */
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      padding: 20px;
      margin-bottom: 30px;
    }
  
    /* Chat Messages */
    .chat-box {
      max-height: 400px;
      overflow-y: auto;
      padding: 10px;
      border-bottom: 1px solid #ddd;
      display: flex;
      flex-direction: column;
      gap: 10px; /* spacing between messages */
    }
  
    .user-message,
    .ai-message {
      padding: 12px 16px;
      margin: 0;
      border-radius: 8px;
      max-width: 70%;
      word-wrap: break-word;
      line-height: 1.4;
      font-size: 16px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    }
  
    /* Vibrant gradient for user messages */
    .user-message {
      background: linear-gradient(to right, #3a7bd5, #3a6073);
      color: #fff;
      margin-left: auto; /* Align right */
      text-align: right;
      align-self: flex-end;
    }
  
    /* Softer gradient for AI messages */
    .ai-message {
      background: linear-gradient(to right, #ffdde1, #ee9ca7);
      color: #333;
      text-align: left;
      align-self: flex-start;
    }
  
    /* Input Box & Button */
    .chat-input {
      display: flex;
      margin-top: 10px;
      gap: 5px;
    }
  
    #user-question {
      flex: 1;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 16px;
      outline: none;
      transition: border-color 0.3s ease;
    }
  
    #user-question:focus {
      border-color: #7f00ff; /* match some gradient color */
    }
  
    button {
      padding: 12px 20px;
      border: none;
      background: linear-gradient(to right, #7f00ff, #e100ff);
      color: #fff;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: background 0.3s ease;
    }
  
    button:hover {
      background: linear-gradient(to right, #6000c7, #ad00d8);
    }
  
    /* Graph Network */
    #mynetwork {
      width: 80%;
      max-width: 1000px;
      height: 500px;
      border: 1px solid #ced4da;
      border-radius: 5px;
      background-color: #fff;
      margin-top: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  
    /* Error Information */
    #error-info {
      width: 80%;
      max-width: 800px;
      margin-top: 20px;
      padding: 15px;
      background: #f8d7da;
      border-left: 5px solid #dc3545;
      display: none; /* Hidden initially */
      border-radius: 5px;
      color: #721c24;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    }
  
    #error-info p {
      margin: 0;
    }
    .error-container {
    /* Bold, eye-catching gradient background */
    background: linear-gradient(135deg, #ff4b2b 0%, #ff416c 100%);
    color: #ffffff;
    padding: 20px;
    margin-top: 20px;
    width: 80%;
    max-width: 800px;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  .error-container h3 {
    margin: 0 0 10px;
    font-size: 1.4rem;
    font-weight: 700;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }

  .error-container p {
    margin: 0 0 10px;
    line-height: 1.5;
  }

  .error-container strong {
    font-weight: 600;
  }
  </style>
  
  
</head>
<body>

  <h2>LLM Chat with Dynamic Graph</h2>

  <!-- Chat Interface -->
  <div class="chat-container">
    <div class="chat-box" id="chat-box"></div>

    <div class="chat-input">
      <input type="text" id="user-question" placeholder="Type your question..." />
      <button onclick="sendQuestion()">Send</button>
    </div>
  </div>

  <!-- Graph Visualization -->
  <div id="mynetwork"></div>

<div class="error-container">
  <p>
    <strong>The error message:</strong>
    <span id="error-message"></span>
  </p>
  <p>
    <strong>The stack trace:</strong>
    <span id="error-stack"></span>
  </p>
</div>
  <script>
    const SERVER_URL = "ws://10.20.200.166:3000"; // WebSocket Server
    const API_URL = "http://10.20.200.166:8080/ask"; // Express API URL

    let errorFunction = "No error";
    let errorMessage = "";
    let errorStack = "";
    const socket = new WebSocket(SERVER_URL);

    const allMessages = [];

    // vis.js DataSets
    const nodes = new vis.DataSet([]);
    const edges = new vis.DataSet([]);
    let uniqueIdCounter = 1;
    
    function generateUniqueId() {
      return uniqueIdCounter++;
    }

    let nodeIds = [];
    const container = document.getElementById('mynetwork');
    const data = { nodes, edges };
    const options = {
      nodes: {
        shape: 'dot',
        size: 20
      },
      edges: {
        color: 'gray',
        arrows: {
          to: { enabled: true, scaleFactor: 0.5 }
        }
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based'
      }
    };

    const network = new vis.Network(container, data, options);

    function rebuildGraph() {
      nodes.clear();
      edges.clear();
      nodeIds = [];

      // 2) Sort allMessages by raw_json.sequence
      allMessages.sort((a, b) => {
        const seqA = a.raw_json?.sequence ?? 0;
        const seqB = b.raw_json?.sequence ?? 0;
        return seqA - seqB;
      });

      // 3) First pass: create exactly one node per message
      for (let i = 0; i < allMessages.length; i++) {
        const msg = allMessages[i];
        const { raw_json } = msg;
        const { method, status } = raw_json;
        // Check all messages for errors
        allMessages.forEach(message => {
          if (status === "error") {
            errorMessage = raw_json.error_message;
            errorStack = raw_json.stack_trace;
          }
        });

        document.getElementById('error-message').textContent = errorMessage;
        document.getElementById('error-stack').textContent = errorStack;
        // Decide color
        let color = "gray";
        if (status === "error") {
          color = "red";
        } else if (status === "success") {
          color = "green";
        }

        // Create a brand-new node for this message
        const newNodeId = generateUniqueId();
        nodeIds.push(newNodeId);

        // Add to nodes DataSet
        nodes.add({
          id: newNodeId,
          label: method || "unknown",
          color: color,
          title: JSON.stringify(msg, null, 2)
        });
      }

      // 4) Second pass: create edges based on next_calls
      //    We'll link from message i to j if:
      //    - j has a strictly higher sequence
      //    - raw_json.method in j matches one of i's next_calls
      for (let i = 0; i < allMessages.length; i++) {
        const fromMsg = allMessages[i];
        const fromSeq = fromMsg.raw_json?.sequence ?? 0;
        const fromNodeId = nodeIds[i];
        const nextCalls = fromMsg.raw_json?.next_calls || [];

        // For each next_call in fromMsg
        nextCalls.forEach(callName => {
          // Find a future message whose raw_json.method == callName
          // and has a sequence > fromSeq
          let bestJ = null;
          let bestSeq = Infinity;

          for (let j = 0; j < allMessages.length; j++) {
            if (j === i) continue; // don't link to itself
            const toMsg = allMessages[j];
            const toSeq = toMsg.raw_json?.sequence ?? 0;
            if (
              toSeq > fromSeq && 
              toMsg.raw_json?.method === callName &&
              toSeq < bestSeq
            ) {
              bestJ = j;
              bestSeq = toSeq;
            }
          }

          // If we found a suitable future message, link them
          if (bestJ !== null) {
            edges.add({
              from: fromNodeId,
              to: nodeIds[bestJ]
            });
          }
        });
      }
    }


    socket.onopen = () => console.log("Connected to WebSocket Server.");
    socket.onmessage = (event) => {
      try {
        const jsonData = JSON.parse(event.data);
        console.log("Received WebSocket data:", jsonData);
        allMessages.push(jsonData);
        rebuildGraph();
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };
    socket.onclose = () => console.log("WebSocket disconnected.");

    function sendQuestion() {
      const question = document.getElementById("user-question").value;
      if (!question) {
        alert("Please enter a question!");
        return;
      }

      // Display user question
      const chatBox = document.getElementById("chat-box");
      const userMessage = document.createElement("div");
      userMessage.className = "user-message";
      userMessage.textContent = question;
      chatBox.appendChild(userMessage);
      chatBox.scrollTop = chatBox.scrollHeight;

      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      })
      .then(response => response.json())
      .then(data => {
        // Display AI response
        const aiMessage = document.createElement("div");
        aiMessage.className = "ai-message";
        aiMessage.textContent = data.answer || "No response.";
        chatBox.appendChild(aiMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
      })
      .catch(error => console.error("Error fetching AI response:", error));

      document.getElementById("user-question").value = "";
    }
  </script>
</body>
</html>
`;
  }
}
