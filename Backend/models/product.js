class Product {
  constructor(name, price, description) {
    this.id = null;
    this.name = name;
    this.price = price;
    this.description = description;
    this.createdAt = new Date();
  }
}

module.exports = Product;