const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const placeRoutes = require("./routes/places");
const userRoutes = require("./routes/users");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/places", placeRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("Social Map Backend працює!"));

app.listen(PORT, () => console.log(`Server запущено на порті ${PORT}`));
