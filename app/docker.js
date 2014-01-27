"use strict";

var models = require("./models"),
    http = require("http"),
    Q = require("q"),
    _ = require("underscore"),
    config = require("../config"),
    env = process.env.NODE_ENV || "development";

var options = {
  host: config[env].docker.host,
  port: config[env].docker.port
};

var docker = {};

docker.errors = {
  imageinfo: {
    "404": "Image Not Found",
    "500": "Internal Server Error"
  },
  containerinfo: {
    "404": "Container Not Found",
    "500": "Internal Server Error"
  },
  all: {
    "500": "Internal Server Error"
  }
};

var getter = function(opts, from) {
  var options = {
    host: config[env].docker.host,
    port: config[env].docker.port
  };
  return function() {
    var q = Q.defer();
    var req = http.request(_.extend(options,opts), function(res) {
      if(res.statusCode == 200) {
        res.on('data', function(data) {
          q.resolve(data,res);
        });
      } else {
        q.reject({
          statusCode: res.statusCode,
          desc: docker.errors[from][res.statusCode.toString()]
        });
      }
    });
    req.on('error', function(err) {
      q.reject({
        statusCode: 500,
        desc: err,
      });
    });
    req.end();
    return q.promise;
  };
};

docker.getInfo = getter({
  path: "/info",
  method: "GET",
}, "all");

docker.getVersion = getter({
  path: "/version",
  method: "GET"
}, 'all');

//Container related stuff
docker.getContainers = getter({
  path: "/containers/json",
  method: "GET"
}, "containers");

docker.getContainerInfo = function(cont) {
  return getter({
    path: "/containers/" + cont + "/json",
    method: "GET"
  }, "containerinfo")();
};

//Images related stuff
docker.getImages = getter({
  path: "/images/json",
  method: "GET"
}, "images");

docker.getImageInfo = function(img) {
  return getter({
    path: "/images/" + img + "/json",
    mtethod: "GET"
  }, "imageinfo")();
};

module.exports = docker;
