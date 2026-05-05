const mongoose = require("mongoose");

const ReservaSchema = new mongoose.Schema(
  {
    huesped: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Huesped",
      required: true,
      index: true
    },
    cabana: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cabana",
      required: true,
      index: true
    },
    fechaIngreso: {
      type: Date,
      required: true,
      index: true
    },
    fechaSalida: {
      type: Date,
      required: true,
      index: true
    },
    cantidadPersonas: {
      type: Number,
      required: true,
      min: 1
    },
    total: {
      type: Number,
      default: 0
    },
    estado: {
      type: String,
      enum: ["pendiente", "confirmada"],
      default: "pendiente",
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Reserva", ReservaSchema);