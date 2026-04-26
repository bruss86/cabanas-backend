const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();


const cors = require("cors");

app.use(cors({
  origin: "http://www.lasesmeraldasnono.com.ar/reservas"
}));

app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB 🚀"))
  .catch(err => console.log("Error conexión:", err));

// Modelo Cabaña
const CabanaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  capacidadMaxima: { type: Number, required: true },
  descripcion: String,
  activa: { type: Boolean, default: true }
});

const Cabana = mongoose.model("Cabana", CabanaSchema);

// Modelo Huesped
const HuespedSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  dni: { type: String, required: true, unique: true },
  telefono: String,
  email: String,
  observaciones: String,
  fechaPrimeraEstadia: Date,
  fechaUltimaEstadia: Date
});

const Huesped = mongoose.model("Huesped", HuespedSchema);

//Modelo Reserva
const ReservaSchema = new mongoose.Schema({
  huesped: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Huesped",
    required: true
  },
  cabana: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cabana",
    required: true
  },
  fechaIngreso: { type: Date, required: true },
  fechaSalida: { type: Date, required: true },
  cantidadPersonas: { type: Number, required: true },
  total: Number,
  estado: {
    type: String,
    enum: ["pendiente", "confirmada", "cancelada"],
    default: "pendiente"
  }
});

const Reserva = mongoose.model("Reserva", ReservaSchema);

// Rutas
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

app.get("/reservas", async (req, res) => {
  const reservas = await Reserva.find()
    .populate("cabana")
    .populate("huesped");

  res.json(reservas);
});

app.post("/reservas", async (req, res) => {
  try {
    const {
      cabana,
      huesped,
      fechaIngreso,
      fechaSalida,
      cantidadPersonas
    } = req.body;

    // 1️⃣ Verificar que la cabaña exista
    const cabanaData = await Cabana.findById(cabana);
    if (!cabanaData) {
      return res.status(404).json({ mensaje: "Cabaña no encontrada" });
    }

    // 2️⃣ Validar capacidad máxima
    if (cantidadPersonas > cabanaData.capacidadMaxima) {
      return res.status(400).json({
        mensaje: "La cantidad de personas supera la capacidad máxima"
      });
    }

    // 3️⃣ Buscar reservas que se superpongan
    const reservaExistente = await Reserva.findOne({
      cabana,
      fechaIngreso: { $lt: fechaSalida },
      fechaSalida: { $gt: fechaIngreso }
    });

    if (reservaExistente) {
      return res.status(400).json({
        mensaje: "La cabaña ya está reservada en esas fechas"
      });
    }

    // 4️⃣ Crear reserva
    const nuevaReserva = new Reserva({
      cabana,
      huesped,
      fechaIngreso,
      fechaSalida,
      cantidadPersonas
    });

    await nuevaReserva.save();

    res.json(nuevaReserva);

  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear reserva" });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

//CABAÑAS---------------------------------------------------------------------------
app.post("/cabanas", async (req, res) => {
  try {
    const nuevaCabana = new Cabana(req.body);
    await nuevaCabana.save();
    res.json(nuevaCabana);
  } catch (error) {
    res.status(500).json({ error: "Error al crear cabaña" });
  }
});

// Obtener todas las cabañas
app.get("/cabanas", async (req, res) => {
  const cabanas = await Cabana.find();
  res.json(cabanas);
});

// Eliminar cabaña
app.delete("/cabanas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cabanaEliminada = await Cabana.findByIdAndDelete(id);
    if (!cabanaEliminada) {
      return res.status(404).json({ mensaje: "Cabaña no encontrada" });
    }
    res.json({ mensaje: "Cabaña eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar cabaña" });
  }
});



//HUESPEDES---------------------------------------------------------------------------

app.get("/huespedes", async (req, res) => {
  const huespedes = await Huesped.find();
  res.json(huespedes);
});

app.post("/huespedes", async (req, res) => {
  const nuevo = new Huesped(req.body);
  await nuevo.save();
  res.json(nuevo);
});

app.put("/huespedes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await Huesped.findByIdAndUpdate(id, req.body, { new: true });
    if (!actualizado) {
      return res.status(404).json({ mensaje: "Huésped no encontrado" });
    }
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar huésped" });
  }
});

app.delete("/huespedes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Huesped.findByIdAndDelete(id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: "Huésped no encontrado" });
    }
    res.json({ mensaje: "Huésped eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar huésped" });
  }
});



//RESERVAS---------------------------------------------------------------------------

app.delete("/reservas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const reservaEliminada = await Reserva.findByIdAndDelete(id);

    if (!reservaEliminada) {
      return res.status(404).json({ mensaje: "Reserva no encontrada" });
    }

    res.json({ mensaje: "Reserva eliminada correctamente" });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar reserva" });
  }
});
