const mongoose = require("mongoose");

const CabanaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  capacidadMaxima: { type: Number, required: true },
  descripcion: String,
  activa: { type: Boolean, default: true }
});

module.exports = mongoose.model("Cabana", CabanaSchema);