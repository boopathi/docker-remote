var connect = require("express/node_modules/connect"),
    express = require("express"),
    cookie = require("cookie"),
    routes = require("./routes"),
    http = require("http"),
    path = require("path"),
    socketio = require("socker.io"),
    store = new express.session.MemoryStore();

