// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const { location, weather, ipaddress } = require("./src/services");
const { tap, mergeMap, from, merge } = require("rxjs");

let weatherManStatusBarItem;

const loadWeatherData = (context) => {
  weatherManStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    0
  );
  weatherManStatusBarItem.command = "weatherman.forecast";
  weatherManStatusBarItem.show();
  weatherManStatusBarItem.tooltip = "Fetching forecast...";
  weatherManStatusBarItem.text = `WeatherMan`;

  ipaddress
    .getIpAddress()
    .pipe(
      mergeMap((ipaddr) => location.getGeoLocation(ipaddr)),
      tap((geolocation) => {
        const geo = {
          geolocation: geolocation,
          timestamp: new Date(),
        };
        from(context.globalState.update("location", geo));
      }),
      mergeMap(({ latitude, longitude }) =>
        weather.getDailyWeatherForecast(latitude, longitude)
      ),
      tap((weather) => {
        const dailyForecast = {
          forecast: weather,
          timestamp: new Date(),
        };
        from(context.globalState.update("dailyForecast", dailyForecast));
      })
    )
    .subscribe(() => {
      console.log("location: ", context.globalState.get("location"));
      console.log("weather: ", context.globalState.get("weather"));
    });

  // weather.getWeatherFromGeo(12.95396, 77.4908543).subscribe((res) => {
  //   console.log("res: ", res);
  //   const weatherStatus = "res.dataseries[0].weather";
  //   // weatherManStatusBarItem.text = `${service.weather.generateWeatherUnicode(
  //   //   weatherStatus
  //   // )} ${weatherStatus}`;
  //   weatherManStatusBarItem.tooltip = "Click for weather forecst";
  // });
};

const getWeeklyData = () => {};

const getWebviewContent = (context, weatherManPanel) => {
  let webviewScriptUri, webviewStyleUri, globalsScriptUri;
  const devPort = 8080;
  const jsFile = "bundle.js";
  const globalsFile = "globals.js";
  const cssFile = "bundle.css";
  if (process.env.NODE_ENV === "development") {
    webviewScriptUri = `http://localhost:${devPort}/${jsFile}`;
    webviewStyleUri = `http://localhost:${devPort}/${cssFile}`;
    globalsScriptUri = `http://localhost:${devPort}/${globalsFile}`;
  } else {
    webviewScriptUri = weatherManPanel.webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, "dist", jsFile))
    );
    globalsScriptUri = weatherManPanel.webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, "dist", globalsFile))
    );
    webviewStyleUri = weatherManPanel.webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, "dist", cssFile))
    );
  }
  const htmlTemplateOnDisk = vscode.Uri.file(
    path.join(context.extensionPath, "dist", "index.html")
  );
  let htmlTemplate = fs.readFileSync(htmlTemplateOnDisk.path).toString();
  htmlTemplate = htmlTemplate.replace(cssFile, webviewStyleUri.toString());
  htmlTemplate = htmlTemplate.replace(jsFile, webviewScriptUri.toString());
  htmlTemplate = htmlTemplate.replace(globalsFile, globalsScriptUri.toString());
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
  loadWeatherData(context);
  context.globalState.update("abcd", 1).then();
  console.log("abcd: ", context.globalState.get("abcd"));
  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
