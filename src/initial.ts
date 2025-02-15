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
  <title>Dynamic Graph with WebSocket Data</title>
  <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
  <style>
    #mynetwork {
      width: 100%;
      height: 600px;
      border: 1px solid lightgray;
    }
  </style>
</head>
<body>
  <h2>Dynamic Graph (WebSocket Updates)</h2>
  <div id="mynetwork"></div>

  <script>
    const SERVER_URL = "ws://172.16.128.248:3000/upload-json"; // Change to your server's actual IP

    const socket = new WebSocket(SERVER_URL);
    const nodeMetaMap = new Map();
    let nodes = new vis.DataSet([]);
    let edges = new vis.DataSet([]);

    var container = document.getElementById('mynetwork');
    var data = { nodes: nodes, edges: edges };
    var options = {
      nodes: { shape: 'dot', size: 20 },
      edges: { color: 'gray', arrows: { to: { enabled: true, scaleFactor: 0.5 } } },
      physics: { enabled: true, solver: 'forceAtlas2Based' }
    };
    var network = new vis.Network(container, data, options);

    socket.onopen = () => console.log("✅ Connected to WebSocket Server at" + SERVER_URL);
    
    socket.onmessage = (event) => {
      try {
        const jsonData = JSON.parse(event.data);
        console.log('🔵 Received WebSocket data:', jsonData);

        const currentFunction = jsonData.current_function || "unknown_function";
        const rawJson = jsonData.raw_json || {};
        const nodeId = nodes.length + 1;

        nodeMetaMap.set(nodeId, { method: currentFunction, log_details: rawJson });

        nodes.add({ 
          id: nodeId, 
          label: currentFunction, 
          title: JSON.stringify(nodeMetaMap.get(nodeId), null, 2)
        });

        if (nodeId > 1) {
          edges.add({ from: nodeId - 1, to: nodeId });
        }

      } catch (error) {
        console.error('❌ Error parsing WebSocket data:', error);
      }
    };

    socket.onclose = () => console.log("⚠️ WebSocket disconnected from" + SERVER_URL);
  </script>
</body>
</html>`;
  }
}
