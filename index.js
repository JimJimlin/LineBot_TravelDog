var express = require('express');
var map = express();
var server = require('http').Server(map);
var io = require('socket.io')(server);
var path = require('path');

server.listen(9487);

map.use(express.static(path.join(__dirname,'public')));

map.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});