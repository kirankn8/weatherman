// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const service = require("./src/services");
const waiting = require("./src/config/constants");

let weatherManStatusBarItem;

const loadWeatherData = () => {
  weatherManStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    0
  );
  weatherManStatusBarItem.command = "weatherman.forecast";
  weatherManStatusBarItem.show();
  weatherManStatusBarItem.tooltip = "Fetching forecast...";
  weatherManStatusBarItem.text = `${waiting.waiting} WeatherMan`;

  service.weather.getWeatherFromGeo(12.95396, 77.4908543).subscribe((res) => {
    console.log("res: ", res);
    const weatherStatus = res.dataseries[0].weather;
    weatherManStatusBarItem.text = `${service.weather.generateWeatherUnicode(
      weatherStatus
    )} ${weatherStatus}`;
    weatherManStatusBarItem.tooltip = "Click for weather forecst";
  });
};

const getWebviewContent = (context, weatherManPanel) => {
  let webviewScriptUri, webviewStyleUri;
  const devPort = 8080;
  if (process.env.NODE_ENV !== "development") {
    webviewScriptUri = `http://localhost:${devPort}/bundle.js`;
    webviewStyleUri = `http://localhost:${devPort}/main.css`;
  } else {
    webviewScriptUri = weatherManPanel.webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, "dist", "bundle.js"))
    );
    webviewStyleUri = weatherManPanel.webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, "dist", "main.css"))
    );
  }
  const htmlTemplateOnDisk = vscode.Uri.file(
    path.join(context.extensionPath, "dist", "index.html")
  );
  let htmlTemplate = fs.readFileSync(htmlTemplateOnDisk.path).toString();
  htmlTemplate = htmlTemplate.replace("main.css", webviewStyleUri.toString());
  htmlTemplate = htmlTemplate.replace("bundle.js", webviewScriptUri.toString());
  return htmlTemplate;
};

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "weatherman.forecast",
    () => {
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
      weatherManPanel.webview.html = getWebviewContent(
        context,
        weatherManPanel
      );
    }
  );
  loadWeatherData();
  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
