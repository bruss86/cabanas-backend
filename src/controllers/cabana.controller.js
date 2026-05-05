const Cabana = require("../models/Cabana");

// 🔹 Crear cabaña
exports.createCabana = async (req, res) => {
  try {
    const { nombre, capacidadMaxima, descripcion } = req.body;

    if (!nombre || !capacidadMaxima) {
      return res.status(400).json({
        mensaje: "Nombre y capacidad máxima son obligatorios"
      });
    }

    const nuevaCabana = new Cabana({
      nombre,
      capacidadMaxima,
      descripcion
    });

    await nuevaCabana.save();

    return res.status(201).json(nuevaCabana);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al crear cabaña"
    });
  }
};

// 🔹 Obtener todas las cabañas
exports.getCabanas = async (req, res) => {
  try {
    const cabanas = await Cabana.find();
    return res.status(200).json(cabanas);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener cabañas"
    });
  }
};

// 🔹 Obtener una cabaña por ID
exports.getCabanaById = async (req, res) => {
  try {
    const { id } = req.params;

    const cabana = await Cabana.findById(id);

    if (!cabana) {
      return res.status(404).json({
        mensaje: "Cabaña no encontrada"
      });
    }

    return res.status(200).json(cabana);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener la cabaña"
    });
  }
};

// 🔹 Actualizar cabaña
exports.updateCabana = async (req, res) => {
  try {
    const { id } = req.params;

    const cabanaActualizada = await Cabana.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!cabanaActualizada) {
      return res.status(404).json({
        mensaje: "Cabaña no encontrada"
      });
    }

    return res.status(200).json(cabanaActualizada);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar cabaña"
    });
  }
};

// 🔹 Eliminar cabaña
exports.deleteCabana = async (req, res) => {
  try {
    const { id } = req.params;

    const cabanaEliminada = await Cabana.findByIdAndDelete(id);

    if (!cabanaEliminada) {
      return res.status(404).json({
        mensaje: "Cabaña no encontrada"
      });
    }

    return res.status(200).json({
      mensaje: "Cabaña eliminada correctamente"
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al eliminar cabaña"
    });
  }
};