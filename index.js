const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

app.use(function (req, res) {
  res.send({ msg: "hello" });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws, req) {
  ws.on('message', function incoming(message) {
  	const payload = JSON.parse(message);
    console.log('received: %s', JSON.stringify(payload[0]));
    wss.broadcast(JSON.stringify(payload[0]));
  });
});

server.listen(3000, function listening() {
  console.log('Listening on %d', server.address().port);
});