const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const vueLoaderConfig = require('./vue-loader.conf');
const util = require('./utils');
module.exports = ({
  mode = "development",
  rootPath,
  publicPath,
  outputHTML = false
}) => {
  const isProd = mode === 'production';
  const conf = {
    mode,
    output: {
      publicPath: publicPath,
      filename: "js/[name].js"
    },
    module: {
      rules: [
        ...util.styleLoaders({ sourceMap: isProd, extract: isProd, usePostCSS: true }),
        {
          test: /\.js$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                //如果有这个设置则不用再添加.babelrc文件进行配置
                presets: ["@babel/preset-env"],
                plugins: ["dynamic-import-webpack"]
              }
            }
          ]
        },
        {
          test: /\.vue$/,
          loader: "vue-loader",
          options: vueLoaderConfig(isProd),
        },
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: "css/common.css"
      })
    ],
    resolve: {
      extensions: [".vue", ".js", ".json"]
    }
  };
  outputHTML &&
    conf.plugins.push(
      new HtmlWebpackPlugin({
        template: `${rootPath}/index.html`,
        hash: true,
        minify: {
          collapseWhitespace: true,
          minifyJS: true,
          minifyCSS: true,
          processScripts: ["text/x-template"]
        }
      })
    );
  return conf;
};
