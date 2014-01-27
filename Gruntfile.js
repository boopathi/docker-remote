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
      script: "index.js"
    },
    dev: {
      options: {
        script: "index.js"
      }
    },
    prod: {
      options: {
        script: "index.js",
        node_env: "production"
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

//grunt-contrib-copy
//Copy only files other than css and JS. CSS and JS will be minified.
gruntConfig.push({
  copy: {
    main: {
      files: [
        { expand: true, cwd: 'assets/bootstrap/dist/fonts', src: ['*'], dest: 'app/public/build/fonts', filter: 'isFile' },
        { expand: true, cwd: 'app/public/img', src: ['*.png', '*.jpg', '*.gif'], dest: 'app/public/build/img', filter: 'isFile' },
        { expand: true, cwd: 'app/public', src: ['*'], dest: 'app/public/build', filter: 'isFile' },
      ]
    }
  }
});

//grunt-contrib-concat
gruntConfig.push({
  concat: {
    css: {
      src: ['assets/bootstrap/dist/css/bootstrap.css',
            'app/public/css/*.css'],
      dest: 'app/public/build/css/docker-remote.css'
    },
    js: {
      src: ['assets/jquery/jquery.js',
            'assets/angular/angular.js',
            'assets/bootstrap/dist/js/bootstrap.js',
            'app/public/js/controllers.js'],
      dest: 'app/public/build/js/docker-remote.js'
    }
  }
})

//grunt-config-cssmin
gruntConfig.push({
  cssmin: {
    css: {
      src: ['<%= concat.css.dest %>'],
      dest: 'app/public/build/css/docker-remote.min.css'
    }
  }
});


//grunt-contrib-uglify
gruntConfig.push({
  uglify: {
    js: {
      options: {
        compress: true,
        mangle: false
      },
      files: {
        "app/public/build/js/docker-remote.min.js": ['<%= concat.js.dest %>']
      }
    }
  }
});

//grunt-contrib-watch
gruntConfig.push({
  watch: {
    jshint: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'build'],
    },
    express: {
      files: ['<%= express.files %>'],
      tasks: ['jshint:express', 'express:dev'],
      options: { spawn: false }
    }
  }
});

module.exports = function(grunt) {
  grunt.initConfig(_.extend.apply(this, _.union([{
    pkg: grunt.file.readJSON('package.json')
  }], gruntConfig)));
  
  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-express-server');

  // RegisterTasks
  grunt.registerTask('build', ['copy', 'jshint','concat', 'cssmin', 'uglify']);
  grunt.registerTask('serve', ['express:dev', 'watch']);
  grunt.registerTask('start', ['build', 'serve']);
  grunt.registerTask('default', []);
};
