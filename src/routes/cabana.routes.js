const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");

const {
  createCabana,
  getCabanas,
  getCabanaById,
  updateCabana,
  deleteCabana
} = require("../controllers/cabana.controller");

router.post("/", auth, createCabana);
router.get("/", auth, getCabanas);
router.get("/:id", auth, getCabanaById);
router.put("/:id", auth, updateCabana);
router.delete("/:id", auth, deleteCabana);

module.exports = router;