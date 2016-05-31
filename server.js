var http = require("http");

var express = require('./model/configuration/expressConfig');
var mongoose = require('./model/configuration/mongooseConfig');
var webSocketServer = require('./model/configuration/webSocketServerConfig');


var port = process.env.PORT || 8000;

var app = express(); // Initialize express configuration
mongoose(); //Initialize mongoose configuration

server = http.createServer(app);

server.listen(port);
console.log("listening on port " + port + "\n");

webSocketServer(server); // Initialize web sockets