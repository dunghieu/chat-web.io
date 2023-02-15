
var chat = {
  // (A) INIT CHAT
  name : null, // user's name
  socket : null, // chat websocket
  ewrap : null, // html chat history
  emsg : null, // html chat message
  ego : null, // html chat go button
  init : () => {
    // (A1) GET HTML ELEMENTS
    chat.ewrap = document.getElementById("chatShow");
    chat.emsg = document.getElementById("chatMsg");
    chat.ego = document.getElementById("chatGo");
 
    // (A2) USER'S NAME
    chat.name = prompt("What is your name?", "John");
    if (chat.name == null || chat.name=="") { chat.name = "Mysterious"; }
 
    // (A3) CONNECT TO CHAT SERVER
    chat.socket = new WebSocket("ws://localhost:8080");
 
    // (A4) ON CONNECT - ANNOUNCE "I AM HERE" TO THE WORLD
    chat.socket.addEventListener("open", () => {
      chat.controls(1);
      chat.send("Joined the chat room.");
    });
 
    chat.socket.addEventListener("message", evt => chat.draw(evt.data));
 
    chat.socket.addEventListener("close", () => {
      chat.controls();
      alert("Websocket connection lost!");
    });
    chat.socket.addEventListener("error", err => {
      chat.controls();
      console.log(err);
      alert("Websocket connection error!");
    });
  },
 
  controls : enable => {
    if (enable) {
      chat.emsg.disabled = false;
      chat.ego.disabled = false;
    } else {
      chat.emsg.disabled = true;
      chat.ego.disabled = true;
    }
  },
 
  send : msg => {
    if (msg == undefined) {
      msg = chat.emsg.value;
      chat.emsg.value = "";
    }
    chat.socket.send(JSON.stringify({
      name: chat.name,
      msg: msg
    }));
    return false;
  },
 
  draw : msg => {
    msg = JSON.parse(msg);
    console.log(msg);
 
    let row = document.createElement("div");
    row.className = "chatRow";
    row.innerHTML = `<div class="chatName">${msg["name"]}</div> <div class="chatMsg">${msg["msg"]}</div>`;
    chat.ewrap.appendChild(row);
 
    window.scrollTo(0, document.body.scrollHeight);
  }
};
window.addEventListener("DOMContentLoaded", chat.init);