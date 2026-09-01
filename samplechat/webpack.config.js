const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const packageJson = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (e, argv = {}) {
  const MODE = argv.mode || 'development';
  const NODE_ENV = process.env.NODE_ENV || MODE;
  process.env.NODE_ENV = NODE_ENV;
  process.env.BABEL_ENV = NODE_ENV;

  const DOTENV = loadDotenv(NODE_ENV);

  const OUTPUT_PATH = process.env.CUUI_BUILD_OUTPUT_PATH || path.resolve(__dirname, 'dist');
  const ENABLE_SENTRY = ['1', 'true', 'yes', 'y'].indexOf(process.env.CUUI_ENABLE_SENTRY) >= 0;
  const GIT_REVISION = getGitRevision();
  const VERSION = packageJson.version;

  const EXPOSE_ENV = {
    ...DOTENV,
    NODE_ENV,
    ENABLE_SENTRY,
    GIT_REVISION,
    VERSION
  };

  logEnv(EXPOSE_ENV);

  const config = {
    mode: MODE,
    stats: 'errors-only',
    devtool: 'source-map',
    entry: {
      ['chat']: ['./src/index.tsx']
    },
    output: {
      path: OUTPUT_PATH,
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js'
    },
    optimization: {
      minimize: false,
      splitChunks: {
        chunks: 'async',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            chunks: 'async',
            reuseExistingChunk: true
          }
        }
      },
      runtimeChunk: 'single'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'static/media/[name].[ext]'
              }
            },
            {
              test: /\.js?$/,
              exclude: function (modulePath) {
                return /node_modules/.test(modulePath);
              },
              use: [
                {
                  loader: require.resolve('babel-loader')
                }
              ]
            },
            {
              test: /\.mjs?$/,
              use: [
                {
                  loader: require.resolve('babel-loader')
                }
              ]
            },
            {
              test: /\.tsx?$/,
              exclude: /node_modules/,
              use: [
                {
                  loader: require.resolve('babel-loader')
                },
                {
                  loader: require.resolve('ts-loader'),
                  options: {
                    transpileOnly: false,
                    happyPackMode: false,
                    compilerOptions: {
                      sourceMap: true
                    }
                  }
                }
              ]
            },
            {
              test: /\.css$/,
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
                    url: true
                  }
                }
              ]
            }
          ]
        }
      ],
      exprContextCritical: false
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': Object.keys(EXPOSE_ENV).reduce((e, key) => {
          e[key] = JSON.stringify(EXPOSE_ENV[key]);
          return e;
        }, {})
      }),
      new HtmlWebpackPlugin({
        title: 'UCE Sample Chat',
        favicon: './src/images/UCE_icon.ico'
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].[id].css'
      })
    ],
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
      dns: 'empty'
    },
    performance: {
      hints: false
    }
  };

  return config;
};

function loadDotenv(NODE_ENV) {
  const envFiles = [
    path.resolve(process.cwd(), `.env.${NODE_ENV}.local`),
    path.resolve(process.cwd(), `.env.${NODE_ENV}`),
    path.resolve(process.cwd(), `.env.local`),
    path.resolve(process.cwd(), `.env`)
  ];
  const env = envFiles.reduce((mergedEnv, envFile) => {
    if (fs.existsSync(envFile)) {
      return {
        ...require('dotenv').config({ path: envFile }).parsed,
        ...mergedEnv
      };
    }
    return mergedEnv;
  }, {});
  return Object.keys(env).reduce((e, key) => {
    if (!key.startsWith('CUUI_BUILD_')) {
      let value = env[key];
      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      }
      e[key] = value;
    }
    return e;
  }, {});
}

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
