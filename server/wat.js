const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb+srv://sameer:sam@cluster0.xlerpy4.mongodb.net/auth")
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/read", async (req, res) => {
  try {
    const result = await User.find({});
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

app.post("/insert", async (req, res) => {
  const { name, userName, password } = req.body;
  const user = new User({
    name: name,
    userName: userName,
    password: password,
  });
  try {
    await user.save();
    res.send("Data added");
  } catch (error) {
    console.log(error);
  }
});

app.put("/update", async (req, res) => {
  const { userName, name } = req.body;
  try {
    await User.findOneAndUpdate({ userName: userName }, { name: name });
    res.send("Values Updated");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
});

app.delete("/delete/:userName", async (req, res) => {
  const userName = req.params.userName;
  console.log("1 ", userName);
  try {
    const deletedUser = await User.findOneAndDelete({
      userName: userName,
    }).exec();
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(4000, () => {
  console.log("App is running");
});
