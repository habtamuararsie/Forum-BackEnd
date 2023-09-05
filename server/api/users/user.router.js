const router = require("express").Router();
const {
  createUser,
  getUserById,
  login,
  getUsers,
} = require("./user.controller");
const auth = require("../middleware/auth");

router.post("/", createUser);
router.get("/all", getUsers);
router.get("/", auth, getUserById);
router.post("/login", login);

module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjkyMjAyMTg2LCJleHAiOjE2OTIyMDU3ODZ9.2scgY1DjF28N17t-010rVACtrc_ZFy9Zol2J7eKOis0
