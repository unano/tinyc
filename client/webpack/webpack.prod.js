//const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    // new BundleAnalyzerPlugin()
    new CleanWebpackPlugin(),
    new CssMinimizerPlugin()
  ]
}
