const mongoose = require("mongoose");
let connecting;
module.exports = async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!process.env.MONGODB_URI)
    throw new Error("MONGODB_URI is not configured");
  if (!connecting) {
    connecting = mongoose
      .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,
        bufferCommands: false,
      })
      .finally(() => {
        connecting = null;
      });
  }
  await connecting;
  return mongoose.connection;
};
