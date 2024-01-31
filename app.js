const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./models/user");
require("./db/conn");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(async (req, res, next) => {
  if (req.path === "/users" && req.method === "POST") {
    try {
      // Hash the password if it exists in the request body
      if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
      }
      next();
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    next();
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
