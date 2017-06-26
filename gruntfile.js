

/**
 * @param {Object} grunt Grunt.
 */
module.exports = function(grunt) {

  var gruntfileSrc = 'gruntfile.js';
  var testSrc = 'test/**/*.spec.js';
  var libSrc = 'lib/**/*.js';

  grunt.initConfig({

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: [testSrc]
      }
    },

    jshint: {
      gruntfile: {
        src: gruntfileSrc
      },
      tests: {
        src: testSrc
      },
      lib: {
        src: libSrc
      }
    },

    watch: {
      tests: {
        files: testSrc,
        tasks: ['newer:cafemocha']
      },
      lib: {
        files: libSrc,
        tasks: ['cafemocha']
      },
      allJs: {
        files: [gruntfileSrc, testSrc, libSrc],
        tasks: ['newer:jshint']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('test', ['newer:jshint', 'mochaTest']);
  grunt.registerTask('start', ['test', 'watch']);

  grunt.registerTask('default', 'test');

};
