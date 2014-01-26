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

var getter = function(opts) {
  var options = {
    host: config[env].docker.host,
    port: config[env].docker.port
  };
  return function() {
    var q = Q.defer();
    var req = http.request(_.extend(options,opts), function(res) {
      res.on('data', function(data) {
        q.resolve(data,res);
      });
    });
    req.on('error', function(err) {
      q.reject(err);
    });
    req.end();
    return q.promise;
  };
};

//Container related stuff
docker.getContainers = getter({
  path: "/containers/json",
  method: "GET"
});

//Images related stuff
docker.getImages = getter({
  path: "/images/json",
  method: "GET"
});

module.exports = docker;
