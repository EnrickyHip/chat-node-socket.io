const moongose = require("mongoose");

const MessagesSchema = moongose.Schema({
  type: { type: String, require: true },
  user: {
    type: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    require: true,
  },
  date: { type: Date, required: true },
  text: { type: String, require: true, default: "" },
});

const MessagesModel = moongose.model("Messages", MessagesSchema);

class Messages {
  async addMessage(message) {
    console.log(message);
    await MessagesModel.create(message);
  }

  async getAllMessages() {
    return await MessagesModel.find().sort({ dateCreated: -1 }); //ordena pela data
  }
}

module.exports = Messages;
