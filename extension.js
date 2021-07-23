const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const { location, weather, ipaddress } = require("./src/services");
const {
  tap,
  mergeMap,
  from,
  Subject,
  share,
  forkJoin,
  filter,
} = require("rxjs");
const {
  weatherManEmojis,
  emojiConstants,
} = require("./src/config/constants/emoji");
const { labels } = require("./src/config/constants/labels");
const { extensionSettings } = require("./src/config/settings/extension");
const { timeDiffT2MinusT1, msToHrs, HrstoMs } = require("./src/utils/time");

let weatherManStatusBarItem;
const geographySubject = new Subject();
let geoLocation = null,
  weeklyForecast = null,
  dailyForecast = null;
let fetchDataInterval, updateStatusBarInterval;

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

const getIpAddress = (context) => {
  const globalState = context.globalState;
  const { storage, services } = extensionSettings;
  return ipaddress.getIpAddress().pipe(
    filter((ipAddress) => {
      const exisitingIpAddress = globalState.get(storage.ipAddress);
      if (exisitingIpAddress) {
        const now = new Date().getTime();
        const lastUpdated = new Date(exisitingIpAddress.timestamp).getTime();
        const hourdiff = msToHrs(timeDiffT2MinusT1(lastUpdated, now));
        if (
          hourdiff <= services.ipAddrUpdateFreqInHrs &&
          ipAddress === exisitingIpAddress.ipAddress
        ) {
          geoLocation = globalState.get(storage.location);
          weeklyForecast = globalState.get(storage.weeklyForecast);
          dailyForecast = globalState.get(storage.dailyForecast);
          return false;
        }
        return true;
      }
      return true;
    })
  );
};

const fetchData = (context) => {
  const globalState = context.globalState;
  const { storage } = extensionSettings;
  const geography = getIpAddress(context).pipe(
    tap((ipaddr) => {
      const publicAddress = {
        ipAddress: ipaddr,
        timestamp: new Date().getTime(),
      };
      from(globalState.update(storage.ipAddress, publicAddress));
    }),
    mergeMap((ipaddr) => location.getGeoLocation(ipaddr)),
    tap((geolocation) => {
      const geo = {
        geolocation: geolocation,
        timestamp: new Date().getTime(),
      };
      from(globalState.update(storage.location, geo));
    }),
    share({ connector: () => geographySubject })
  );

  const dailyWeather = geography.pipe(
    mergeMap(({ latitude, longitude }) =>
      weather.getDailyWeatherForecast(latitude, longitude)
    ),
    tap((weather) => {
      const dailyForecast = {
        forecast: weather,
        timestamp: new Date().getTime(),
      };
      from(globalState.update(storage.dailyForecast, dailyForecast));
    })
  );

  const weeklyWeather = geography.pipe(
    mergeMap(({ latitude, longitude }) =>
      weather.getWeeklyWeatherForecast(latitude, longitude)
    ),
    tap((weather) => {
      const weeklyForecast = {
        forecast: weather,
        timestamp: new Date().getTime(),
      };
      from(globalState.update(storage.weeklyForecast, weeklyForecast));
    })
  );

  forkJoin({ dailyWeather, weeklyWeather }).subscribe(() => {
    geoLocation = globalState.get(storage.location);
    weeklyForecast = globalState.get(storage.weeklyForecast);
    dailyForecast = globalState.get(storage.dailyForecast);
  });
};

const getWebviewContent = (context, weatherManPanel) => {
  const { webpackConfig } = extensionSettings;
  const outputPath = path.join(context.extensionPath, webpackConfig.outputDir);
  let webviewScriptUri, webviewStyleUri, globalsScriptUri;
  if (process.env.NODE_ENV === "development") {
    const server = extensionSettings.webpackConfig.developmentServer;
    webviewScriptUri = `${server}/${webpackConfig.webviewJsFile}`;
    webviewStyleUri = `${server}/${webpackConfig.webviewCssFile}`;
    globalsScriptUri = `${server}/${webpackConfig.globalJsFile}`;
  } else {
    webviewScriptUri = weatherManPanel.webview.asWebviewUri(
      vscode.Uri.file(path.join(outputPath, webpackConfig.webviewJsFile))
    );
    globalsScriptUri = weatherManPanel.webview.asWebviewUri(
      vscode.Uri.file(path.join(outputPath, webpackConfig.globalJsFile))
    );
    webviewStyleUri = weatherManPanel.webview.asWebviewUri(
      vscode.Uri.file(path.join(outputPath, webpackConfig.webviewCssFile))
    );
  }
  const htmlTemplateOnDisk = vscode.Uri.file(
    path.join(outputPath, webpackConfig.htmlFile)
  );
  let htmlTemplate = fs.readFileSync(htmlTemplateOnDisk.fsPath).toString();
  htmlTemplate = htmlTemplate
    .replace(webpackConfig.webviewCssFile, webviewStyleUri.toString())
    .replace(webpackConfig.webviewJsFile, webviewScriptUri.toString())
    .replace(webpackConfig.globalJsFile, globalsScriptUri.toString());
  return htmlTemplate;
};

const activate = (context) => {
  const { webpackConfig, services } = extensionSettings;
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
              path.join(context.extensionPath, webpackConfig.outputDir)
            ),
          ],
        }
      );
      weatherManPanel.iconPath = vscode.Uri.file(
        path.join(
          context.extensionPath,
          webpackConfig.outputDir,
          webpackConfig.weatherManIcon
        )
      );

      const publishWeatherUpdates = () => {
        weatherManPanel.webview
          .postMessage({
            weeklyForecast,
            dailyForecast,
            geoLocation,
          })
          .then();
      };

      const updateWebview = () => {
        weatherManPanel.webview.html = getWebviewContent(
          context,
          weatherManPanel
        );
        publishWeatherUpdates();
      };

      // Set initial content
      updateWebview();

      // And schedule updates to the content every second
      let updateWebviewInterval = setInterval(
        updateWebview,
        services.updateWebviewFreqinMs
      );

      weatherManPanel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case "recieved_data":
              // cancel any future updates when webview recieves the data
              clearInterval(updateWebviewInterval);
              // schedule updates to webview
              updateWebviewInterval = setInterval(
                publishWeatherUpdates,
                HrstoMs(services.publishUpdateToWebviewFreqinHrs)
              );
              return;
          }
        },
        undefined,
        context.subscriptions
      );

      weatherManPanel.onDidDispose(
        () => {
          // When the panel is closed, cancel any future updates to the webview content
          if (updateWebviewInterval) {
            clearInterval(updateWebviewInterval);
          }
        },
        null,
        context.subscriptions
      );
    }
  );
  activateWeatherMan();
  fetchData(context);
  updateStatusBarInterval = setInterval(
    () => updateStatusBar(),
    services.statusBarUpdateFreqinMs
  );
  fetchDataInterval = setInterval(
    () => fetchData(context),
    HrstoMs(services.dataUpdateFreqInHrs)
  );
  context.subscriptions.push(disposable);
};

const deactivate = () => {
  if (updateStatusBarInterval) {
    clearInterval(updateStatusBarInterval);
  }
  if (fetchDataInterval) {
    clearInterval(fetchDataInterval);
  }
};

module.exports = {
  activate,
  deactivate,
};
