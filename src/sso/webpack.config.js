const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

module.exports = {
  context: path.resolve(__dirname, "../.."),
  entry: "./src/sso/index.js",
  output: {
    filename: "bundle.min.js",
    publicPath: "/",
    path: path.resolve(__dirname, "../../public"),
  },
  devtool: "inline-source-map",
  resolve: {
    alias: {},
    extensions: [".js", ".jsx", ".svg", ".png", ".css", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          rootMode: "upward",
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loader: "@svgr/webpack",
      },
      {
        test: /\.(png|jpg|gif)$/i,
        exclude: /node_modules/,
        type: "asset/inline",
      },
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 99,
    }),
    new Dotenv({
      path: "./.env." + process.env.NODE_ENV,
      safe: false, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: false, // hide any errors
      defaults: false, // load '.env.defaults' as the default values if empty.
      ignoreStub: true,
    }),
  ],
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: "async",
      minChunks: 1,
    },
    moduleIds: "named",
    chunkIds: "named",
    runtimeChunk: false,
  },
  node: false,
};
