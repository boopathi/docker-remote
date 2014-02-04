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
  imagetagrepo: {
    "400": "Bad Parameter",
    "404": "No such image",
    "409": "Conflict",
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
  containercreate: {
    "404": "No such container",
    "406": "Impossible to attach",
    "500": "Internal Server Error"
  },
  all: {
    "500": "Internal Server Error"
  }
};

var getter = function(opts, from) {
  if(typeof opts.data === "undefined") opts.data = "";
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
          desc: docker.errors[from.toString()][res.statusCode.toString()]
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
    req.write(opts.data + "\n");
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
  path: "/containers/json?all=1&size=1",
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
  path: "/images/json?all=1",
  method: "GET"
}, "images");

docker.getImageInfo = function(img) {
  return getter({
    path: "/images/" + img + "/json",
    method: "GET"
  }, "imageinfo")();
};

docker.tagRepo = function(img, tag) {
  return getter({
    path: "/images/" + img + "/tag?repo=" + tag,
    method: "POST"
  }, "imagetagrepo")();
};

docker.quickSpawnContainer = function(img) {
  return getter({
    path: "/containers/create",
    method: "POST",
    data: JSON.stringify({
      "Image": img
    })
  }, "containercreate")();
};

docker.deleteImage = function(img) {
  return getter({
    path: "/images/" + img,
    method: "DELETE"
  }, 'deleteimage')();
};

module.exports = docker;
