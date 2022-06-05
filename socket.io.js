module.exports = (io) => {
  io.users = [];

  io.on("connection", (socket) => {
    socket.on("user connected", function (user) {
      socket.user = { ...user, status: "Online" };

      io.users.forEach((user) => {
        if (user.email === socket.user.email) {
          user.status = "Online";
        }
      });

      io.emit("add users status", io.users);
    });

    socket.on("disconnect", () => {
      io.users.forEach((user) => {
        if (socket.user.email === user.email) {
          user.status = "Offline";
        }
      });

      io.emit("add users status", io.users);
    });

    socket.on("send message", (user) => {
      //io.emit("add message", { ...data }); //send for all users
      //socket.emit("add message", { ...data });
      socket.broadcast.emit("add message", { ...user }); //broadcast emit for everyone excepts the user who sent it.
    });
  });
};
