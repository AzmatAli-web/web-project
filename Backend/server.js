const app = require("./app");
const connectDB = require("./config/database");
const port = process.env.PORT || 5000;
connectDB()
  .then(() =>
    app.listen(port, () =>
      console.log(`Marketplace API listening on port ${port}`),
    ),
  )
  .catch(() => {
    console.error("Cannot start: check MONGODB_URI and database access.");
    process.exitCode = 1;
  });
