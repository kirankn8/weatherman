// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

let weatherManStatusBarItem;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // console.log(abc);
  console.log("context.extensionPath: ", context.extensionPath);
  let disposable = vscode.commands.registerCommand(
    "weatherman.forecast",
    function () {
      const weatherManPanel = vscode.window.createWebviewPanel(
        "weatherMan",
        "WeatherMan",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, "dist")),
          ],
        }
      );

      const webviewScriptOnDisk = vscode.Uri.file(
        path.join(context.extensionPath, "dist", "bundle.js")
      );
      const webviewScriptUri =
        weatherManPanel.webview.asWebviewUri(webviewScriptOnDisk);
      const htmlTemplateOnDisk = vscode.Uri.file(
        path.join(context.extensionPath, "dist", "index.html")
      );
      let htmlTemplate = fs.readFileSync(htmlTemplateOnDisk.path).toString();
      htmlTemplate = htmlTemplate.replace(
        "bundle.js",
        webviewScriptUri.toString()
      );
      weatherManPanel.webview.html = htmlTemplate;
    }
  );

  weatherManStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    0
  );
  context.subscriptions.push(disposable);
  weatherManStatusBarItem.text = "Its rainy";
  weatherManStatusBarItem.command = "weatherman.forecast";
  weatherManStatusBarItem.backgroundColor = "green";
  weatherManStatusBarItem.show();
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
