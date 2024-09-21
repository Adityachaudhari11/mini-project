const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

// Replace placeholder with actual password from the environment variable
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// Connect to the database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Required option
  })
  .then(() => console.log("DB connection successful!"))
  .catch(err => console.error("DB connection error:", err)); // Error handling

const port = process.env.PORT || 3005; // Use PORT from environment variables if available
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
