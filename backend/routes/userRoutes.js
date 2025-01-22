const express = require("express");
const {
  getRecruiters,
  getCandidates,
  getUser,
} = require("../controllers/userController.js");

const route = express.Router();

route.get("/", getUser);
route.get("/recruiters", getRecruiters);
route.get("/candidates", getCandidates);

module.exports = route;
