class Listing {
  constructor(title, description, price, userId) {
    this.id = null;
    this.title = title;
    this.description = description;
    this.price = price;
    this.userId = userId;
    this.createdAt = new Date();
  }
}

module.exports = Listing;