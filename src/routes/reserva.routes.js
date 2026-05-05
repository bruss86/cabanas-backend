const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");

const {
  getReservas,
  createReserva,
  updateReserva,
  deleteReserva
} = require("../controllers/reserva.controller");

router.get("/", auth, getReservas);
router.post("/", auth, createReserva);
router.put("/:id", auth, updateReserva);
router.delete("/:id", auth, deleteReserva);

module.exports = router;