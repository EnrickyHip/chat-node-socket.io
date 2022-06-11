const Users = require("../src/models/UsersModel");
const Messages = require("../src/models/MessagesModel");

module.exports = (io) => {
  io.users = new Users();
  io.messages = new Messages();

  io.on("connection", (socket) => {
    socket.on("user-connected", (user) => connectUser(io, socket, user));
    socket.on("disconnect", () => disconnect(io, socket));
    socket.on("send-message", (message) => sendMessage(io, socket, message));
    socket.on("typing", (user) => setUserStatus(io, socket, user, "typing..."));
    socket.on("stop-typing", (user) => setUserStatus(io, socket, user, "Online"));
  });
};

async function connectUser(io, socket, user) {
  socket.user = { ...user, status: "Online" };

  if (!(await io.users.userIsInChat(socket.user))) {
    const message = { user, text: "entrou no chat", type: "main", date: new Date() };

    io.users.addUser(socket.user);
    await io.messages.addMessage(message);
    socket.broadcast.emit("add-main-message", message);
  }

  setUserStatus(io, socket, socket.user, "Online");
  const lastEntry = await io.messages.getLastEntry(socket.user);
  socket.emit("get-all-messages", await io.messages.getMessagesFrom(lastEntry));
}

async function disconnect(io, socket) {
  await io.users.setStatus("Offline", socket.user);
  io.emit("add-users-status", await io.users.getAllUsers());
}

function sendMessage(io, socket, message) {
  message.user = { name: socket.user.name, email: socket.user.email }; //overwrites the user sent for meanings of security.
  io.messages.addMessage(message);
  socket.broadcast.emit("add-message", message); //broadcast emits for everyone excepts the user who sent it.
}

async function setUserStatus(io, socket, user, status) {
  user = socket.user;
  await io.users.setStatus(status, user);
  io.emit("add-users-status", await io.users.getAllUsers());
}
