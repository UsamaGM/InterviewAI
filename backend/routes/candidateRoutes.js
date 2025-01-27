const route = require("express").Router();
const {
  getCandidates,
  addCandidate,
  editCandidate,
  deleteCandidate,
  searchAndFilterCandidates,
} = require("../controllers/candidateController.js");

route.get("/", getCandidates);
route.post("/", addCandidate);
route.put("/", editCandidate);
route.delete("/:id", deleteCandidate);
route.get("/search", searchAndFilterCandidates);

module.exports = route;
