"use strict";
var config = require("./config"),
    env = process.env.NODE_ENV || "development",
    ip = config[env].server.host,
    port = config[env].server.port,
    profiler, profile_file;

if(config[env].debug) {
  profiler = require("mtrace");
  profile_file = profiler.mtrace();
  console.log("Saving heap profile to ", profile_file);
}

var server = require("./app");

server.listen(port, ip, function() {
  console.log("Docker-Remote Server listening on port ", port);
});

