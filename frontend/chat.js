export default function () {
  //eslint-disable-next-line no-undef
  const socket = io("http://localhost:3000");

  const messagesContainer = document.querySelector("#messages-container");
  const participantsContainer = document.querySelector("#participants-container");

  const messageInput = document.querySelector("#message-input");
  const messageButton = document.querySelector("#message-button");
  const username = document.querySelector("#user").value;
  const email = document.querySelector("#email").value;

  messageInput.focus();

  let timer;

  messageButton.addEventListener("click", sendMessage);

  messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
  });

  messageInput.addEventListener("input", () => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      socket.emit("stop typing", { name: username, email });
    }, 700);

    socket.emit("typing", { name: username, email });
  });

  socket.emit("user connected", { name: username, email });

  socket.on("enter chat", (user) => {
    messagesContainer.innerHTML += `<h6 class="text-center my-2">${user.name} entrou no chat</h6>`;
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on("exit chat", (user) => {
    messagesContainer.innerHTML += `<h6 class="text-center my-2">${user.name} saiu do chat</h6>`;
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on("add message", (message) => {
    addMessage(message.name, message.text, message.date);
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on("add users status", (users) => {
    participantsContainer.innerHTML = `<p id="${email}" class="m-1">Você</p>`;

    users.forEach((user) => {
      if (user.email === email) return;
      participantsContainer.innerHTML += `<p id="${user.email}" class="m-1">${user.name}: ${user.status}</p>`;
    });
  });

  //kinda simulation of jsx idk
  function addMessage(name, message, date) {
    //eslint-disable-next-line
    messagesContainer.innerHTML += `
      <div class="d-flex my-1 ${username === name ? "justify-content-end" : ""}">
        <div class="bg-primary p-1 px-2 rounded-2 text-light dialog">
          ${username === name ? "" : `<h6 class="mb-0 fs-6">${name}</h6>`}
          <p class="fs-6 m-0">
            <small class="pe-2">
              ${message}
            </small>
            <small style="font-size: 9px;" class="text-light">
              ${date}
            </small>
          </p>
        </div>
      </div>`;
  }

  function sendMessage() {
    if (messageInput.value.length) {
      const date = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

      addMessage(username, messageInput.value, date);
      socket.emit("send message", { name: username, text: messageInput.value, date });

      messageInput.value = "";
      messageInput.focus();
    }
  }
}
