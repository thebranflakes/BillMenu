require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());

// 🔹 CORS Setup
const corsOptions = {
  origin: ["https://billsmenu-9031464cc2b6.herokuapp.com", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// 🔹 MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database!");
});

// 🔹 Admin Login Route
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;

  db.query("SELECT password FROM bb_admin_users LIMIT 1", async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(401).json({ message: "No admin user found!" });

    const storedHashedPassword = results[0].password;
    const isMatch = await bcrypt.compare(password, storedHashedPassword);

    isMatch
      ? res.json({ message: "Login successful!" })
      : res.status(401).json({ message: "Incorrect password!" });
  });
});

// 🔹 API Routes
const apiRoutes = [
  { path: "/api/bagels", query: "SELECT * FROM bb_bagels WHERE visible = 1" },
  { path: "/api/cream_cheese", query: "SELECT * FROM bb_cream_cheese WHERE visible = 1" },
  { path: "/api/toppings", query: "SELECT * FROM bb_toppings WHERE visible = 1" },
  { path: "/api/breakfast_sandwiches", query: "SELECT * FROM bb_breakfast_sandwiches WHERE visible = 1" },
  { path: "/api/meats", query: "SELECT * FROM bb_meats WHERE visible = 1" },
  { path: "/api/cheeses", query: "SELECT * FROM bb_cheeses WHERE visible = 1" },
  { path: "/api/extras", query: "SELECT * FROM bb_extras WHERE visible = 1" },
  { path: "/api/bagel_prices", query: "SELECT * FROM bb_bagel_prices WHERE visible = 1" },
];

// 🔹 Generate API endpoints dynamically
apiRoutes.forEach(({ path, query }) => {
  app.get(path, (req, res) => {
    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json(results);
    });
  });
});

// 🔹 Get Premium Sandwiches (Includes Options)
app.get("/api/premium_sandwiches", (req, res) => {
  const querySandwiches = "SELECT * FROM bb_premium_sandwiches WHERE visible = 1";
  const queryOptions = "SELECT * FROM bb_premium_sandwich_options WHERE visible = 1";

  db.query(querySandwiches, (err, sandwiches) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    db.query(queryOptions, (err, options) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      const sandwichesWithOptions = sandwiches.map(sandwich => ({
        ...sandwich,
        options: options.filter(option => option.sandwich_id === sandwich.id),
      }));

      res.json(sandwichesWithOptions);
    });
  });
});

// 🔹 Serve React Frontend in Production
// Serve React Frontend in Production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
