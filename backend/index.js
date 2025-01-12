import app from "express";

const router = app.Router();

router.get("/", (req, res) => {
  res.json(req.body);
});
