
const express = require("express")
const morgan = require("morgan");
const cors = require("cors");

// const authRoutes = require("./routes/")
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
// app.use("/api/auth", authRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

module.exports = app;