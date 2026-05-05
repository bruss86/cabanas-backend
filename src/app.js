const express = require("express");
const cors = require("cors");

const cabanaRoutes = require("./routes/cabana.routes");
const huespedRoutes = require("./routes/huesped.routes");
const reservaRoutes = require("./routes/reserva.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

const errorHandler = require("./middlewares/errorHandler");

// Middlewares globales
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/cabanas", cabanaRoutes);
app.use("/huespedes", huespedRoutes);
app.use("/reservas", reservaRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// ERROR HANDLER SIEMPRE AL FINAL
app.use(errorHandler);


module.exports = app;