const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const logger = require("morgan");
const compression = require('compression');
const app = express();
app.use(logger("dev"));
app.use(compression());
app.use(
  cors({
    origin: ["http://localhost:4200","http://192.168.1.19:4200"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true ,limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://localhost:4200","http://192.168.1.19:4200"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  socket.on("join-user", async (data) => {
    const users = [];
    if (data != null) {
      socket.username = data;
      socket.join(data);
      console.log(data);
      for (let [id, socket] of io.of("/").sockets) {
        var check = users.filter((d) => d.username == data);
        if (check.length == 0) {
          users.push({
            userID: id,
            username: socket.username,
          });
        }
      }
  
      io.sockets.emit("users", {users:users});
    } else {
      console.log("nnn");
      console.log(data);
    }
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.username);
  });

});
app.set("chatsocketio", io);
app.use("/api", require("./routes/api"));
app.get("*", function (req, res) {
  res.status(404).send("Under Maintenance Mode");
});
httpServer.listen(2022, (token) => {
  if (token) {
    console.warn("port already in use");
  } else {
    console.log("chatapp run on 2022");
  }
});
