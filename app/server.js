var connect = require("express/node_modules/connect"),
    express = require("express"),
    cookie = require("cookie"),
    routes = require("./routes"),
    socketio = require("socket.io"),
    http = require("http"),
    path = require("path"),
    store = new express.session.MemoryStore(),
    config = require("../config.js");

var app = express();

var env = app.get('env');

app.set('port', config[env].server.port);
app.set('ip', config[env].server.host);
app.set('views', path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(config[env].SECRET));
app.use(express.session({
  secret: SECRET,
  store: store,
  key: 'docker-remote',
}));
app.use(express.static(path.join(__dirname, 'public')));


if('development' === env) {
  app.use(express.errorHandler());
}

//App routes
app.get('/', routes.index);
app.get('/images', routes.images);
app.get('/containers', routes.containers);
app.get('/image/:imageid', routes.imageinfo);
app.get('/container/:containerid', routes.containerinfo);

var server = http.createServer(app),
    io = socketio.listen(server),
    parseCookie = connect.utils.parseSignedCookie;

//TODO: configure io in a separate file websockets.js

app.use(app.router);

module.exports = server;
