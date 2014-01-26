"use strict";
var path = require("path"),
    config;

config = {
  development: {
    debug: true,
    docker: {
      host: "172.17.42.1",
      port: "4242"
    },
    server: {
      host: "0.0.0.0",
      port: "4205"
    }
  },
  production: {
    debut: false,
    docker: {
      host: process.env.DOCKER_HOST,
      port: process.env.DOCKER_PORT
    },
    server: {
      host: "0.0.0.0",
      port: process.env.PORT
    }
  }
};

module.exports = config;
