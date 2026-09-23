const vscode = require("vscode");

class ChineseAISidebarProvider {
  constructor(extensionUri, context) {
    this._extensionUri = extensionUri;
    this._context = context;
    this._view = null;
  }

  resolveWebviewView(webviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (message) => {
      await this._handleMessage(message);
    });

    this._checkLicense();
  }

  async _handleMessage(message) {
    if (!message || !message.command) {
      return;
    }

    switch (message.command) {
      case "activateLicense":
        await this._activateLicense(message.licenseKey);
        break;
      case "checkLicense":
        await this._checkLicense();
        break;
      case "insertComment":
        await this._insertComment(message.text);
        break;
      default:
        break;
    }
  }

  _getHtmlForWebview(webview) {
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "sidebar.css")
    );

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'unsafe-inline';" />
  <link rel="stylesheet" href="${styleUri}" />
</head>
<body>
  <h2>AI 中文编程助手</h2>

  <input id="licenseInput" placeholder="请输入授权码" />
  <button id="activateBtn">激活授权码</button>

  <hr />

  <input id="commentInput" placeholder="输入注释内容" />
  <button id="insertBtn">插入中文注释</button>

  <div id="statusMsg">未激活</div>

  <script>
    const vscode = acquireVsCodeApi();
    const licenseInput = document.getElementById("licenseInput");
    const activateBtn = document.getElementById("activateBtn");
    const commentInput = document.getElementById("commentInput");
    const insertBtn = document.getElementById("insertBtn");
    const statusMsg = document.getElementById("statusMsg");

    activateBtn.addEventListener("click", () => {
      vscode.postMessage({
        command: "activateLicense",
        licenseKey: licenseInput.value.trim()
      });
    });

    insertBtn.addEventListener("click", () => {
      vscode.postMessage({
        command: "insertComment",
        text: commentInput.value.trim()
      });
    });

    window.addEventListener("message", (event) => {
      const msg = event.data;
      if (msg.command === "licenseResult") {
        statusMsg.textContent = msg.success ? "已激活" : (msg.message || "激活失败");
        statusMsg.className = msg.success ? "status-ok" : "status-err";
      }
      if (msg.command === "insertResult") {
        statusMsg.textContent = msg.success ? "注释已插入" : (msg.message || "插入失败");
        statusMsg.className = msg.success ? "status-ok" : "status-err";
      }
    });

    vscode.postMessage({ command: "checkLicense" });
  </script>
</body>
</html>`;
  }

  async _activateLicense(licenseKey) {
    if (!licenseKey) {
      this._sendToWebview({
        command: "licenseResult",
        success: false,
        message: "请输入授权码",
      });
      return;
    }

    const valid = licenseKey.length >= 8;

    if (valid) {
      await this._context.globalState.update("chineseAI.licenseKey", licenseKey);
      await this._context.globalState.update("chineseAI.licenseActive", true);
      this._sendToWebview({ command: "licenseResult", success: true });
    } else {
      this._sendToWebview({
        command: "licenseResult",
        success: false,
        message: "授权码无效",
      });
    }
  }

  async _checkLicense() {
    const active = this._context.globalState.get("chineseAI.licenseActive");
    this._sendToWebview({
      command: "licenseResult",
      success: !!active,
      message: active ? "已激活" : "未激活",
    });
  }

  async _insertComment(text) {
    const active = this._context.globalState.get("chineseAI.licenseActive");

    if (!active) {
      this._sendToWebview({
        command: "insertResult",
        success: false,
        message: "请先激活授权码",
      });
      return;
    }

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      this._sendToWebview({
        command: "insertResult",
        success: false,
        message: "请先打开一个代码文件",
      });
      return;
    }

    const comment = text ? `// ${text}\n` : "// AI 生成注释\n";

    await editor.edit((editBuilder) => {
      editBuilder.insert(editor.selection.start, comment);
    });

    this._sendToWebview({ command: "insertResult", success: true });
  }

  _sendToWebview(message) {
    if (this._view && this._view.webview) {
      this._view.webview.postMessage(message);
    }
  }
}

function activate(context) {
  const provider = new ChineseAISidebarProvider(context.extensionUri, context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("chineseAI.sidebar", provider, {
      webviewOptions: { retainContextWhenHidden: true },
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("chineseAI.openSidebar", async () => {
      await vscode.commands.executeCommand(
        "workbench.view.extension.chineseAI-container"
      );
    })
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
