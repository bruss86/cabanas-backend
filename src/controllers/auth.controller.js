const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================
// 🟢 REGISTER
// =========================
exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // validar si existe usuario
    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    // encriptar password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // crear usuario
    const user = new User({
      nombre,
      email,
      password: passwordHash
    });

    await user.save();

    res.status(201).json({
      mensaje: "Usuario creado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error en registro",
      error: error.message
    });
  }
};

// =========================
// 🔵 LOGIN
// =========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    // validar password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });
    }

    // generar token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error en login",
      error: error.message
    });
  }
};