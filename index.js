"use strict";
var server = require("./app"),
    config = require("./config"),
    env = process.env.NODE_ENV,
    ip = config[env].server.host,
    port = config[env].server.port;

server.listen(port, ip, function() {
  console.log("Docker-Remote Server listening on port ", port);
});
