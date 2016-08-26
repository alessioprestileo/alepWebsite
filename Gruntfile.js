module.exports = function(grunt) {

  // configure the tasks
  grunt.initConfig({

    copy: {
      build: {
        cwd: 'bower_components',
        src: [ 'typeahead.js/dist/typeahead.bundle.min.js' ],
        dest: 'node_modules',
        expand: true
      },
    },

  });

  // load the tasks
  grunt.loadNpmTasks('grunt-contrib-copy');

  // define the tasks
};
