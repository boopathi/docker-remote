"use strict";

var http = require("http"),
    Q = require("q"),
    _ = require("underscore"),
    config = require("../config"),
    env = process.env.NODE_ENV || "development";

var docker = {};

docker.errors = {
  imageinfo: {
    "404": "Image Not Found",
    "500": "Internal Server Error"
  },
  deleteimage: {
    "404": "No such Image",
    "409": "Conflict",
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
  var options = _.extend({
    host: config[env].docker.host,
    port: config[env].docker.port
  }, opts);
  return function() {
    var q = Q.defer();
    var req = http.request(options, function(res) {
      if(res.statusCode >= 200 && res.statusCode < 210) {
        // we are expecting only JSON data
        var data = [];
        res.on('data', function(d) {
          data.push(JSON.parse(d));
        });
        res.on('end', function() {
          q.resolve(data);
        });
      } else {
        q.reject({
          statusCode: res.statusCode,
          desc: docker.errors[from][res.statusCode.toString()]
        });
      }
    });
    req.on('socket', function(socket) {
      socket.setTimeout(10000);
      socket.on('timeout', function() {
        req.abort();
      });
    });
    req.on('error', function(err) {
      console.log("Error occurred");
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
    method: "GET"
  }, "imageinfo")();
};

docker.deleteImage = function(img) {
  return getter({
    path: "/images/" + img,
    method: "DELETE"
  }, 'deleteimage')();
};

module.exports = docker;
