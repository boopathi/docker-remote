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

//grunt-contrib-concat
gruntConfig.push({
  concat: {
    css: {
      src: ['app/public/css/*.css'],
      dest: 'app/public/build/docker-remote.css'
    },
    js: {
      src: ['app/assets/jquery/jquery.js',
            'app/assets/angular/angular.js',
            'app/assets/bootstrap/dist/js/bootstrap.js',
            'app/public/js/controllers.js'],
      dest: 'app/public/build/docker-remote.js'
    }
  }
})

//grunt-config-cssmin
gruntConfig.push({
  cssmin: {
    css: {
      src: ['<%= concat.css.dest %>'],
      dest: 'app/public/build/docker-remote.min.css'
    }
  }
});


//grunt-contrib-uglify
gruntConfig.push({
  uglify: {
    js: {
      options: {
        compress: true,
        report: 'gzip',
        mangle: false
      },
      files: {
        "app/public/build/docker-remote.min.js": ['<%= concat.js.dest %>']
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
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-express-server');

  // RegisterTasks
  grunt.registerTask('build', ['jshint','concat', 'cssmin', 'uglify']);
  grunt.registerTask('server', ['build', 'express:dev']);
  grunt.registerTask('default', []);
};
