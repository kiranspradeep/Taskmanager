const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");

// Routes
const authRoutes = require("./routes/authRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const taskRoutes = require("./routes/taskRoutes.js");
const progressRoutes = require("./routes/progressRoutes.js");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/progress", progressRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
