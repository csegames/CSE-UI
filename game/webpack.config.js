/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = (e, argv = {}) => {
  const MODE = argv.mode || 'development';
  const NODE_ENV = process.env.NODE_ENV || MODE;
  process.env.NODE_ENV = NODE_ENV;
  const IS_DEVELOPMENT = NODE_ENV === 'development';
  const IS_PRODUCTION = NODE_ENV === 'production';

  const CACHE_ROOT = path.resolve(__dirname, 'node_modules', '.cache', argv.approute);
  if (!fs.existsSync(CACHE_ROOT)) {
    mkdirp.sync(CACHE_ROOT);
  }

  const OUTPUT_PATH = path.resolve(__dirname, `build/${argv.approute}`);

  const baseConfig = {
    stats: 'errors-only',
    mode: MODE,
    devtool: 'source-map',
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
    }: {}),
  };

  const webpackConfig = require(`./${argv.approute}/webpack.config`);
  return webpackConfig(baseConfig, { isProduction: IS_PRODUCTION, cacheRoot: CACHE_ROOT });
}