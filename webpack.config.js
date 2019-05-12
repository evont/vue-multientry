const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const vueLoaderConfig = require("./vue-loader.conf");
const util = require("./utils");
const path = require("path");
module.exports = ({
  isProd,
  rootPath,
  publicPath,
  template,
  outputHTML = false
}) => {
  const conf = {
    mode: isProd ? 'production' : 'development',
    output: {
      publicPath: publicPath,
      filename: "js/[name].js",
      chunkFilename: "js/[name].js"
    },
    module: {
      rules: [
        ...util.styleLoaders({
          sourceMap: isProd,
          extract: isProd,
          usePostCSS: true
        }),
        {
          test: /\.vue$/,
          loader: "vue-loader",
          options: vueLoaderConfig(isProd)
        },
        {
          test: /\.js$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                //如果有这个设置则不用再添加.babelrc文件进行配置
                presets: ["@babel/preset-env"],
                plugins: ["syntax-dynamic-import"]
              }
            }
          ]
        }
      ]
    },
    optimization: isProd
      ? {
          concatenateModules: true,
          minimize: true,
          splitChunks: {
            //分割代码块

            cacheGroups: {
              //缓存组 缓存公共代码

              commons: {
                //公共模块
                name: "commons",
                chunks: "initial", //入口处开始提取代码
                minSize: 0, //代码最小多大，进行抽离
                minChunks: 2 //代码复 2 次以上的抽离
              },
              vendors: {
                test: /node_modules/,
                name: "vendors",
                minSize: 0,
                minChunks: 1,
                chunks: "initial",
                priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理
              }
            }
          }
        }
      : {},
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: "css/common.css"
      })
    ],
    performance: {
      maxEntrypointSize: 300000,
      hints: isProd ? "warning" : false
    },
    resolve: {
      extensions: [".vue", ".js", ".json"]
    }
  };
  outputHTML &&
    conf.plugins.push(
      new HtmlWebpackPlugin({
        template: template || `${rootPath}/index.html`,
        filename: template ? path.basename(template) : 'index.html',
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
