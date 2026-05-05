const express = require("express");
const cors = require("cors");

const cabanaRoutes = require("./routes/cabana.routes");
const huespedRoutes = require("./routes/huesped.routes");
const reservaRoutes = require("./routes/reserva.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

const errorHandler = require("./middlewares/errorHandler");

// Middlewares globales
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "https://www.lasesmeraldasnono.com.ar",
  "https://lasesmeraldasnono.com.ar"
];

app.use(cors({
  origin: function (origin, callback) {
    // permitir requests sin origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("No permitido por CORS"));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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