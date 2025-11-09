const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const fullURI = `${mongoURI}/${dbName}?retryWrites=true&w=majority`;

// connect to mongodb
mongoose
  .connect(fullURI)
  .then(() => console.log(`Database connected: ${dbName}`))
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

// create a schema
const loginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// create a model
const collection = new mongoose.model("users", loginSchema);

module.exports = collection;
