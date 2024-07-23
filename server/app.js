const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jsonswebtoken = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const User = require("./models/user");
const { createTokens, validateToken } = require("./JWT");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose
  .connect("mongodb+srv://sameer:sam@cluster0.xlerpy4.mongodb.net/auth")
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.post("/signup", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      userName: userName,
      password: hash,
    });
    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    if (err.code && err.code === 11000) {
      res.status(409).send("User with this username already exists");
    } else {
      console.log(err);
      res.status(500).send("Error creating user");
    }
  }
});

app.post("/signin", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName: userName });
    if (user) {
      const pass = user.password;
      bcrypt.compare(password, pass).then((match) => {
        if (!match) {
          res.send("Wrong Password");
        } else {
          const accessToken = createTokens(user);
          res.cookie("accessToken", accessToken, {
            maxAge: 60 * 60 * 24 * 30 * 1000,
            httpOnly: true,
          });

          res.send("Logged in");
        }
      });
    } else {
      res.send("User does not exist");
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/profile", validateToken, (req, res) => {
  res.send("Profile");
});

app.listen(4000, () => {
  console.log("App is running");
});
