/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = function (e, argv = { isProduction, cacheRoot }) {

  if (!argv.cacheRoot) {
    argv.cacheRoot = path.resolve(__dirname, 'node_modules', '.cache');
  }
  
  const MODE = argv.mode || 'development';
  const NODE_ENV = process.env.NODE_ENV || MODE;
  process.env.NODE_ENV = NODE_ENV;
  process.env.BABEL_ENV = NODE_ENV;

  const DOTENV = loadDotenv(NODE_ENV);

  const IS_WATCH = argv.watch ? true : false;
  const IS_BROWSER = process.env.CUUI_LSBUILD_IS_BROWSER === '1';
  const IS_CLIENT = !IS_BROWSER;
  const IS_CI = process.env.CI;
  const ENABLE_SENTRY = ['1', 'true', 'yes', 'y'].indexOf(process.env.CUUI_LS_ENABLE_SENTRY) >= 0;
  const GIT_REVISION = getGitRevision();

  const EXPOSE_ENV = {
    ...DOTENV,
    NODE_ENV,
    ENABLE_SENTRY,
    IS_CLIENT,
    IS_BROWSER,
    IS_DEVELOPMENT: !argv.isProduction,
    IS_PRODUCTION: argv.isProduction,
    GIT_REVISION,
    IS_WATCH,
  };

  console.log(`CPUS: ${require('os').cpus().length}`)
  logEnv(EXPOSE_ENV);

  const ALIAS = {
    'react': path.dirname(
      require.resolve('react/package.json')
    ),
    components: path.resolve(__dirname, 'src/components'),
    actions: path.resolve(__dirname, 'src/services/actions'),
    context: path.resolve(__dirname, 'src/components/context'),
    lib: path.resolve(__dirname, 'src/lib'),
    services: path.resolve(__dirname, 'src/services'),
    widgets: path.resolve(__dirname, 'src/widgets'),
    cseshared: path.resolve(__dirname, '../../shared'),
  };

  const config = {
    ...e,
    entry: {
      hordetest: [
        path.resolve(__dirname, 'src/sentry.tsx'),
        path.resolve(__dirname, 'src/index.tsx'),
      ],
    },
    resolve: {
      alias: ALIAS,
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
              test: /\.ts?$/,
              exclude: function(modulePath) {
                return /node_modules/.test(modulePath);
                // return /node_modules/.test(modulePath) &&
                //   !/node_modules\/\@sentry\/browser/.test(modulePath)
                // ;
              },
              use: [
                {
                  loader: require.resolve('babel-loader'),
                  options: {
                    cacheDirectory: path.resolve(argv.cacheRoot, 'babel-loader'),
                  },
                },
                {
                  loader: require.resolve('@csegames/linaria/loader'),
                  options: {
                    sourceMap: !argv.isProduction,
                    resolve: {
                      alias: ALIAS,
                    },
                  },
                },
              ]
            },
            {
              test: /\.mjs?$/,
              use: [
                {
                  loader: require.resolve('babel-loader'),
                  options: {
                    cacheDirectory: path.resolve(argv.cacheRoot, 'babel-loader'),
                  },
                },
              ]
            },
            {
              test: /\.tsx?$/,
              exclude: /node_modules/,
              sideEffects: true,
              use: [
                // ...(!IS_CI ? [{
                //   loader: require.resolve('thread-loader'),
                //   options: {
                //       workers: require('os').cpus().length - 1,
                //   },
                // }] : []),
                {
                  loader: require.resolve('babel-loader'),
                  options: {
                    cacheDirectory: path.resolve(argv.cacheRoot, 'babel-loader'),
                  },
                },
                {
                  loader: require.resolve('@csegames/linaria/loader'),
                  options: {
                    sourceMap: !argv.isProduction,
                    resolve: {
                      alias: ALIAS,
                    },
                  },
                },
                {
                  loader: require.resolve('ts-loader'),
                  options: {
                    transpileOnly: IS_CI ? false : true,
                    happyPackMode: IS_CI ? false : true,
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
              sideEffects: true,
              use: [
                (!argv.isProduction && IS_BROWSER) ? {
                  loader: require.resolve('style-loader'),
                  options: {
                    sourceMap: true,
                  }
                } : {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    publicPath: '../',
                  }
                },
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    sourceMap: true,
                    url: false,
                  }
                },
              ]
            },
            {
              test: /\.scss$/,
              exclude: /node_modules/,
              sideEffects: true,
              use: [
                (!argv.isProduction && IS_BROWSER) ? {
                  loader: require.resolve('style-loader'),
                  options: {
                    sourceMap: true,
                  }
                } : {
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
        template: path.resolve(__dirname, 'src/worldui.hbs'),
        filename: 'worldui.html',
        templateParameters: {
          process: {
            env: EXPOSE_ENV,
          },
        }
      }),
      new WriteFilePlugin(),
      new FriendlyErrorsWebpackPlugin({
        clearConsole: false,
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].[id].css'
      }),
      new CopyWebpackPlugin(
        [
          'third-party/**/*',
          'images/**/*',
          'font/**/*',
          '**/*.ico',
          '**/*.ui',
          ...((!argv.isProduction && IS_BROWSER) ? [
            '**/*.config.js'
          ] : [])
        ],
        {
          context: path.resolve(__dirname, 'src/'),
        }
      ),
      ...(!IS_CI ? [
        new ForkTsCheckerWebpackPlugin({
          checkSyntacticErrors: true,
          tslint: false,
          tsconfig: path.resolve(__dirname, 'tsconfig.json'),
          formatter: 'codeframe',
          async: false,
        }),
      ] : []),
      // ...(IS_PRODUCTION ? [
      //   new BundleAnalyzerPlugin({
      //     analyzerMode: 'disabled',
      //     generateStatsFile: true,
      //     statsFilename: 'asset-stats.json',
      //   }),
      // ] : []),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|de|fr|es/),
    ],
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
    if (!key.startsWith('CUUI_LSBUILD_')) {
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
