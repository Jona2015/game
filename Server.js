const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3000 });
const players = {};

wss.on("connection", ws => {
  const id = Math.random().toString(36).slice(2);

  players[id] = {
    x: 0,
    y: 0,
    len: 20
  };

  ws.on("message", msg => {
    const data = JSON.parse(msg);
    players[id] = data;
  });

  ws.on("close", () => {
    delete players[id];
  });

  ws.send(JSON.stringify({ id }));
});

setInterval(() => {
  const data = JSON.stringify(players);
  wss.clients.forEach(c => {
    if (c.readyState === WebSocket.OPEN) {
      c.send(data);
    }
  });
}, 50);

console.log("Server läuft auf Port 3000");
