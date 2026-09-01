const { DefinePlugin, ContextReplacementPlugin } = require('webpack');
const path = require('path');
const fs = require('fs');
const package = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (e, argv = {}) {
  const MODE = argv.mode || 'development';
  const NODE_ENV = process.env.NODE_ENV || MODE;
  process.env.NODE_ENV = NODE_ENV;
  process.env.BABEL_ENV = NODE_ENV;

  const DOTENV = loadDotenv(NODE_ENV);

  const OUTPUT_PATH = process.env.CUUI_BUILD_OUTPUT_PATH || path.resolve(__dirname, 'dist/ui');
  const ENABLE_SENTRY = ['1', 'true', 'yes', 'y'].indexOf(process.env.CUUI_ENABLE_SENTRY) >= 0;
  const GIT_REVISION = getGitRevision();
  const VERSION = package.version;

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
      ['patcher']: ['./src/index.tsx']
    },
    output: {
      path: OUTPUT_PATH,
      filename: '[name].js',
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
      extensions: ['.ts', '.tsx', '.js', '.json', '.jsx']
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: [/\.gif$/, /\.svg$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'images/[name].[ext]'
              }
            },
            {
              test: [/\.webm$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'videos/[name].[ext]'
              }
            },
            {
              test: [/\.ogg$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'sounds/[name].[ext]'
              }
            },
            {
              test: [/\.ttf$/,/\.eot$/,/\.woff2?$/],
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
              test: /\.css$/,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                },
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    sourceMap: true,
                    url: true
                  }
                }
              ]
            },
            {
              test: /\.scss$/,
              exclude: /node_modules/,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                },
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    sourceMap: true,
                    url: true
                  }
                },
                {
                  loader: require.resolve('sass-loader'),
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
      new MiniCssExtractPlugin(),
      new DefinePlugin({
        'process.env': Object.keys(EXPOSE_ENV).reduce((e, key) => {
          e[key] = JSON.stringify(EXPOSE_ENV[key]);
          return e;
        }, {})
      }),
      new HtmlWebpackPlugin({ template: 'src/index.html' }),
      new ContextReplacementPlugin(/moment[/\\]locale$/, /en|de|fr|es/)
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
