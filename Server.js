// Terminal: npm install ws
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 172.20.10.4 });

let players = {}; // alle Spieler

wss.on('connection', ws => {
  const id = Date.now() + Math.random(); // eindeutige Spieler-ID
  players[id] = { x: 0, y: 0, segments: [{x:0,y:0}], len: 20, name:"Spieler", dead:false };

  // ID an neuen Spieler senden
  ws.send(JSON.stringify({ type: 'init', id }));

  ws.on('message', message => {
    try {
      const data = JSON.parse(message);

      if(data.type==='update'){
        // Update Spielerstatus
        if(players[id]){
          players[id].x = data.x;
          players[id].y = data.y;
          players[id].len = data.len;
          players[id].segments = data.segments;
          players[id].dead = data.dead;
        }
      }
    } catch(e){}

    // Broadcast an alle
    const snapshot = JSON.stringify({ type:'players', players });
    wss.clients.forEach(client => {
      if(client.readyState === WebSocket.OPEN) client.send(snapshot);
    });
  });

  ws.on('close', () => {
    delete players[id];
    const snapshot = JSON.stringify({ type:'players', players });
    wss.clients.forEach(client => {
      if(client.readyState === WebSocket.OPEN) client.send(snapshot);
    });
  });
});

console.log("Server läuft auf ws://localhost:3000");
