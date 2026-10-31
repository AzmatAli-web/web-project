const mongoose = require("mongoose");
const { randomUUID } = require("node:crypto");
const path = require("node:path");
const { Readable } = require("node:stream");
const { pipeline } = require("node:stream/promises");

const getBucket = () =>
  new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "productImages",
  });

async function saveUpload(file, bucket) {
  if (!file) return null;
  if (!file.buffer) return file.filename; // Persistent-disk backends and existing local development.
  const filename = `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`;
  const destination = (bucket || getBucket()).openUploadStream(filename, {
    metadata: { contentType: file.mimetype },
  });
  await pipeline(Readable.from(file.buffer), destination);
  return filename;
}

async function serveImage(req, res, next) {
  try {
    await require("../config/database")();
    const bucket = getBucket();
    const file = await bucket
      .find({ filename: req.params.filename })
      .limit(1)
      .next();
    if (!file) return res.status(404).json({ message: "Image not found" });
    res.set({
      "Content-Type": file.metadata?.contentType || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=86400",
    });
    await pipeline(bucket.openDownloadStream(file._id), res);
  } catch (error) {
    next(error);
  }
}
module.exports = { saveUpload, serveImage };
