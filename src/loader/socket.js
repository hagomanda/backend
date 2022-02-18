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

    socket.on("joinMandal", id => {
      currentRoom = "room" + id;
      socket.join(currentRoom);
    });

    socket.on("leaveMandal", () => {
      socket.leave(currentRoom);
    });

    socket.on("selectMandalBox", (user, boxId) => {
      console.log(user, boxId);
      socket.broadcast.to(currentRoom).emit("selectMandalBox", user, boxId);
    });

    socket.on("message", (message, createdAt, user) => {
      const { displayName, profile } = user;
      console.log(message, createdAt, user);
      app.io
        .to(currentRoom)
        .emit("message", message, createdAt, displayName, profile);
    });
  });
}

module.exports = startSocket;
