module.exports = function(config) {
  var sauceBrowsers = {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 10',
      version: '54.0'
    },
    sl_safari: {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.11',
      version: '10.0'
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
      platform: 'Windows 10',
      version: '49.0'
    },
    sl_ms_edge: {
      base: 'SauceLabs',
      browserName: 'MicrosoftEdge',
      platform: 'Windows 10',
      version: '14.14393'
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 10',
      version: '11.103'
    }
  }
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // register browsers
    customLaunchers: sauceBrowsers,
    browsers: process.env.CI ? Object.keys(sauceBrowsers) : ['PhantomJS'],

    // SauceLabs config for CI
    sauceLabs: {
      testName: 'dom-observer suite',
    },

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],

    // Registered plugins
    plugins: [
      'karma-phantomjs-launcher',
      'karma-sauce-launcher',
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
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: process.env.CI ? ['progress', 'saucelabs', 'coverage'] : ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    logLevel: config.LOG_INFO

  });
};
