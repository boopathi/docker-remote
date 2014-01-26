"use strict";

var _ = require("underscore");

var gruntConfig = [];

//grunt-express-server
gruntConfig.push({
  express: {
    //files is not used by express
    //Defining it here so that others can use it in the name of express
    files: ['index.js', 'config.js', 'app/*.js', 'app/routes/*.js'],
    options: {
      script: "index.js",
      output: "Docker-Remote is running"
    },
    dev: {
      options: {
      }
    },
    test: {
      options: {
        node_env: 'testing'
      }
    }
  }
});

//grunt-contrib-jshint
gruntConfig.push({
  jshint: {
    express: {
      files: ['<%= express.files %>'],
      options: {
        node: true,
        globals: {
          console: true,
          module: true,
          require: true,
          process: true,
        }
      }
    },
    files: ['app/public/js/*.js'],
    options: {
      globals: {
        console: true,
        jQuery: true,
        document: true,
      }
    }
  }
});

//grunt-contrib-watch
gruntConfig.push({
  watch: {
    jshint: {
      files: ['<%= jshint.files %>', '<%= express.files %>'],
      tasks: ['jshint']
    }
  }
});

module.exports = function(grunt) {
  grunt.initConfig(_.extend.apply(this, _.union([{
    pkg: grunt.file.readJSON('package.json')
  }], gruntConfig)));
  
  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-express-server');

  // RegisterTasks
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('server', ['express:dev']);
  grunt.registerTask('default', []);
};

