const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const users = require("./routes/users");
const userbrowser = require("./routes/userbrowser");
const chat = require("./routes/chat");

require("dotenv").config();

// Change this to your own port in the env file, routes in the frontend also need to be changed if other than 3000
const port = process.env.PORT || 3000;

// Change this to your own database in the env file
const mongoDB = process.env.DB;

try {
  mongoose.connect(mongoDB);
} catch (err) {
  console.log(err);
}

// Create express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes to be used in the app
app.use("/api", users);
app.use("/api", userbrowser);
app.use("/api", chat);

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
