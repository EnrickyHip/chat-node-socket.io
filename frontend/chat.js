export default function () {
  //eslint-disable-next-line no-undef
  const socket = io("http://localhost:3000");
  //const socket = io("");

  const messagesContainer = document.querySelector("#messages-container");
  const participantsContainer = document.querySelector("#participants-container");

  const messageInput = document.querySelector("#message-input");
  const messageButton = document.querySelector("#message-button");
  const username = document.querySelector("#user").value;
  const email = document.querySelector("#email").value;

  messageButton.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
  });

  async function sendMessage() {
    if (messageInput.value.length) {
      addMessage(username, messageInput.value);
      socket.emit("send message", { name: username, message: messageInput.value });

      messageInput.value = "";
      messageInput.focus();
    }
  }

  socket.emit("user connected", { name: username, email });

  socket.on("enter chat", (user) => {
    messagesContainer.innerHTML += `<h6 class="text-center my-2">${user.name} entrou no chat</h6>`;
    socket.emit("add user", user);
    // participantsContainer.innerHTML += `<p class="m-1" id="${user.email}">${user.name}: Online</p>`;
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on("exit chat", (user) => {
    messagesContainer.innerHTML += `<h6 class="text-center my-2">${user.name} saiu do chat</h6>`;
    window.scrollTo(0, document.body.scrollHeight);
    socket.emit("remove user", user);
  });

  socket.on("add message", (user) => {
    addMessage(user.name, user.message);
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on("add users status", (users) => {
    console.log("entrou aqui");
    participantsContainer.innerHTML = `<p id="${email}" class="m-1">Você</p>`;

    users.forEach((user) => {
      if (user.email === email) return;
      participantsContainer.innerHTML += `<p id="${user.email}" class="m-1">${user.name}: ${user.status}</p>`;
    });
  });

  //kinda simulation of jsx idk ahahahashahaahhaah
  function addMessage(name, message) {
    //eslint-disable-next-line
    messagesContainer.innerHTML +=
     `<div class="d-flex ${username === name ? "justify-content-end" : ""}">
        <div class="bg-primary p-2  my-2 rounded-2 text-light dialog">
          ${username === name ? "" : `<h6>${name}</h6>`}
          <p class="fs-6 m-0">
            <small>
              ${message}
            </small>
          </p>
        </div>
      </div>`;
  }
}
