const ws = require("ws");
const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const wss = new ws.Server({port: 8080});

const PORT = process.env.PORT || 3000;
const users = {};
 
wss.on("connection", (socket, req) => {
  let id = 0;
  while (true) {
    if (!users.hasOwnProperty(id)) { users[id] = socket; break; }
    id++;
  }
 
  socket.on("close", () => delete users[id]);
 
  socket.on("message", msg => {
    let message = msg.toString().replace(/(<([^>]+)>)/gi, "");
    for (let u in users) { users[u].send(message); }
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


