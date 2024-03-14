/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function (e, argv = { isProduction }) {
  const MODE = argv.mode || 'development';
  const NODE_ENV = process.env.NODE_ENV || MODE;
  process.env.NODE_ENV = NODE_ENV;
  process.env.BABEL_ENV = NODE_ENV;

  const ENABLE_SENTRY = ['1', 'true', 'yes', 'y'].indexOf(process.env.CUUI_LS_ENABLE_SENTRY) >= 0;
  const GIT_REVISION = getGitRevision();

  const EXPOSE_ENV = {
    NODE_ENV,
    ENABLE_SENTRY,
    GIT_REVISION
  };

  logEnv(EXPOSE_ENV);

  const config = {
    ...e,
    stats: {
      assets: false,
      chunks: false,
      children: false
    },
    devtool: 'cheap-source-map',
    entry: {
      loadingScreen: path.resolve(__dirname, 'src/loadingScreen/index.tsx'),
      mainScreen: path.resolve(__dirname, 'src/mainScreen/preload.ts'),
      protectedScreen: path.resolve(__dirname, 'src/protectedScreen/preload.ts'),
      worldSpace: path.resolve(__dirname, 'src/worldSpace/index.tsx')
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: [/\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'images/[name].[ext]'
              }
            },
            {
              test: [/\.ttf$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'fonts/[name].[ext]'
              }
            },
            {
              test: /\.tsx?$/,
              exclude: /node_modules/,
              sideEffects: true,
              use: [
                {
                  loader: require.resolve('babel-loader')
                },
                {
                  loader: require.resolve('ts-loader')
                }
              ]
            },
            {
              test: /\.scss$/,
              exclude: /node_modules/,
              sideEffects: true,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader
                },
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    sourceMap: true
                  }
                },
                {
                  loader: require.resolve('sass-loader'),
                  options: {
                    sourceMap: true
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    optimization: {
      minimize: false,
      splitChunks: {
        chunks: 'all'
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': Object.keys(EXPOSE_ENV).reduce((e, key) => {
          e[key] = JSON.stringify(EXPOSE_ENV[key]);
          return e;
        }, {})
      }),
      new HtmlWebpackPlugin({
        filename: 'loadingScreen.html',
        template: 'src/loadingScreen/loadingScreen.html',
        chunks: ['loadingScreen']
      }),
      new HtmlWebpackPlugin({
        filename: 'mainScreen.html',
        template: 'src/mainScreen/mainScreen.html',
        chunks: ['mainScreen']
      }),
      new HtmlWebpackPlugin({
        filename: 'protectedScreen.html',
        template: 'src/protectedScreen/protectedScreen.html',
        chunks: ['protectedScreen']
      }),
      new HtmlWebpackPlugin({
        filename: 'worldSpace.html',
        template: 'src/worldSpace/worldSpace.html',
        chunks: ['worldSpace']
      }),
      // placeholder until we have dynamic asset pipeline built
      new CopyWebpackPlugin([{context: './dynamic/', from: '**/*', to: './dynamic'}]),
      new MiniCssExtractPlugin()
    ],
    performance: {
      hints: false
    },
    node: {
      child_process: 'empty',
      dns: 'empty',
      net: 'empty',
      tls: 'empty',
    },
  };
  

  return config;
};

function getGitRevision() {
  let GIT_REVISION = 'unknown';
  try {
    GIT_REVISION = require('child_process').execSync('git rev-parse HEAD').toString().trim();
  } catch (e) {
    console.error(e);
  }
  return GIT_REVISION;
}

function logEnv(env) {
  console.log('WEBPACK ENVIRONMENT');
  Object.keys(env).forEach((key) => {
    console.log(`  ${key}: ${JSON.stringify(env[key])}`);
  });
}
