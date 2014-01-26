var server = require("./app"),
    config = require("./config"),
    env = app.get('env');

server.listen(config[env].port, config[env].host, function() {
  console.log("Docker-Remote Server listening on port ", config[env].port);
});
