const { test } = require("node:test");
const assert = require("node:assert/strict");
const { imagePath, serializeCart } = require("../utils/productImage");
test("image paths support uploaded filenames, legacy paths, and external URLs", () => {
  for (const value of [
    "book.jpg",
    "/uploads/book.jpg",
    "uploads/book.jpg",
    "uploads\\book.jpg",
    "/uploads/uploads/book.jpg",
  ])
    assert.equal(imagePath(value), "/uploads/book.jpg");
  assert.equal(
    imagePath("https://cdn.example/item.jpg"),
    "https://cdn.example/item.jpg",
  );
  assert.equal(imagePath("/images/books.jpeg"), "/images/books.jpeg");
  assert.equal(imagePath(null), null);
});
test("cart serialization normalizes images and excludes deleted products", () => {
  const cart = serializeCart({
    items: [
      { product: { name: "Book", image: "cover.jpg" }, quantity: 1 },
      { product: null, quantity: 2 },
    ],
  });
  assert.equal(cart.items.length, 1);
  assert.equal(cart.items[0].product.imageUrl, "/uploads/cover.jpg");
});
const { Writable } = require("node:stream");
const { saveUpload } = require("../utils/imageStorage");
test("serverless uploads stream bytes into durable storage rather than local disk", async () => {
  let received = Buffer.alloc(0),
    storedName,
    metadata;
  const bucket = {
    openUploadStream(name, options) {
      storedName = name;
      metadata = options.metadata;
      return new Writable({
        write(chunk, encoding, callback) {
          received = Buffer.concat([received, chunk]);
          callback();
        },
      });
    },
  };
  const bytes = Buffer.from("temporary test image");
  const filename = await saveUpload(
    { buffer: bytes, originalname: "photo.png", mimetype: "image/png" },
    bucket,
  );
  assert.equal(storedName, filename);
  assert.match(filename, /\.png$/);
  assert.deepEqual(received, bytes);
  assert.equal(metadata.contentType, "image/png");
});
test("failed durable image writes reject without returning a successful filename", async () => {
  const bucket = {
    openUploadStream() {
      return new Writable({
        write(chunk, encoding, callback) {
          callback(new Error("storage unavailable"));
        },
      });
    },
  };
  await assert.rejects(
    saveUpload(
      {
        buffer: Buffer.from("test"),
        originalname: "image.jpg",
        mimetype: "image/jpeg",
      },
      bucket,
    ),
    /storage unavailable/,
  );
});
