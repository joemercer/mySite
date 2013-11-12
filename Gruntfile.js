module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    shell: {
        build: {
            command: 'wintersmith build'
        }
    },
    wintersmith: {
      build: {},
      preview: {
        options: {
          action: "preview"
        }
      }
    },
    uglify: {
      development: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
          mangle: false,
          beautify: true
        },
        files: {
          'contents/js/custom.js': [
            'contents/libs/bootstrap/js/carousel.js',
            'contents/libs/bootstrap/js/dropdown.js',
            'contents/libs/bootstrap/js/scrollspy.js',
            'contents/libs/bootstrap/js/transition.js',
            'contents/js/main.js'
          ]
        }
      },
      production: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
          mangle: true
        },
        files: {
          'build/js/main.min.js': [
            'contents/libs/bootstrap/js/carousel.js',
            'contents/libs/bootstrap/js/dropdown.js',
            'contents/libs/bootstrap/js/scrollspy.js',
            'contents/libs/bootstrap/js/transition.js',
            'contents/js/main.js'
          ]
        }
      }
    },
    less: {
      development: {
        options: {
        },
        files: {
          "build/css/custom.css": "contents/css/custom.less"
        }
      },
      production: {
        options: {
          cleancss: true
        },
        files: {
          "build/css/custom.min.css": "contents/css/custom.less"
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-wintersmith');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Default task(s).
  //grunt.registerTask('default', ['uglify']);

  // Register tasks
  grunt.registerTask('build', ['less', 'uglify', 'wintersmith:build']);

};