function startSocket(app) {
  app.io = require("socket.io")();

  app.io.on("connection", socket => {
    console.log("a user connected");

    socket.on("edit", (context, role, id) => {
      console.log(context, role, id);
    });

    socket.on("disconnect", () => {
      console.log("user discsonnected");
    });
  });
}

module.exports = startSocket;
