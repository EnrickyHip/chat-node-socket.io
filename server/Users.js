module.exports = class Users {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    this.users.push({ name: user.name, email: user.email, status: "Online" });
  }

  removeUser(userToRemove) {
    this.users = this.users.filter((user) => user.email !== userToRemove.email);
  }

  setStatus(status, userToSet) {
    this.users.forEach((user) => {
      if (user.email === userToSet.email) {
        user.status = status;
      }
    });
  }
};
