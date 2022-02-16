function startSocket(app) {
  app.io = require("socket.io")();

  app.io.on("connection", socket => {
    console.log("a user connected", socket.id);

    let currentRoom = null;

    socket.on("edit", content => {
      socket.broadcast.to(currentRoom).emit("modifySuccess", content);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}

module.exports = startSocket;
