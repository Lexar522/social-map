import express from "express";
import Comment from "../models/Comment.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/:pinId", async (req, res) => {
  const comments = await Comment.find({ pinId: req.params.pinId });
  res.json(comments);
});

router.post("/:pinId", auth, async (req, res) => {
  const c = await Comment.create({
    pinId: req.params.pinId,
    userId: req.user.id,
    text: req.body.text
  });

  res.json(c);
});

export default router;
