require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));

// 🔹 Connect to MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) console.error("Database connection failed:", err);
  else console.log("✅ Connected to MySQL Database!");
});

// 🔹 Admin Login Route
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;

  db.query("SELECT password FROM bb_admin_users LIMIT 1", async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(401).json({ message: "No admin user found!" });

    const storedHashedPassword = results[0].password;
    const isMatch = await bcrypt.compare(password, storedHashedPassword);

    if (isMatch) {
      res.json({ message: "Login successful!" });
    } else {
      res.status(401).json({ message: "Incorrect password!" });
    }
  });
});





// 🔹 Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
