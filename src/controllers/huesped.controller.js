const Huesped = require("../models/Huesped");

// 🔹 Crear huésped
exports.createHuesped = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      dni,
      telefono,
      email,
      observaciones,
      fechaPrimeraEstadia,
      fechaUltimaEstadia
    } = req.body;

    // 1️⃣ Validación básica
    if (!nombre || !apellido || !dni) {
      return res.status(400).json({
        mensaje: "Nombre, apellido y DNI son obligatorios"
      });
    }

    // 2️⃣ Verificar duplicado de DNI
    const existe = await Huesped.findOne({ dni });

    if (existe) {
      return res.status(400).json({
        mensaje: "Ya existe un huésped con ese DNI"
      });
    }

    // 3️⃣ Crear huésped
    const nuevo = new Huesped({
      nombre,
      apellido,
      dni,
      telefono,
      email,
      observaciones,
      fechaPrimeraEstadia,
      fechaUltimaEstadia
    });

    await nuevo.save();

    return res.status(201).json(nuevo);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al crear huésped"
    });
  }
};

// 🔹 Obtener todos los huéspedes
exports.getHuespedes = async (req, res) => {
  try {
    const huespedes = await Huesped.find();
    return res.status(200).json(huespedes);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener huéspedes"
    });
  }
};

// 🔹 Obtener huésped por ID
exports.getHuespedById = async (req, res) => {
  try {
    const { id } = req.params;

    const huesped = await Huesped.findById(id);

    if (!huesped) {
      return res.status(404).json({
        mensaje: "Huésped no encontrado"
      });
    }

    return res.status(200).json(huesped);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener huésped"
    });
  }
};

// 🔹 Actualizar huésped
exports.updateHuesped = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre,
      apellido,
      dni
    } = req.body;

    const huesped = await Huesped.findById(id);

    if (!huesped) {
      return res.status(404).json({
        mensaje: "Huésped no encontrado"
      });
    }

    // 1️⃣ Validar DNI duplicado si se cambia
    if (dni && dni !== huesped.dni) {
      const existe = await Huesped.findOne({ dni });

      if (existe) {
        return res.status(400).json({
          mensaje: "Ya existe otro huésped con ese DNI"
        });
      }
    }

    // 2️⃣ Actualizar campos
    huesped.nombre = nombre ?? huesped.nombre;
    huesped.apellido = apellido ?? huesped.apellido;
    huesped.dni = dni ?? huesped.dni;

    Object.assign(huesped, req.body);

    await huesped.save();

    return res.status(200).json(huesped);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar huésped"
    });
  }
};

// 🔹 Eliminar huésped
exports.deleteHuesped = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await Huesped.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({
        mensaje: "Huésped no encontrado"
      });
    }

    return res.status(200).json({
      mensaje: "Huésped eliminado correctamente"
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al eliminar huésped"
    });
  }
};