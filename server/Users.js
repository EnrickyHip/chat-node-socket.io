module.exports = class Users {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    if (!this.userIsOnChat(user)) {
      this.users.push({ name: user.name, email: user.email, status: "Online" });
    }
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

  userIsOnChat(userToTest) {
    return this.users.filter((user) => user.email === userToTest.email).length;
  }
};
