/* eslint-disable func-names */
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const modifyResponse = require('http-proxy-response-rewrite');

const port = 8080;

module.exports = function(env) {
  const experimentName = env.experiment ? env.experiment : '';
  const filename = experimentName ? `${experimentName}.bundle.js` : 'bundle.js';

  const bundleScript = `<script type="text/javascript" src="${filename}"></script>`;

  return {
    entry: [
      // 'babel-polyfill',
      path.join(__dirname, `./src/${experimentName}`)
    ],
    cache: false,
    resolve: {
      extensions: ['.js', '.styl']
    },
    // optimization: {
    //   splitChunks: {
    //     cacheGroups: {
    //       commons: {
    //         name: 'commons',
    //         chunks: 'initial',
    //         minChunks: 2,
    //         minSize: 0
    //       }
    //     }
    //   },
    //   occurrenceOrder: true // To keep filename consistent between different modes (for example building only)
    // },
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
    performance: {
      hints: 'warning', // enum
      maxAssetSize: 400000, // int (in bytes),
      maxEntrypointSize: 400000, // int (in bytes)
      assetFilter: function(assetFilename) {
        // Function predicate that provides asset filenames
        return assetFilename.endsWith('.style') || assetFilename.endsWith('.js');
      }
    },
    mode: env.prod ? 'production' : 'development',
    devtool: env.prod ? 'none' : 'eval',
    watch: true,
    devServer: {
      // hot: true,
      // quiet: true
      // host: '...',
      overlay: {
        warnings: true,
        errors: true
      },
      port: port,
      compress: false, // disable gzip
      contentBase: path.join(__dirname, 'dist'),
      https: true,
      index: '',
      // index: 'gbuk/index.html',
      // noInfo: true, // webpack bundle information
      open: 'Google Chrome',
      openPage: 'gbuk/index.html',
      proxy: {
        '/': {
          context: () => true,
          target: 'https://www.currys.co.uk/',
          secure: true,
          pathRewrite: { '^/': '' },
          // rewrite: function(req) {
          //   req.url = req.url.replace(/^\/gbuk/, '');
          // },
          changeOrigin: true,
          onProxyRes: (proxyRes, req, res) => {
            modifyResponse(res, proxyRes.headers['content-encoding'], (body) => {
              if (body) {
                // modify some information
                const modifiedBody = body.replace(new RegExp('www.currys.co.uk', 'g'), `localhost:${port}`);
                const scriptedBody = modifiedBody.replace(new RegExp('<!-- /AdobeDTM_Header code -->', 'g'), `${bundleScript}<!-- /AdobeDTM_Header code --> `);
                return scriptedBody;
              }
              return body;
            });
          }
        }
      },
      publicPath: '/gbuk/'
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      // new HtmlWebpackPlugin({
      //   template: path.join(__dirname, './src/index.html'),
      //   inject: 'body'
      // })
    ]
  };
};
