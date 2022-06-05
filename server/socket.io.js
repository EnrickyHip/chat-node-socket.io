const Users = require("./Users");

module.exports = (io) => {
  io.users = new Users();

  io.on("connection", (socket) => {
    socket.on("user connected", function (user) {
      socket.user = { ...user, status: "Online" };

      io.users.setStatus("Online", socket.user);
      io.emit("add users status", io.users.users);
    });

    socket.on("disconnect", () => {
      io.users.setStatus("Offline", socket.user);
      io.emit("add users status", io.users.users);
    });

    socket.on("send message", (user) => {
      //io.emit("add message", { ...data }); //send for all users
      //socket.emit("add message", { ...data });
      socket.broadcast.emit("add message", { ...user }); //broadcast emit for everyone excepts the user who sent it.
    });

    socket.on("typing", (user) => {
      io.users.setStatus("typing...", user);
      io.emit("add users status", io.users.users);
    });

    socket.on("stop typing", (user) => {
      io.users.setStatus("Online", user);
      io.emit("add users status", io.users.users);
    });
  });
};
