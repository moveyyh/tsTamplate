const fs = require("fs");
const path = require("path");
const process = require("process");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const viewPath = path.resolve(process.cwd(), "./src/view");
const viewDir = fs.readdirSync(viewPath);

const entry = {};
const output = {}

const viewPlugins = viewDir.map((fileName) => {
  entry[fileName] = path.resolve(viewPath, fileName, "./main.ts");
  output[fileName] = `[name].[hash].js`

  return new HtmlWebpackPlugin({
    template: path.resolve(viewPath, fileName, "./index.html"),
    chunks: [fileName],
    filename: `${fileName}.html`,
  });
});

module.exports = {
  mode: "development",

  entry,

  output: {
    path: path.resolve(process.cwd(), "./dist"),
    filename: "[name].[hash].js",
  },

  devServer: {
    contentBase: path.resolve(process.cwd(), "./dist"),
    compress: true,
    open: true,
    port: 8088,
  },

  resolve: {
    extensions: [".ts", ".tsx", ".json", ".js"],
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 50,
              outputPath: "assets",
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.css/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader", // 将 JS 字符串生成为 style 节点
          },
          {
            loader: "css-loader", // 将 CSS 转化成 CommonJS 模块
          },
          {
            loader: "sass-loader", // 将 Sass 编译成 CSS
          },
        ],
      },
    ],
  },

  plugins: [...viewPlugins],
};
