import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeApiUrl,
  resolveImageUrl,
  normalizeProducts,
  FALLBACK_IMAGE,
} from "../src/api/config.js";
test("API URL accepts an origin or /api and avoids doubled slashes", () => {
  assert.equal(normalizeApiUrl(""), "/api");
  assert.equal(
    normalizeApiUrl("https://backend.example/"),
    "https://backend.example/api",
  );
  assert.equal(
    normalizeApiUrl("https://backend.example/api/"),
    "https://backend.example/api",
  );
});
test("uploaded images resolve against a separate API origin", () => {
  for (const value of ["cover.jpg", "/uploads/cover.jpg", "uploads\\cover.jpg"])
    assert.equal(
      resolveImageUrl(value, "https://backend.example/api"),
      "https://backend.example/uploads/cover.jpg",
    );
  assert.equal(
    resolveImageUrl("/images/books.jpeg", "https://backend.example/api"),
    "/images/books.jpeg",
  );
  assert.equal(
    resolveImageUrl("https://cdn.example/image.jpg"),
    "https://cdn.example/image.jpg",
  );
  assert.equal(resolveImageUrl(null), FALLBACK_IMAGE);
});
test("catalog rejects HTML or malformed payloads instead of crashing at .slice()", () => {
  assert.throws(() => normalizeProducts("<html>"), /invalid listing response/);
  assert.equal(
    normalizeProducts({ products: [{ _id: "1", image: "cover.jpg" }] })[0]
      .imageUrl,
    "/uploads/cover.jpg",
  );
  assert.deepEqual(normalizeProducts([]), []);
});
