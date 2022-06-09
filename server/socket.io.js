const Users = require("../src/models/UsersModel");
const Messages = require("../src/models/MessagesModel");

module.exports = (io) => {
  io.users = new Users();
  io.messages = new Messages();

  io.on("connection", (socket) => {
    socket.on("user-connected", async (user) => {
      socket.user = { ...user, status: "Online" };

      if (!(await io.users.userIsInChat(socket.user))) {
        io.users.addUser(socket.user);
      }

      await io.users.setStatus("Online", socket.user);
      socket.emit("get-all-messages", await io.messages.getAllMessages());
      io.emit("add-users-status", await io.users.getAllUsers());
    });

    socket.on("disconnect", async () => {
      await io.users.setStatus("Offline", socket.user);
      io.emit("add-users-status", await io.users.getAllUsers());
    });

    socket.on("send-message", (message) => {
      io.messages.addMessage(message);
      socket.broadcast.emit("add-message", message); //broadcast emits for everyone excepts the user who sent it.
    });

    socket.on("typing", async (user) => {
      await io.users.setStatus("typing...", user);
      io.emit("add-users-status", await io.users.getAllUsers());
    });

    socket.on("stop-typing", async (user) => {
      await io.users.setStatus("Online", user);
      io.emit("add-users-status", await io.users.getAllUsers());
    });
  });
};
