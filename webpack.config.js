require("dotenv").config();
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const isProd = process.env.NODE_ENV === "production" ? true : false;
console.log(`**********  ENVIRONMENT = ${process.env.NODE_ENV}  **********`);

const devWebviewWebpackConfig = {
  mode: "development",
  devtool: "source-map",
  devServer: {
    contentBase: "./dist",
    port: process.env.WEBPACK_DEV_SERVER_PORT,
    disableHostCheck: true,
    hot: true,
    watchContentBase: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  optimization: {},
};

const devExtensionWebpackConfig = {
  mode: "development",
  devtool: "source-map",
  optimization: {},
};

const cspPluginConfig = isProd
  ? {
      "script-src": ["https://*.vscode-webview.net", "https://*"],
      "style-src": ["https://*.vscode-webview.net", "https://*"],
      "default-src": ["https://*.vscode-webview.net", "https://*"],
    }
  : {
      "default-src": [
        "https://*.vscode-webview.net",
        "http://localhost:8080",
        "ws://localhost:8080",
        "https://*",
      ],
    };

const webViewConfig = {
  mode: "production",
  target: "web",
  entry: { bundle: "./src/index.js", globals: "./template/globals.js" },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      title: "WeatherMan",
      template: "template/index.html",
      chunks: ["globals", "bundle"],
      chunksSortMode: "manual",
    }),
    new CspHtmlWebpackPlugin(cspPluginConfig),
    new MiniCssExtractPlugin(),
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.m?js|jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: ["babel-loader"],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  ...(!isProd && devWebviewWebpackConfig),
};

const extensionConfig = {
  mode: "production",
  target: "node",
  entry: "./extension.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "extension.js",
    library: {
      type: "commonjs2",
    },
    devtoolModuleFilenameTemplate: "../[resource-path]",
  },
  externals: {
    vscode: "commonjs vscode", // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: ["babel-loader"],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  ...(!isProd && devExtensionWebpackConfig),
};

module.exports = [webViewConfig, extensionConfig];
