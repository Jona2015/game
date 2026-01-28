const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3000 });
const players = {};

wss.on("connection", ws => {
  const id = Math.random().toString(36).slice(2);

  players[id] = {
    x: 0,
    y: 0,
    angle: 0,
    len: 20
  };

  ws.send(JSON.stringify({ id }));

  ws.on("message", msg => {
    players[id] = JSON.parse(msg);
  });

  ws.on("close", () => delete players[id]);
});

setInterval(() => {
  const data = JSON.stringify(players);
  wss.clients.forEach(c => {
    if (c.readyState === WebSocket.OPEN) c.send(data);
  });
}, 50);

console.log("✅ Multiplayer-Server läuft auf Port 3000");
