const express = require("express");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();

// convert data into json format
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// use EJS as the view engine
app.set("view engine", "ejs");

// static file
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// register user
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };

  try {
    // check if the user already exists in the database
    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
      return res.send(
        "User already exists. Please choose a different username."
      );
    }

    // hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword;

    const userData = await collection.create(data);
    console.log(userData);
    return res.send("User registered successfully! Please log in.");
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).send("An error occurred during registration.");
  }
});

// login user
app.post("/login", async (req, res) => {
  try {
    const checkUser = await collection.findOne({ name: req.body.username });
    if (!checkUser) {
      return res.send("User not found.");
    }

    // compare the hashed password from the database with plain text
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      checkUser.password
    );
    if (passwordMatch) {
      return res.render("Home");
    } else {
      return res.send("Wrong password.");
    }
  } catch (error) {
    return res.status(500).send("An error occurred.");
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
