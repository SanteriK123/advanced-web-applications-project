const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const users = require("./routes/users");

require("dotenv").config();

const port = process.env.PORT || 3000;

//const mongoDB = "mongodb://localhost:27017/jwt";
const mongoDB = "mongodb://127.0.0.1:27017/testdb";

try {
  mongoose.connect(mongoDB);
} catch (err) {
  console.log(err);
}

// Create express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// Routes to be used in the app
app.use("/api", users);

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
