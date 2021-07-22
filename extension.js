const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const { location, weather, ipaddress } = require("./src/services");
const { tap, mergeMap, from, Subject, share, forkJoin } = require("rxjs");
const {
  weatherManEmojis,
  emojiConstants,
} = require("./src/config/constants/emoji");
const { labels } = require("./src/config/constants/labels");
const { extensionSettings } = require("./src/config/settings/extension");

let weatherManStatusBarItem;
const geographySubject = new Subject();
let geoLocation = null,
  weeklyForecast = null,
  dailyForecast = null;

const activateWeatherMan = () => {
  weatherManStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    extensionSettings.statusBarPriority
  );
  const waitingEmoji = weatherManEmojis[emojiConstants.WAITING].unicode;
  weatherManStatusBarItem.show();
  weatherManStatusBarItem.tooltip = labels.extensionInactiveTooltip;
  weatherManStatusBarItem.text = `${waitingEmoji} ${labels.extensionName}`;
};

const updateStatusBar = () => {
  if (weeklyForecast && dailyForecast) {
    const { weather: weatherStatus } = weather.getCurrentWeatherUpdate(
      weeklyForecast.forecast
    );
    const weatherEmoji = weather.generateWeatherEmoji(weatherStatus).unicode;
    const { temperature } = weather.getCurrentWeatherUpdate(
      dailyForecast.forecast
    );
    const thermometerEmoji =
      weatherManEmojis[emojiConstants.THERMOMETER].unicode;
    weatherManStatusBarItem.text = `${weatherEmoji} ${weatherStatus} ${thermometerEmoji} ${temperature}`;
    weatherManStatusBarItem.command = extensionSettings.invocationCmd;
    weatherManStatusBarItem.tooltip = labels.extensionActiveTooltip;
    weatherManStatusBarItem.command = extensionSettings.invocationCmd;
  }
};

const loadData = (context) => {
  geoLocation = context.globalState.get(extensionSettings.storage.location);
  if (geoLocation) {
    const now = +new Date();
    const lastUpdated = +new Date(geoLocation.timestamp);
    const msToHrs = 3600000;
    const hourdiff = (now - lastUpdated) / msToHrs;
    if (hourdiff <= extensionSettings.services.updateFrequencyInHrs) {
      weeklyForecast = context.globalState.get(
        extensionSettings.storage.weeklyForecast
      );
      dailyForecast = context.globalState.get(
        extensionSettings.storage.dailyForecast
      );
      updateStatusBar();
    } else {
      fetchData(context);
    }
  } else {
    fetchData(context);
  }
};

const fetchData = (context) => {
  const geography = ipaddress.getIpAddress().pipe(
    mergeMap((ipaddr) => location.getGeoLocation(ipaddr)),
    tap((geolocation) => {
      const geo = {
        geolocation: geolocation,
        timestamp: new Date(),
      };
      from(context.globalState.update(extensionSettings.storage.location, geo));
    }),
    share({ connector: () => geographySubject })
  );

  const daily = geography.pipe(
    mergeMap(({ latitude, longitude }) =>
      weather.getDailyWeatherForecast(latitude, longitude)
    ),
    tap((weather) => {
      const dailyForecast = {
        forecast: weather,
        timestamp: new Date(),
      };
      from(
        context.globalState.update(
          extensionSettings.storage.dailyForecast,
          dailyForecast
        )
      );
    })
  );
  const weekly = geography.pipe(
    mergeMap(({ latitude, longitude }) =>
      weather.getWeeklyWeatherForecast(latitude, longitude)
    ),
    tap((weather) => {
      const weeklyForecast = {
        forecast: weather,
        timestamp: new Date(),
      };
      from(
        context.globalState.update(
          extensionSettings.storage.weeklyForecast,
          weeklyForecast
        )
      );
    })
  );

  forkJoin({ daily, weekly }).subscribe(() => {
    geoLocation = context.globalState.get(extensionSettings.storage.location);
    weeklyForecast = context.globalState.get(
      extensionSettings.storage.weeklyForecast
    );
    dailyForecast = context.globalState.get(
      extensionSettings.storage.dailyForecast
    );
    updateStatusBar();
  });
};

const getWebviewContent = (context, weatherManPanel) => {
  let webviewScriptUri, webviewStyleUri, globalsScriptUri;
  if (process.env.NODE_ENV === "development") {
    const server = extensionSettings.webpackConfig.developmentServer;
    webviewScriptUri = `${server}/${extensionSettings.webpackConfig.webviewJsFile}`;
    webviewStyleUri = `${server}/${extensionSettings.webpackConfig.webviewCssFile}`;
    globalsScriptUri = `${server}/${extensionSettings.webpackConfig.globalJsFile}`;
  } else {
    webviewScriptUri = weatherManPanel.webview.asWebviewUri(
      vscode.Uri.file(
        path.join(
          context.extensionPath,
          extensionSettings.webpackConfig.outputDir,
          extensionSettings.webpackConfig.webviewJsFile
        )
      )
    );
    globalsScriptUri = weatherManPanel.webview.asWebviewUri(
      vscode.Uri.file(
        path.join(
          context.extensionPath,
          extensionSettings.webpackConfig.outputDir,
          extensionSettings.webpackConfig.globalJsFile
        )
      )
    );
    webviewStyleUri = weatherManPanel.webview.asWebviewUri(
      vscode.Uri.file(
        path.join(
          context.extensionPath,
          extensionSettings.webpackConfig.outputDir,
          extensionSettings.webpackConfig.webviewCssFile
        )
      )
    );
  }
  const htmlTemplateOnDisk = vscode.Uri.file(
    path.join(
      context.extensionPath,
      extensionSettings.webpackConfig.outputDir,
      extensionSettings.webpackConfig.htmlFile
    )
  );
  let htmlTemplate = fs.readFileSync(htmlTemplateOnDisk.fsPath).toString();
  htmlTemplate = htmlTemplate
    .replace(
      extensionSettings.webpackConfig.webviewCssFile,
      webviewStyleUri.toString()
    )
    .replace(
      extensionSettings.webpackConfig.webviewJsFile,
      webviewScriptUri.toString()
    )
    .replace(
      extensionSettings.webpackConfig.globalJsFile,
      globalsScriptUri.toString()
    );
  return htmlTemplate;
};

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    extensionSettings.invocationCmd,
    () => {
      const weatherManPanel = vscode.window.createWebviewPanel(
        extensionSettings.viewType,
        extensionSettings.appName,
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            vscode.Uri.file(
              path.join(
                context.extensionPath,
                extensionSettings.webpackConfig.outputDir
              )
            ),
          ],
        }
      );
      weatherManPanel.iconPath = vscode.Uri.file(
        path.join(
          context.extensionPath,
          extensionSettings.webpackConfig.outputDir,
          extensionSettings.webpackConfig.weatherManIcon
        )
      );

      const updateWebview = () => {
        weatherManPanel.webview.html = getWebviewContent(
          context,
          weatherManPanel
        );
        weatherManPanel.webview
          .postMessage({
            weeklyForecast,
            dailyForecast,
            geoLocation,
          })
          .then();
      };

      // Set initial content
      updateWebview();

      // And schedule updates to the content every second
      const interval = setInterval(updateWebview, 1000);

      weatherManPanel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case "recieved_data":
              // cancel any future updates when webview recieves the data
              clearInterval(interval);
              return;
          }
        },
        undefined,
        context.subscriptions
      );

      weatherManPanel.onDidDispose(
        () => {
          // When the panel is closed, cancel any future updates to the webview content
          clearInterval(interval);
        },
        null,
        context.subscriptions
      );
    }
  );
  activateWeatherMan();
  loadData(context);
  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
