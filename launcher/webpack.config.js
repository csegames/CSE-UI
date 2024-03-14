const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function (e, argv = {}) {

  const MODE = argv.mode || 'development';
  const NODE_ENV = process.env.NODE_ENV || MODE;
  process.env.NODE_ENV = NODE_ENV;
  process.env.BABEL_ENV = NODE_ENV;

  const DOTENV = loadDotenv(NODE_ENV);

  const OUTPUT_PATH = process.env.CUUI_BUILD_OUTPUT_PATH || path.resolve(__dirname, 'dist/ui');
  const ENABLE_SENTRY = ['1', 'true', 'yes', 'y'].indexOf(process.env.CUUI_ENABLE_SENTRY) >= 0;
  const GIT_REVISION = getGitRevision();

  const EXPOSE_ENV = {
    ...DOTENV,
    NODE_ENV,
    ENABLE_SENTRY,
    GIT_REVISION,
  };

  logEnv(EXPOSE_ENV);

  const config = {
    mode: MODE,
    stats: 'errors-only',
    devtool: 'source-map',
    entry: {
      ['patcher']: ['./src/index.tsx'],
    },
    output: {
      path: OUTPUT_PATH,
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js',
    },
    optimization: {
      minimize: false,
      splitChunks: {
        chunks: 'async',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: -10,
          },
          default: {
            minChunks: 2,
            priority: -20,
            chunks: 'async',
            reuseExistingChunk: true
          }
        },
      },
      runtimeChunk: 'single',
    },
    resolve: {
      extensions: ['.web.ts', '.ts', '.web.tsx', '.tsx', '.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
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
                name: 'static/media/[name].[ext]',
              },
            },
            {
              test: /\.js?$/,
              exclude: function(modulePath) {
                return /node_modules/.test(modulePath);
                // return /node_modules/.test(modulePath) &&
                //   !/node_modules\/\@sentry\/browser/.test(modulePath)
                // ;
              },
              use: [
                {
                  loader: require.resolve('babel-loader')
                },
                {
                  loader: '@csegames/linaria/loader',
                  options: {
                    sourceMap: true
                  },
                },
              ]
            },
            {
              test: /\.mjs?$/,
              use: [
                {
                  loader: require.resolve('babel-loader')
                },
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
                  loader: '@csegames/linaria/loader',
                  options: {
                    sourceMap: true
                  },
                },
                {
                  loader: require.resolve('ts-loader'),
                  options: {
                    transpileOnly: false,
                    happyPackMode: false,
                    compilerOptions: {
                      sourceMap: true,
                    }
                  }
                },
              ]
            },
            {
              test: /\.(graphql|gql)$/,
              exclude: /node_modules/,
              loader: require.resolve('graphql-tag/loader'),
            },
            {
              test: /\.hbs$/,
              loader: require.resolve('handlebars-loader'),
            },
            {
              test: /\.css$/,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    publicPath: '../',
                  }
                },
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    sourceMap: true,
                    url: true,
                  }
                },
              ]
            },
            {
              test: /\.scss$/,
              exclude: /node_modules/,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {}
                },
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    sourceMap: true,
                    // turn off url handling as we are copying all the files over to build folder
                    // turning this on would be ideal, but will require lots of sass refactoring
                    url: false,
                  }
                },
                {
                  loader: require.resolve('sass-loader'),
                  options: {
                    sourceMap: true,
                    // override the default webpack importer to use the existing sass importer
                    // removing this would be ideal, but will require lots of sass refactoring
                    importer: require('sass-importer-node/sass-importer-node.js'),
                  }
                }
              ]
            },
            {
              exclude: [/\.js$/, /\.html$/, /\.json$/, /\.tsx?$/],
              loader: require.resolve('file-loader'),
              options: {
                name: 'static/[name].[ext]',
              },
            },
          ],
        },
      ],
      exprContextCritical: false,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': Object.keys(EXPOSE_ENV).reduce((e, key) => {
          e[key] = JSON.stringify(EXPOSE_ENV[key]);
          return e;
        }, {}),
      }),
      new HtmlWebpackPlugin({
        title: 'Custom template using Handlebars',
        template: 'src/index.hbs',
        templateParameters: {
          process: {
            env: EXPOSE_ENV,
          },
        }
      }),
      new WriteFilePlugin(),
      // new FriendlyErrorsWebpackPlugin({
      //   clearConsole: false,
      // }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].[id].css'
      }),
      new CopyWebpackPlugin(
        [
          'third-party/**/*',
          'images/**/*',
          'font/**/*',
          'sounds/**/*',
          'videos/**/*',
          '**/*.ico',
          '**/*.ui'
        ],
        {
          context: 'src/',
        }
      ),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|de|fr|es/),
    ],
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
      dns: 'empty',
    },
    performance: {
      hints: false,
    }
  };

  return config;
}

function loadDotenv(NODE_ENV) {
  const envFiles = [
    path.resolve(process.cwd(), `.env.${NODE_ENV}.local`),
    path.resolve(process.cwd(), `.env.${NODE_ENV}`),
    path.resolve(process.cwd(), `.env.local`),
    path.resolve(process.cwd(), `.env`),
  ];
  const env = envFiles.reduce((mergedEnv, envFile) => {
    if (fs.existsSync(envFile)) {
      return {
        ...(require('dotenv').config({path: envFile}).parsed),
        ...mergedEnv,
      }
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
  } catch(e) {
    console.error(e);
  }
  return GIT_REVISION;
}

function logEnv(env) {
  console.log('WEBPACK ENVIRONMENT');
  Object.keys(env).forEach(key => {
    console.log(`  ${key}: ${JSON.stringify(env[key])}`);
  });
}
