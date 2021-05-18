require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const { PORT = 3000, MONGODB_URL } = process.env;
const app = express();

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .on("open", () => console.log("connected to database"))
  .on("close", () => console.log("connection to database closed"))
  .on("error", (err) => console.log(err));

const CheeseSchema = new mongoose.Schema({
  name: String,
  countryOfOrigin: String,
  image: String,
});

const Cheese = mongoose.model("cheese", CheeseSchema);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => res.send("hello world"));

app.get("/cheese", async (req, res) => {
  try {
    res.json(await Cheese.find());
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

app.post("/cheese", async (req, res) => {
  try {
    res.json(await Cheese.create(req.body));
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

app.put("/cheese/:id", async (req, res) => {
  try {
    res.json(
      await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

app.delete("/cheese/:id", async (req, res) => {
  try {
    res.json(await Cheese.findByIdAndRemove(req.params.id));
  } catch (error) {
    console.log(error);
    res.status(400).json(eror);
  }
});

app.listen(PORT, () => console.log(`listening to PORT ${PORT}`));
