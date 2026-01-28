<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Multiplayer Test</title>
<style>
body { margin:0; background:#111; overflow:hidden }
canvas { display:block }
</style>
</head>
<body>

<canvas id="c"></canvas>

<script>
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

// 🔴 WICHTIG: IP anpassen (dein PC)
const socket = new WebSocket("ws://localhost:3000");

let myId = null;
let players = {};

socket.onmessage = e => {
  const data = JSON.parse(e.data);
  if (data.id) myId = data.id;
  else players = data;
};

const me = { x: 0, y: 0, angle: 0, len: 20 };
const keys = {};

onkeydown = e => keys[e.key] = true;
onkeyup = e => keys[e.key] = false;

function loop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if (keys["w"]) me.y -= 4;
  if (keys["s"]) me.y += 4;
  if (keys["a"]) me.x -= 4;
  if (keys["d"]) me.x += 4;

  if (socket.readyState === 1 && myId) {
    socket.send(JSON.stringify(me));
  }

  for (const id in players) {
    const p = players[id];
    ctx.fillStyle = id === myId ? "lime" : "cyan";
    ctx.beginPath();
    ctx.arc(
      canvas.width/2 + p.x,
      canvas.height/2 + p.y,
      10,
      0,
      Math.PI*2
    );
    ctx.fill();
  }

  requestAnimationFrame(loop);
}
loop();
</script>

</body>
</html>
