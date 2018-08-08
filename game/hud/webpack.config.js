const webpack = require('webpack');
const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = function (e, rawArgv) {

  const argv = rawArgv ? rawArgv : {};

  const mode = argv.mode ? argv.mode : 'development';

  const env = {
    NODE_ENV: process.env.NODE_ENV || mode,
  };

  const outputPath = process.env.CUUI_DEV_OUTPUT_PATH ? process.env.CUUI_DEV_OUTPUT_PATH : argv.watch ? path.resolve(__dirname, 'dist') : path.resolve(__dirname, 'build');

  const config = {
    mode,
    devtool: mode === 'development' ? 'source-map' : 'source-map',
    entry: {
      hud: ['./src/index.tsx'],
    },
    output: {
      path: outputPath,
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js',
    },
    optimization: {
      minimize: mode === 'production' ? false /* make this true if minimization is desired */ : false,
      splitChunks: {
        chunks: 'async',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: -10,
          },
          gqlDocuments: {
            test: /gqlDocuments/,
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
      alias: {
        'react': path.dirname(
          require.resolve('react/package.json')
        ),
        components: path.resolve(__dirname, 'src/components'),
        'UI/TabbedDialog': path.resolve(__dirname, 'src/components/UI/TabbedDialog/index'),
        UI: path.resolve(__dirname, 'src/components/UI'),
        actions: path.resolve(__dirname, 'src/services/actions'),
        lib: path.resolve(__dirname, 'src/lib'),
        services: path.resolve(__dirname, 'src/services'),
        widgets: path.resolve(__dirname, 'src/widgets'),
        HUDContext: path.resolve(__dirname, 'src/components/HUD/context'),
      },
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
              test: /\.tsx?$/,
              exclude: /node_modules/,
              use: [
                {
                  loader: require.resolve('cache-loader'),
                },
                {
                  loader: require.resolve('thread-loader'),
                  options: {
                      workers: require('os').cpus().length - 1,
                  },
                },
                {
                  loader: require.resolve('babel-loader'),
                  options: {
                    cacheDirectory: true
                  },
                },
                {
                  loader: require.resolve('ts-loader'),
                  options: {
                    transpileOnly: true,
                    happyPackMode: true,
                    compilerOptions: {
                      sourceMap: true,
                    },
                  }
                }
              ]
            },
            {
              exclude: [/\.js$/, /\.html$/, /\.json$/, /\.tsx?$/],
              loader: require.resolve('file-loader'),
              options: {
                name: 'static/media/[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        checkSyntacticErrors: true,
        tslint: true, // can turn this off if required
        formatter: 'codeframe',
        async: true,
      }),
      new webpack.DefinePlugin({
        'process.env': Object.keys(env).reduce((e, key) => {
          e[key] = JSON.stringify(env[key]);
          return e;
        }, {}),
      }),
      // new webpack.HotModuleReplacementPlugin(),
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        generateStatsFile: true,
        statsFilename: 'asset-stats.json',
      }),
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
    },
  };

  return config;
}
