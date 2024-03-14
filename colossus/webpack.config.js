/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function(e, argv = { isProduction }) {
  const MODE = argv.mode || 'development';
  const NODE_ENV = process.env.NODE_ENV || MODE;
  process.env.NODE_ENV = NODE_ENV;
  process.env.BABEL_ENV = NODE_ENV;

  const GIT_REVISION = getGitRevision();

  const EXPOSE_ENV = {
    NODE_ENV,
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
                name: 'static/media/[name].[ext]'
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
              test: /\.css$/,
              sideEffects: true,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    publicPath: '../'
                  }
                },
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    sourceMap: true,
                    url: false
                  }
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
                    sourceMap: true,
                    // turn off url handling as we are copying all the files over to build folder
                    // turning this on would be ideal, but will require lots of sass refactoring
                    url: false
                  }
                },
                {
                  loader: require.resolve('sass-loader'),
                  options: {
                    sourceMap: true,
                    // override the default webpack importer to use the existing sass importer
                    // removing this would be ideal, but will require lots of sass refactoring
                    importer: require('sass-importer-node/sass-importer-node.js'),
                    implementation: require('sass')
                  }
                }
              ]
            },
            {
              exclude: [/\.js$/, /\.html$/, /\.json$/, /\.tsx?$/],
              loader: require.resolve('file-loader'),
              options: {
                name: 'static/[name].[ext]'
              }
            }
          ]
        }
      ],
      exprContextCritical: false
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
      new WriteFilePlugin(),
      new FriendlyErrorsWebpackPlugin({
        clearConsole: false
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].[id].css'
      }),
      new CopyWebpackPlugin(['images/**/*', 'videos/**/*', 'font/**/*'], {
        context: path.resolve(__dirname, './src')
      }),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|de|fr|es/)
    ],
    performance: {
      hints: false
    }
  };

  return config;
};

function getGitRevision() {
  let GIT_REVISION = 'unknown';
  try {
    GIT_REVISION = require('child_process')
      .execSync('git rev-parse HEAD')
      .toString()
      .trim();
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
