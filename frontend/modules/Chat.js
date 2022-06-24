export default class Chat {
  constructor(user, socket, messageInput, messageButton, messagesContainer, participantsContainer) {
    this.messagesContainer = messagesContainer;
    this.participantsContainer = participantsContainer;
    this.messageInput = messageInput;
    this.messageButton = messageButton;

    this.socket = socket;
    this.user = user;
    this.timer = null;

    this.messageButton.addEventListener("click", () => this.sendMessage());
    this.messageInput.addEventListener("input", () => this.typingMessage()); // for some reason it just works with annonymous func
    this.messageInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") this.sendMessage();
    });

    this.messageInput.focus();
  }

  cleanMessages() {
    this.messagesContainer.innerHTML = "";
  }

  addStatus(users) {
    this.participantsContainer.innerHTML = `<p id="${this.user.email}" class="m-1">Você</p>`;

    for (const key in users) {
      const user = users[key];
      if (user.email === this.user.email) continue;
      this.participantsContainer.innerHTML += `<p id="${user.email}" class="m-1">${user.name}: ${user.status}</p>`;
    }
  }

  addOldMessages(messages) {
    messages.forEach((message) => {
      if (message.type === "message") return this.addMessage(message);
      return this.addMainMessage(message);
    });
  }

  addMainMessage(message) {
    if (message.user.name === this.user.name) message.user.name = "Você";
    this.messagesContainer.innerHTML += `<h6 class="text-center my-2">${message.user.name} ${message.text}</h6>`;
    window.scrollTo(0, document.body.scrollHeight);
  }

  //kinda simulation of jsx idk
  addMessage(message) {
    message.date = new Date(message.date);
    //eslint-disable-next-line
    this.messagesContainer.innerHTML += `
      <div class="d-flex my-1 ${this.user.name === message.user.name ? "justify-content-end" : ""}">
        <div class="bg-primary p-1 px-2 rounded-2 text-light dialog">
          ${this.user.name === message.user.name ? "" : `<h6 class="mb-0 fs-6">${message.user.name}</h6>`}
          <p class="fs-6 m-0">
            <small class="pe-2">
              ${message.text}
            </small>
            <small style="font-size: 9px;" class="text-light">
              ${message.date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </small>
          </p>
        </div>
      </div>`;

    window.scrollTo(0, document.body.scrollHeight);
  }

  sendMessage() {
    if (this.messageInput.value.length) {
      const date = new Date();
      const message = { user: this.user, text: this.messageInput.value, date, type: "message" };

      this.addMessage(message);
      this.socket.emit("send-message", message);

      this.messageInput.value = "";
      this.messageInput.focus();
    }
  }

  typingMessage() {
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.socket.emit("stop-typing", this.user);
    }, 700);

    this.socket.emit("typing", this.user);
  }
}
