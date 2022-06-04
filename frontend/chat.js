export default function () {
  // eslint-disable-next-line no-undef
  const socket = io("http://localhost:3000");

  const messagesContainer = document.querySelector("#messages-container");

  const messageInput = document.querySelector("#message-input");
  const messageButton = document.querySelector("#message-button");
  const username = document.querySelector("#user").value;

  messageButton.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
  });

  async function sendMessage() {
    if (messageInput.value.length) {
      socket.emit("send message", { name: username, message: messageInput.value });

      messageInput.value = "";
      messageInput.focus();
    }
  }

  socket.emit("new user", username);

  socket.on("enter chat", (username) => {
    messagesContainer.innerHTML += `<h6 class="text-center my-2">${username} entrou no chat</h6>`;
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on("exit chat", (username) => {
    messagesContainer.innerHTML += `<h6 class="text-center my-2">${username} saiu no chat</h6>`;
    window.scrollTo(0, document.body.scrollHeight);
  });

  //kinda simulation of jsx idk ahahahashahaahhaah
  socket.on("add message", (data) => {
    //eslint-disable-next-line
    messagesContainer.innerHTML +=
     `<div class="d-flex ${username === data.name ? "justify-content-end" : ""}">
        <div class="bg-primary p-2  my-2 rounded-2 text-light dialog">
          ${username === data.name ? "" : `<h6>${data.name}</h6>`}
          <p class="fs-6 m-0">
            <small>
              ${data.message}
            </small>
          </p>
        </div>
      </div>`;

    window.scrollTo(0, document.body.scrollHeight);
  });
}
