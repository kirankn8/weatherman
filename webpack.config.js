require("dotenv").config();
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const webViewConfig = {
  mode: "development",
  target: "web", // default
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
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin({
      title: "WeatherMan",
      template: "template/index.html",
      // inject: false, // do not inject bundle as we are handling via template
    }),
    new MiniCssExtractPlugin(),
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    // clean: true,
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
};

const extensionConfig = {
  mode: "development",
  target: "node",
  devtool: "source-map",
  // devServer: {
  //   contentBase: "./dist",
  //   port: 8081,
  // },
  entry: "./extension.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "extension.js",
    library: {
      type: "commonjs2",
    },
    devtoolModuleFilenameTemplate: "../[resource-path]",
    // clean: true,
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
};

module.exports = [webViewConfig, extensionConfig];
