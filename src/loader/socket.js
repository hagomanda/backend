function startSocket(app) {
  app.io = require("socket.io")();

  app.io.on("connection", socket => {
    console.log("a user connected", socket.id);

    let currentRoom = null;

    socket.on("edit", (content, id) => {
      socket.broadcast.to(currentRoom).emit("modifySuccess", content);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("joinMandal", id => {
      currentRoom = "room" + id;
      socket.join(currentRoom);
    });

    socket.on("leaveMandal", () => {
      socket.leave(currentRoom);
    });
  });
}

module.exports = startSocket;
