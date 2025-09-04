const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";
const outDir = path.resolve(__dirname, "dist");

module.exports = {
  mode: isProd ? "production" : "development",
  entry: {
    loginPage: path.resolve(__dirname, "loginPage", "index.tsx"),
    dashboard: path.resolve(__dirname, "dashboard", "index.tsx"),
  },
  output: {
    path: outDir,
    filename: "[name]/bundle.[contenthash].js",
    publicPath: "/", 
    clean: false,
  },
  devtool: "source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "tsconfig.webpack.json"),
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf)$/,
        type: "asset/resource",
        generator: {
          filename: "[name][hash][ext]",
        },
      },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name]/styles.[contenthash].css",
    }),
    new HtmlWebpackPlugin({
      chunks: ["loginPage"],
      template: path.resolve(__dirname, "loginPage", "public", "login.html"),
      filename: "loginPage/public/login.html",
      inject: "body",
      minify: isProd,
    }),
    new HtmlWebpackPlugin({
      chunks: ["dashboard"],
      template: path.resolve(
        __dirname,
        "dashboard",
        "public",
        "dashboard.html"
      ),
      filename: "dashboard/public/dashboard.html",
      inject: "body",
      minify: isProd,
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      name: "common",
      filename: "common/[name].[contenthash].js",
    },
  },
  performance: { hints: false },
};
