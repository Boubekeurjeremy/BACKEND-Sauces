require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

const password = process.env.DB_PASSWORD;
const username = process.env.DB_USER;
const db = process.env.DB_NAME;
mongoose
  .connect(
    `mongodb+srv://${username}:${password}@cluster0.lib5n81.mongodb.net/${db}?retryWrites=true&w=majority`
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/auth", userRoutes), 
app.use("/api/sauces", sauceRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
