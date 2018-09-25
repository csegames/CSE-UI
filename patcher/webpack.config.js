const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const WebpackServeWaitpage = require('webpack-serve-waitpage');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const NAME = 'patcher';

const CACHE_ROOT = path.resolve(__dirname, '..', 'node_modules', '.cache', NAME);
if (!fs.existsSync(CACHE_ROOT)) {
  mkdirp.sync(CACHE_ROOT);
}

const ALIAS = {
  'react': path.dirname(
    require.resolve('react/package.json')
  ),
  gql: path.resolve(__dirname, 'src/gql'),
  components: path.resolve(__dirname, 'src/components'),
};

module.exports = function (e, argv = {}) {

  const MODE = argv.mode || 'development';
  const NODE_ENV = process.env.NODE_ENV || MODE;
  process.env.NODE_ENV = NODE_ENV;
  process.env.BABEL_ENV = NODE_ENV;

  const DOTENV = loadDotenv(NODE_ENV);

  const OUTPUT_PATH = process.env.CUUI_BUILD_OUTPUT_PATH || path.resolve(__dirname, 'dist/ui');
  const IS_WATCH = argv.watch ? true : false;
  const IS_BROWSER = process.env.CUUI_BUILD_IS_BROWSER === '1';
  const IS_CLIENT = !IS_BROWSER;
  const IS_DEVELOPMENT = NODE_ENV === 'development';
  const IS_PRODUCTION = NODE_ENV === 'production';
  const IS_CI = process.env.CI;
  const ENABLE_SENTRY = ['1', 'true', 'yes', 'y'].indexOf(process.env.CUUI_ENABLE_SENTRY) >= 0;
  const GIT_REVISION = getGitRevision();

  const EXPOSE_ENV = {
    ...DOTENV,
    NAME,
    NODE_ENV,
    ENABLE_SENTRY,
    IS_CLIENT,
    IS_BROWSER,
    IS_DEVELOPMENT,
    IS_PRODUCTION,
    GIT_REVISION,
    IS_WATCH,
  };

  console.log(`CPUS: ${require('os').cpus().length}`)
  logEnv(EXPOSE_ENV);

  const config = {
    mode: MODE,
    devtool: 'source-map',
    entry: {
      [NAME]: ['./src/sentry.tsx', './src/index.tsx'],
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
              test: /\.js?$/,
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
                    cacheDirectory: path.resolve(CACHE_ROOT, 'babel-loader'),
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
                    cacheDirectory: path.resolve(CACHE_ROOT, 'babel-loader'),
                  },
                },
              ]
            },
            {
              test: /\.tsx?$/,
              exclude: /node_modules/,
              use: [
                {
                  loader: require.resolve('cache-loader'),
                  options: {
                    cacheDirectory: path.resolve(CACHE_ROOT, 'cache-loader'),
                  },
                },
                ...(!IS_CI ? [{
                  loader: require.resolve('thread-loader'),
                  options: {
                      workers: require('os').cpus().length - 1,
                  },
                }] : []),
                {
                  loader: require.resolve('babel-loader'),
                  options: {
                    cacheDirectory: path.resolve(CACHE_ROOT, 'babel-loader'),
                  },
                },
                {
                  loader: require.resolve('eslint-loader'),
                  query: {
                    emitError: true,
                    emitWarning: true,
                    failOnError: true,
                  }
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
                }
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
                (IS_DEVELOPMENT && IS_BROWSER) ? {
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
                    url: true,
                  }
                },
              ]
            },
            {
              test: /\.scss$/,
              exclude: /node_modules/,
              use: [
                (IS_DEVELOPMENT && IS_BROWSER) ? {
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
        template: 'src/index.hbs',
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
          'sounds/**/*',
          'videos/**/*',
          '**/*.ico',
          '**/*.ui',
          ...((IS_DEVELOPMENT && IS_BROWSER) ? [
            '**/*.config.js'
          ] : [])
        ],
        {
          context: 'src/',
        }
      ),
      ...(!IS_CI ? [
        new ForkTsCheckerWebpackPlugin({
          checkSyntacticErrors: true,
          tslint: true, // can turn this off if required
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
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
      dns: 'empty',
    },
    // performance: {
    //   hints: false,
    // },
    performance: false,
    ...(IS_DEVELOPMENT ? {
      serve: {
        add: (app, middleware, options) => {
          app.use(WebpackServeWaitpage(options, {
            theme: 'dark',
          }));
        }
      },
    }: {})
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
