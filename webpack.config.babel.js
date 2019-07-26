/* eslint-disable func-names, import/no-dynamic-require */
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import modifyResponse from 'http-proxy-response-rewrite';
import path from 'path';
import url from 'url';
import emoji from 'emojis';
import chalk from 'chalk';
import {
  bundleScript,
  devConfig
} from './dev';

module.exports = function(env) {

  const experimentName = env.experiment !== true ? env.experiment : 'example';
  const filename = experimentName ? `${experimentName}.bundle.js` : 'bundle.js';

  let projectConfig;

  try {
    projectConfig = require(`./src/${experimentName}/config`).config;
  } catch (e) {
    if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
      console.log(chalk.cyan(emoji.unicode('No project config! :eyes:')));
    } else { throw e; }
  }

  const config = devConfig(projectConfig);

  console.log(chalk.cyan(emoji.unicode(`Dev config :dancer:: \n${JSON.stringify(config)}`)));

  const {
    disableRewrite,
    url: experimentURL,
    polyfill,
    port
  } = config;

  const {
    host,
    path: parsedPath,
    protocol
  } = url.parse(experimentURL);

  const entry = [path.join(__dirname, `./src/${experimentName}`)];
  if (polyfill) entry.unshift(...polyfill);

  return {
    entry: entry,
    cache: false,
    resolve: {
      extensions: ['.js', '.styl']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      // filename: `${experimentName ? experimentName : '[name]'}bundle.[hash].js`,
      filename: filename,
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          include: [
            path.resolve(__dirname, './src/')
          ],
          loader: 'babel-loader'
        },
        {
          test: /\.(css|styl)$/,
          use: [
            {
              loader: 'style-loader' // creates style nodes from JS strings
            },
            {
              loader: 'css-loader' // translates CSS into CommonJS
            },
            {
              loader: 'stylus-loader', // compiles Stylus to CSS
              options: {
                sourceMap: true,
                includePaths: [
                  path.resolve(__dirname, './src/')
                ]
              }
            },
            {
              loader: 'postcss-loader' // load postcss postcss.config.js
              // options: {
              //   sourceMap: true
              // }
            }
          ]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: { minimize: true }
            }
          ]
        }
      ]
    },
    // NOTE: Use with local template
    // performance: {
    //   hints: 'warning', // enum
    //   maxAssetSize: 400000, // int (in bytes),
    //   maxEntrypointSize: 400000, // int (in bytes)
    //   assetFilter: function(assetFilename) {
    //     // Function predicate that provides asset filenames
    //     console.log(assetFilename);
    //     return assetFilename.endsWith('.styl') || assetFilename.endsWith('.js');
    //   }
    // },
    devServer: {
      // host: '...',
      // hot: true,
      // noInfo: true,
      // quiet: true,
      compress: true, // disable gzip
      contentBase: path.join(__dirname, 'dist'),
      https: true,
      index: '',
      open: 'Google Chrome',
      openPage: parsedPath.substring(1),
      overlay: {
        warnings: true,
        errors: true
      },
      port: port,
      // headers: {
      //   'Access-Control-Allow-Origin': '*'
      // },
      proxy: {
        '/': {
          context: () => true,
          target: `${protocol}//${host}`,
          secure: protocol.indexOf('s') > 0,
          pathRewrite: { '^/': '' },
          // rewrite: function(req) {
          //   req.url = req.url.replace(/^\/gbuk/, '');
          // },
          changeOrigin: true,
          onProxyRes: (proxyRes, req, res) => {
            // req.get('accept'));
            if (/text\/html/.test(req.get('accept'))) {
              if (!disableRewrite) {
                modifyResponse(res, proxyRes.headers['content-encoding'], (body) => {
                  if (body) {
                    // modify some information
                    const updateText = '</head>'; // modify where the script is inserted
                    const modifiedBody = body.replace(new RegExp(host, 'g'), `localhost:${port}`);
                    const scriptedBody = modifiedBody.replace(new RegExp(updateText, 'g'), `${bundleScript(filename)}${updateText} `);
                    return scriptedBody;
                  }
                  return body;
                });
              }
            }
          }
        }
      },
      publicPath: '/',
      stats: 'minimal'
    },
    devtool: env.prod ? 'none' : 'eval',
    mode: env.prod ? 'production' : 'development',
    watch: true,
    plugins: [
      new CleanWebpackPlugin()
      // NOTE: Uncomment to use local template
      // new HtmlWebpackPlugin({
      //   template: path.join(__dirname, './src/index.html'),
      //   inject: 'body'
      // })
    ]
  };
};
