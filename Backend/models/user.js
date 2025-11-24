class User {
  constructor(email, password, name) {
    this.id = null;
    this.email = email;
    this.password = password;
    this.name = name;
    this.createdAt = new Date();
  }
}

module.exports = User;