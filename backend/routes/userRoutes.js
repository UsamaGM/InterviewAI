const express = require("express");
const {
  getRecruiters,
  getCandidates,
  getUser,
} = require("../controllers/userController.js");

const route = express.Router();

route.get("/recruiters", getRecruiters);
route.get("/candidates", getCandidates);
route.get("/", getUser);
route.get("/:id", getUser);

module.exports = route;
