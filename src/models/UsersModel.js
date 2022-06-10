const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, require: true },
});

const UsersModel = mongoose.model("Users", UsersSchema);

class Users {
  async addUser(user) {
    if (await this.userIsInChat(user)) return;
    await UsersModel.create(user);
  }

  async removeUser(user) {
    await UsersModel.deleteOne({ email: user.email });
  }

  async setStatus(status, user) {
    user.status = status;
    await UsersModel.updateOne({ email: user.email }, user, { new: true });
  }

  async getAllUsers() {
    return await UsersModel.find({});
  }

  async userIsInChat(user) {
    return await UsersModel.findOne({ email: user.email });
  }
}

module.exports = Users;
