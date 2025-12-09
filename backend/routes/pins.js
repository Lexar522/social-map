import express from "express";
import Pin from "../models/Pin.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const pins = await Pin.find().sort({ createdAt: -1 });
  res.json(pins);
});

router.post("/", auth, async (req, res) => {
  const { title, body, type, lat, lng } = req.body;

  const pin = await Pin.create({
    userId: req.user.id,
    title,
    body,
    type,
    lat,
    lng
  });

  res.json(pin);
});

export default router;
