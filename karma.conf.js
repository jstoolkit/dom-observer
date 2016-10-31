module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS']

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],

    // Registered plugins
    plugins: [
      'karma-phantomjs-launcher',
      'karma-sourcemap-loader',
      'karma-mocha',
      'karma-chai',
      'karma-sinon',
      'karma-coverage',
      'karma-webpack'
    ],

    // list of files / patterns to load in the browser
    files: ['tests.webpack.js'],


    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },

    // Webpack config
    webpack: {
      devtool: 'inline-source-map',
      module: {
        preLoaders: [
          {
            test: /\.js$/,
            exclude: /(test|node_modules)\//,
            loader: 'isparta-loader'
          }
        ],
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
          }
        ]
      }
    },

    webpackServer: {
      noInfo: true
    },

    coverageReporter: {
      reporters: [
        {
          type: 'lcovonly',
          dir: 'coverage/',
          subdir: '.',
          file: 'lcov.info'
        },
        {
          type: 'html',
          dir: 'coverage/',
          file: 'coverage.html'
        },
        {
          type: 'text-summary'
        }
      ]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    logLevel: config.LOG_INFO

  });
};
