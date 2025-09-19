const express =require( "express");
const cors =require( "cors");
const dotenv =require( "dotenv");
const connectDB =require( "./config/db.js");
const authRoutes =require( "./routes/authRoutes.js");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
