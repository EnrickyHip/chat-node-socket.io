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
    await MessagesModel.create(message);
  }

  async getAllMessages() {
    return await MessagesModel.find();
  }

  async getMessagesFrom(message) {
    return await MessagesModel.find({ date: { $gte: message.date } }); //ordena pela data
  }

  async getLastEntry(user) {
    return await MessagesModel.findOne({ "user.email": user.email, type: "main" }).sort({ _id: -1 });
  }
}

module.exports = Messages;
