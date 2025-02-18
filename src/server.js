require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const corsOptions = {
  origin: ["https://billsmenu-9031464cc2b6.herokuapp.com", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
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

app.get("/api/bagels", (req, res) => {
  db.query("SELECT * FROM bb_bagels WHERE visible = 1", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

// Get All Cream Cheese & More
app.get("/api/cream_cheese", (req, res) => {
  db.query("SELECT * FROM bb_cream_cheese WHERE visible = 1", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

// Get All Toppings
app.get("/api/toppings", (req, res) => {
  db.query("SELECT * FROM bb_toppings", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

// Get All Breakfast Sandwiches
app.get("/api/breakfast_sandwiches", (req, res) => {
  db.query("SELECT * FROM bb_breakfast_sandwiches WHERE visible = 1", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});


// Get All Meats
app.get("/api/meats", (req, res) => {
  db.query("SELECT * FROM bb_meats WHERE visible = 1", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

// Get All Cheeses
app.get("/api/cheeses", (req, res) => {
  db.query("SELECT * FROM bb_cheeses WHERE visible = 1", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

app.get("/api/premium_sandwiches", (req, res) => {
  const querySandwiches = "SELECT * FROM bb_premium_sandwiches WHERE visible = 1";
  const queryOptions = "SELECT * FROM bb_premium_sandwich_options WHERE visible = 1";

  db.query(querySandwiches, (err, sandwiches) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    db.query(queryOptions, (err, options) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      // Merge sandwiches with their options
      const sandwichesWithOptions = sandwiches.map(sandwich => {
        return {
          ...sandwich,
          options: options.filter(option => option.sandwich_id === sandwich.id),
        };
      });

      res.json(sandwichesWithOptions);
    });
  });
});

// Get All Extras
app.get("/api/extras", (req, res) => {
  db.query("SELECT * FROM bb_extras WHERE visible = 1", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

// Get All Bagel Prices
app.get("/api/bagel_prices", (req, res) => {
  db.query("SELECT * FROM bb_bagel_prices WHERE visible = 1", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});





// 🔹 Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
