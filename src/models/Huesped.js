const mongoose = require("mongoose");

const HuespedSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    apellido: {
      type: String,
      required: true,
      trim: true
    },
    dni: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    telefono: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null,
      lowercase: true,
      trim: true
    },
    observaciones: {
      type: String,
      default: ""
    },
    fechaPrimeraEstadia: {
      type: Date,
      default: null
    },
    fechaUltimaEstadia: {
      type: Date,
      default: null
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Huesped", HuespedSchema);