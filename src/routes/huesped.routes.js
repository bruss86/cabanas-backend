const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");

const {
  createHuesped,
  getHuespedes,
  getHuespedById,
  updateHuesped,
  deleteHuesped
} = require("../controllers/huesped.controller");

router.post("/", auth, createHuesped);
router.get("/", auth, getHuespedes);
router.get("/:id", auth, getHuespedById);
router.put("/:id", auth, updateHuesped);
router.delete("/:id", auth, deleteHuesped);

module.exports = router;