class Users {
  constructor () {
    this.users = [];
  }
  addUser (id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }

  getUser (id) {
    return this.users.filter((user) => user.id === id)[0]
  }

}

module.exports = {Users};
