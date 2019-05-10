const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = ({
  mode = 'development',
  rootPath, 
  publicPath,
  outputHTML = false,
}) => {
  const conf =  {
    mode,
    output: {
      publicPath: publicPath,
      filename: 'js/[name].js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [{
            loader: 'babel-loader', 
            options: {//如果有这个设置则不用再添加.babelrc文件进行配置
              "presets": ['@babel/preset-env'],
              "plugins": ["dynamic-import-webpack"]
            }
          }]
        },
        {
          test: /\.vue$/,
          use: "vue-loader"
        },
        {
          test: /\.css$/,
          use: [
            mode === 'production' ? {
              loader: MiniCssExtractPlugin.loader,
            } : 'vue-style-loader',
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: 'common.css'
      }),
    ],
    resolve: {
      extensions: ['.vue', '.js', '.json']
    },
  };  
  outputHTML && conf.plugins.push(new HtmlWebpackPlugin({
    template: `${rootPath}/index.html`,
    hash: true,
    minify: { collapseWhitespace: true, minifyJS: true, minifyCSS: true, processScripts: ['text/x-template'] }
  }));
  return conf;
}