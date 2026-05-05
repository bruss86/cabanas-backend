const Reserva = require("../models/Reserva");
const Cabana = require("../models/Cabana");

exports.getReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find()
      .populate("cabana")
      .populate("huesped");

    res.json(reservas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener reservas" });
  }
};

exports.createReserva = async (req, res) => {
  try {
    const { cabana, huesped, fechaIngreso, fechaSalida, cantidadPersonas } = req.body;

    const cabanaData = await Cabana.findById(cabana);
    if (!cabanaData) {
      return res.status(404).json({ mensaje: "Cabaña no encontrada" });
    }

    if (cantidadPersonas > cabanaData.capacidadMaxima) {
      return res.status(400).json({ mensaje: "Supera capacidad máxima" });
    }

    const overlap = await Reserva.findOne({
      cabana,
      fechaIngreso: { $lt: fechaSalida },
      fechaSalida: { $gt: fechaIngreso }
    });

    if (overlap) {
      return res.status(400).json({ mensaje: "Fechas ocupadas" });
    }

    const nueva = new Reserva(req.body);
    await nueva.save();

    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear reserva" });
  }
};

exports.updateReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { cabana, huesped, fechaIngreso, fechaSalida, cantidadPersonas, estado } = req.body;

    const reserva = await Reserva.findById(id);
    if (!reserva) {
      return res.status(404).json({ mensaje: "Reserva no encontrada" });
    }

    const cabanaData = await Cabana.findById(cabana);
    if (!cabanaData) {
      return res.status(404).json({ mensaje: "Cabaña no encontrada" });
    } 

    if (cantidadPersonas > cabanaData.capacidadMaxima) {
      return res.status(400).json({ mensaje: "Supera capacidad máxima" });
    }

    const overlap = await Reserva.findOne({
      cabana,
      _id: { $ne: id },
      fechaIngreso: { $lt: fechaSalida },
      fechaSalida: { $gt: fechaIngreso }
    });

    if (overlap) {
      return res.status(400).json({ mensaje: "Fechas ocupadas" });
    }

    reserva.cabana = cabana;
    reserva.huesped = huesped;
    reserva.fechaIngreso = fechaIngreso;
    reserva.fechaSalida = fechaSalida;
    reserva.cantidadPersonas = cantidadPersonas;
    if (estado) reserva.estado = estado;

    await reserva.save();

    res.json(reserva);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar reserva" });
  }
};

exports.deleteReserva = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findById(id);
    if (!reserva) {
      return res.status(404).json({ mensaje: "Reserva no encontrada" });
    }

    await Reserva.findByIdAndDelete(id);

    res.json({ mensaje: "Reserva eliminada" });
  } catch (error) {
    console.error(error); // 🔥 importante para debug real
    res.status(500).json({ mensaje: "Error al eliminar reserva" });
  }
};
