import Chat from "./modules/Chat";

export default function () {
  //eslint-disable-next-line no-undef
  const socket = io("http://localhost:3000");

  const messagesContainer = document.querySelector("#messages-container");
  const participantsContainer = document.querySelector("#participants-container");
  const messageInput = document.querySelector("#message-input");
  const messageButton = document.querySelector("#message-button");

  const name = document.querySelector("#user").value;
  const email = document.querySelector("#email").value;
  const user = { name, email };

  const chat = new Chat(user, socket, messageInput, messageButton, messagesContainer, participantsContainer);

  socket.on("connect", () => {
    chat?.cleanMessages();
    socket.emit("user-connected", user);
  });

  socket.on("get-all-messages", (messages) => chat.addOldMessages(messages));
  socket.on("add-main-message", (message) => chat.addMainMessage(message));
  socket.on("add-message", (message) => chat.addMessage(message));
  socket.on("add-users-status", (users) => chat.addStatus(users));
}
