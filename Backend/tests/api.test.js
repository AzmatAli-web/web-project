const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const uploadDir = fs.mkdtempSync(path.join(os.tmpdir(), "campus-api-test-"));
process.env.UPLOAD_DIR = uploadDir;
process.env.JWT_SECRET = "test-only-secret-never-use-in-production";
process.env.CORS_ORIGINS = "https://campus.example";
delete process.env.STRIPE_SECRET_KEY;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Product = require("../models/product");
const User = require("../models/user");
let databaseUnavailable = false;
const databasePath = require.resolve("../config/database");
require.cache[databasePath] = {
  id: databasePath,
  filename: databasePath,
  loaded: true,
  exports: async () => {
    if (databaseUnavailable) throw new Error("offline");
  },
};
const sellerId = new mongoose.Types.ObjectId();
const productId = new mongoose.Types.ObjectId();
const user = {
  _id: sellerId,
  name: "Test member",
  role: "user",
  email: "member@example.test",
};
const fixture = {
  _id: productId,
  name: "Algebra [Book]",
  price: 850,
  category: "books",
  image: "uploads/book.jpg",
  seller: { _id: sellerId, name: "Test member" },
};
let saved,
  deleted = false,
  lastQuery;
function query(result) {
  return {
    sort() {
      return this;
    },
    populate() {
      return this;
    },
    select() {
      return this;
    },
    lean: async () => result,
    then(resolve, reject) {
      return Promise.resolve(result).then(resolve, reject);
    },
  };
}
Product.find = (criteria) => {
  lastQuery = criteria;
  return query([fixture]);
};
User.findById = async () => user;
User.findOne = async () => null;
Product.findById = () => {
  const document = {
    ...fixture,
    seller: sellerId,
    save: async function () {
      saved = this;
      return this;
    },
    populate: async function () {
      this.seller = { _id: sellerId, name: "Test member" };
      return this;
    },
    toObject() {
      return { ...this };
    },
    deleteOne: async () => {
      deleted = true;
    },
  };
  return {
    populate() {
      return query(fixture);
    },
    then(resolve, reject) {
      return Promise.resolve(document).then(resolve, reject);
    },
  };
};
const app = require("../app");
let server, base;
before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((resolve) => server.close(resolve));
  fs.rmSync(uploadDir, { recursive: true, force: true });
});
const auth = () => ({
  Authorization: `Bearer ${jwt.sign({ id: sellerId }, process.env.JWT_SECRET)}`,
});
const request = (url, options = {}) => fetch(base + url, options);
test("health reports database readiness", async () => {
  const response = await request("/api/health");
  assert.equal(response.status, 200);
  assert.equal((await response.json()).database, "connected");
});
test("catalog returns product data and normalized image paths", async () => {
  const response = await request("/api/products");
  assert.equal(response.status, 200);
  const products = await response.json();
  assert.equal(products[0].imageUrl, "/uploads/book.jpg");
});
test("legacy listings API uses the same Mongo-backed catalog", async () => {
  const response = await request("/api/listings");
  assert.equal(response.status, 200);
  assert.equal((await response.json())[0].name, fixture.name);
});
test("search escapes regular-expression input", async () => {
  const response = await request("/api/products/search?q=%5BBook%5D");
  assert.equal(response.status, 200);
  assert.equal(lastQuery.$or[0].name.$regex, "\\[Book\\]");
});
test("category matching cannot inject regex patterns", async () => {
  const response = await request("/api/products/category/books.*");
  assert.equal(response.status, 200);
  assert.equal(lastQuery.category.$regex.source, "^books\\.\\*$");
});
test("public seller route resolves seller ID", async () => {
  const response = await request(`/api/products/user/${sellerId}`);
  assert.equal(response.status, 200);
  assert.equal(lastQuery.seller, String(sellerId));
});
test("protected routes reject missing bearer tokens", async () => {
  const response = await request("/api/cart");
  assert.equal(response.status, 401);
});
test("CORS permits the configured frontend origin", async () => {
  const response = await request("/api/products", {
    headers: { Origin: "https://campus.example" },
  });
  assert.equal(
    response.headers.get("access-control-allow-origin"),
    "https://campus.example",
  );
});
test("CORS does not grant cross-origin access to unknown hosts", async () => {
  const response = await request("/api/products", {
    headers: { Origin: "https://unknown.example" },
  });
  assert.equal(response.headers.get("access-control-allow-origin"), null);
});
test("multipart edit saves text fields, a zero price, and a new image", async () => {
  const form = new FormData();
  form.append("name", "Updated book");
  form.append("price", "0");
  form.append(
    "image",
    new Blob([Buffer.from([137, 80, 78, 71])], { type: "image/png" }),
    "cover.png",
  );
  const response = await request(`/api/products/${productId}`, {
    method: "PUT",
    headers: auth(),
    body: form,
  });
  assert.equal(response.status, 200, await response.clone().text());
  assert.equal(saved.name, "Updated book");
  assert.equal(saved.price, 0);
  assert.match(saved.image, /\.png$/);
  assert.equal(fs.existsSync(path.join(uploadDir, saved.image)), true);
  const image = await request("/uploads/" + saved.image);
  assert.equal(image.status, 200);
});
test("edit can remove an existing photo", async () => {
  const form = new FormData();
  form.append("removeImage", "true");
  const response = await request(`/api/products/${productId}`, {
    method: "PUT",
    headers: auth(),
    body: form,
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).product.imageUrl, null);
});
test("edits reject negative prices", async () => {
  const response = await request(`/api/products/${productId}`, {
    method: "PUT",
    headers: { ...auth(), "Content-Type": "application/json" },
    body: JSON.stringify({ price: -1 }),
  });
  assert.equal(response.status, 400);
});
test("non-owners cannot delete someone else’s product", async () => {
  const original = user._id;
  user._id = new mongoose.Types.ObjectId();
  try {
    deleted = false;
    const response = await request(`/api/products/${productId}`, {
      method: "DELETE",
      headers: auth(),
    });
    assert.equal(response.status, 403);
    assert.equal(deleted, false);
  } finally {
    user._id = original;
  }
});
test("owners can delete their own product", async () => {
  deleted = false;
  const response = await request(`/api/products/${productId}`, {
    method: "DELETE",
    headers: auth(),
  });
  assert.equal(response.status, 200);
  assert.equal(deleted, true);
});
test("admin API denies regular members", async () => {
  const response = await request("/api/admin/stats/dashboard", {
    headers: auth(),
  });
  assert.equal(response.status, 403);
});
test("no hardcoded admin login shortcut remains", async () => {
  const response = await request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@campus.com", password: "admin123" }),
  });
  assert.equal(response.status, 400);
});
test("checkout without configuration returns an actionable error", async () => {
  const response = await request("/api/cart/create-checkout-session", {
    method: "POST",
    headers: auth(),
  });
  assert.equal(response.status, 503);
  assert.match((await response.json()).message, /not configured/);
});
test("unknown API endpoints return JSON rather than frontend HTML", async () => {
  const response = await request("/api/does-not-exist");
  assert.equal(response.status, 404);
  assert.match(response.headers.get("content-type"), /application\/json/);
});
test("database failures return JSON 503 rather than hanging or killing the process", async () => {
  databaseUnavailable = true;
  try {
    const response = await request("/api/products");
    assert.equal(response.status, 503);
    assert.match((await response.json()).message, /database is unavailable/);
    const health = await request("/api/health");
    assert.equal(health.status, 503);
  } finally {
    databaseUnavailable = false;
  }
  assert.equal((await request("/api/health")).status, 200);
});
