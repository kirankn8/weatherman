const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const webViewConfig = {
  mode: "development",
  target: "web", // default
  devtool: "source-map",
  devServer: {
    contentBase: "./dist",
  },
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin({
      title: "WeatherMan",
      template: "template/index.html",
    }),
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
        use: ["style-loader", "css-loader"],
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
  devServer: {
    contentBase: "./dist",
  },
  entry: "./extension.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "extension.js",
    library: {
      type: "commonjs2",
    },
    devtoolModuleFilenameTemplate: "../[resource-path]",
    clean: true,
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
