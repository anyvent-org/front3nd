const path = require('path');

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const defaultConfig = {
  base: __dirname,
  displayName: 'front3nd',
  logo: '',
  bundleName: 'front3nd',
  svgSprites: [
    {
      source: '/static/**/*.svg',
      out: 'static/sprite.svg',
    }
  ],
  templates: {
    out: '../backend/front3nd/templates'
  },
  static: {
    out: '../backend/front3nd/static'
  }
}

module.exports = (userConfig = {}) => {
  const config = Object.assign({}, defaultConfig, userConfig);

  return (env, argv) => {
    const isDevelopment = argv.mode !== 'production';
    const webpackConfig = {
      entry: [
        path.join(config.base, `${config.bundleName}.js`),
        path.join(config.base, `scss/${config.bundleName}.scss`),
        path.join(config.base, `scss/${config.bundleName}.critical.scss`),
      ],
      output: {
        path: path.resolve(config.base, 'dist'),
        filename: (isDevelopment ? 'static/[name].js' : 'static/[name].[contenthash].js'),
        assetModuleFilename: 'static/[hash][ext][query]',
        sourceMapFilename: 'static/[name].map',
        publicPath: isDevelopment ? 'http://localhost:8081/' : '/',
      },
      optimization: {
        minimize: !isDevelopment,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              ecma: '2015',
              compress: {
                defaults: true,
                unsafe: true,
              }
            }
          }),
          new CssMinimizerWebpackPlugin(),
        ],
        splitChunks: isDevelopment ? {} : {
          cacheGroups: {
            main: {
              name: 'main',
              test: /^(?!.*\.critical).*\.s?css$/,
              chunks: 'all',
              enforce: true,
            },
            critical: {
              name: 'critical',
              test: /\.critical\.s?css$/,
              chunks: 'all',
              enforce: true,
            },
          },
        },
        concatenateModules: false,
      },
      devtool: isDevelopment ? 'inline-source-map' : false,
      resolve: {
        alias: (() => {
          alias = {};

          alias[`@anyvent-org/front3nd`] = path.resolve(__dirname, '..');
          alias[`@${config.bundleName}/js`] = path.resolve(config.base, 'js');
          alias[`@${config.bundleName}/scss`] = path.resolve(config.base, 'scss');

          return alias;
        })(),
      },
      plugins: (() => {
        const plugins = [];

        plugins.push(new HtmlWebpackPlugin({
          template: `${config.bundleName}.ejs`,
          filename: './base.html',
          inject: false,
          isDevelopment,
        }));

        for (const sprite of config.svgSprites) {
          plugins.push(new SVGSpritemapPlugin(path.join(config.base, sprite.source), {
            sprite: {
              prefix: false,
              idify: (filename) => {
                return filename.replace(/-\d+x\d+/, '');
              },
              generate: {
                title: false,
              },
            },
            output: {
              svgo: {
              },
              filename: sprite.out,
            },
          }));
        }

        plugins.push(new MiniCssExtractPlugin({
          filename:
            'static/' +
            (isDevelopment ? '[name].css' : '[name].[contenthash].css'),
          chunkFilename:
            'static/' + (isDevelopment ? '[id].css' : '[name].[contenthash].css'),
        }));

        plugins.push(new FileManagerPlugin({
          events: {
            onStart: {
              delete: [
                {
                  source: `./dist/*.hot-update.*`,
                  options: {
                    force: true
                  }
                },
                {
                  source: `${config.static.out}/**/*`,
                  options: {
                    force: true
                  }
                }
              ]
            },
            onEnd: {
              copy: [
                {
                  source: './dist/base.html',
                  destination: `${config.templates.out}/base.html`,
                },
                {
                  source: './dist/static/**/*',
                  destination: `${config.static.out}`,
                  options: {
                    overwrite: true
                  }
                },
                {
                  source: './static/img/**/*.png',
                  destination: `${config.static.out}/img/`,
                },
                {
                  source: './static/img/**/*.jpg',
                  destination: `${config.static.out}/img/`,
                },
                {
                  source: './static/img/**/*.mp4',
                  destination: `${config.static.out}/img/`,
                },
              ],
            },
          }
        }));

        if (isDevelopment) {
          const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
          plugins.push(new WebpackBuildNotifierPlugin({
            title: config.displayName,
            logo: path.join(
              config.base,
              config.logo
            ),
          }));
        }


        return plugins;
      })(),
      module: {
        rules: [
          {
            test: /\.svg/,
            type: 'asset/inline',
            generator: {
              dataUrl: (content) => {
                content = content.toString();
                return svgToMiniDataURI(content);
              }
            }
          },
          {
            test: /\.(jpg|png)$/,
            type: 'asset/resource'
          },
          {
            test: /\.(woff|woff2)$/,
            type: 'asset/resource'
          },
          {
            test: /\.s?css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {},
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sassOptions: {
                    includePaths: [
                      path.join(config.base, './scss'),
                    ],
                  },
                  sourceMap: true,
                },
              },
            ],
          },
          {
            test: /\.html$/,
            use: [
              {
                loader: 'html-loader',
                options: {
                  minimize: false,
                },
              },
            ],
          },
        ],
      },

      watchOptions: {
        aggregateTimeout: 200,
      },

      devServer: {
        port: 8081,
        static: false,
        allowedHosts: '*',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        compress: true,
        hot: true,
        client: {
          overlay: true,
        },
        devMiddleware: {
          writeToDisk: true,
          publicPath: '/',
        },
        watchFiles: userConfig.watch || [],
      },
    };

    if (!userConfig.customize) {
      return webpackConfig;
    }

    return userConfig.customize(isDevelopment, webpackConfig);
  }
};
