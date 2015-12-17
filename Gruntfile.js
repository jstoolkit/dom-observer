module.exports = function (grunt) {

  // Load all tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Lint JS
    eslint: {
      lib: {
        src: ['src/dom-observer.js']
      },
      test: {
        src: ['test/dom-observer-spec.js']
      }
    },

    // Perform browserify build
    browserify: {
      lib: {
        files: {
          'dist/dom-observer.js': ['src/*.js']
        },
        options: {
          transform: ['babelify'],
          browserifyOptions: {
            standalone: 'DomObserver'
          }
        }
      }
    },

    // Run tests
    mochify: {
      options: {
        reporter: 'spec',
        transform: ['babelify']
      },
      local: {
        src: ['test/*.js']
      },
      remote: {
        options: {
          wd: true
        },
        src: ['test/*.js']
      }
    },

    // Generate min build
    uglify: {
      lib: {
        options: {
          sourceMap: false
        },
        files: {
          'dist/dom-observer.min.js': ['dist/dom-observer.js']
        }
      }
    },

    // Get back to clone state
    clean: ['node_modules'],

    // Print banner in dist files
    usebanner: {
      options: {
        position: 'top',
        banner: grunt.file.read('banner.txt')
      },
      dist: {
        files: {
          'dist/dom-observer.js': 'dist/dom-observer.js'
        }
      },
      min: {
        files: {
          'dist/dom-observer.min.js': 'dist/dom-observer.min.js'
        }
      }
    },

    // TODO: GENERATE DOCS WITH JSDOC
    jsdoc: {
      dist: {
        src: ['README.md', 'src/*.js'],
        dest: 'docs'
      }
    }
  });

  // Register custom tasks
  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('compile', ['browserify:lib']);
  grunt.registerTask('test', ['mochify:local']);
  grunt.registerTask('minify', ['uglify']);
  grunt.registerTask('build', [
    'lint',
    'test',
    'compile',
    'minify',
    'usebanner',
    'jsdoc'
  ]);

  if (process.env.CI) {
    grunt.registerTask('ci', [
      'lint',
      'test',
      'mochify:remote',
      'compile',
      'minify'
    ]);
  }

  // Maps default to build
  grunt.registerTask('default', ['build']);
};
