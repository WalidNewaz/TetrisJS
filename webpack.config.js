const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    // piece: './src/piece.js',
    // board: './src/board.js',
    // print: '/src/print.js'
  },
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Output Management",
      template: "./src/index.html",
    }),
  ],
  output: {
    filename: "[name].bundle.[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "single",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        include: path.resolve(__dirname, "src"),
        type: "asset/resource",
      },
    ],
  },
  // module: {
  //     rules: [
  //         {
  //             test: /\.css$/i,
  //             use: ['style-loader', 'css-loader']
  //         },
  //         {
  //             test: /\.(png|svg|jpg|jpeg|gif)$/i,
  //             type: 'asset/resource',
  //         },
  //         {
  //           test: /\.(woff|woff2|eot|ttf|otf)$/i,
  //           type: 'asset/resource',
  //         },
  //     ]
  // }
};
