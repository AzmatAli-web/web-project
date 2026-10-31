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
      .catch((error) => {
        // Log diagnostic codes, never the URI, credentials, or raw error object.
        console.error("Database connection failed", {
          name: error.name,
          failure: /auth|password|credentials/i.test(error.message || "") ? "authentication" : "connection",
          code: error.code,
          cause: error.cause?.code,
          servers: Array.from(error.reason?.servers?.values() || [], (server) => ({
            type: server.type,
            error: server.error?.name,
            code: server.error?.code,
            cause: server.error?.cause?.code,
          })),
        });
        throw error;
      })
      .finally(() => {
        connecting = null;
      });
  }
  await connecting;
  return mongoose.connection;
};
