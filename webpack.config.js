const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const join = path.join;
const resolve = path.resolve;

module.exports = {
  entry: join(__dirname, '/src/main.ts'),
  devtool: 'source-map',
  output: {
    filename: "main.js",
    path: join(__dirname, '/dist'),
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: 'assets/[contenthash].[ext]'
        }
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          "css-loader", "sass-loader"]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new HtmlWebpackPlugin({
      template: join(__dirname, '/src/index.html')
    }),
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['dist']
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.json', 'scss']
  }
};