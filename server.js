require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken"); 
const cookieParser = require("cookie-parser");


const app = express();
app.use(express.json());
app.use(cookieParser());


// 🔹 CORS Setup
const corsOptions = {
  origin: ["https://billsmenu-9031464cc2b6.herokuapp.com", "http://localhost:3000"],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
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
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  db.query("SELECT password FROM bb_admin_users LIMIT 1", async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(401).json({ message: "No admin user found!" });

    const storedHashedPassword = results[0].password;
    const isMatch = await bcrypt.compare(password, storedHashedPassword);

    if (isMatch) {
      // Generate JWT Token
      const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: "30d" });

      // Set token in HTTP-Only Cookie
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Ensure secure flag is only set in production
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({ message: "Login successful!" });
    } else {
      res.status(401).json({ message: "Incorrect password!" });
    }
  });
});

app.post("/api/admin/logout", (req, res) => {
  // Destroy session if using express-session
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      
      // Clear the authentication cookie
      res.clearCookie("adminToken", {
        httpOnly: true, // Ensure it matches how it was set
        secure: process.env.NODE_ENV === "production", // Secure only in production
        sameSite: "strict",
        path: "/",
      });

      return res.json({ message: "Logged out successfully" });
    });
  } else {
    // If no session, still clear the cookie
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    
    res.json({ message: "Logged out successfully" });
  }
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
  { path: "/api/bagel_prices", query: "SELECT * FROM bb_bagel_prices" },
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

const verifyAdmin = (req, res, next) => {
  console.log("🔹 Checking admin token...");
  console.log("🔹 Request Headers:", req.headers);
  console.log("🔹 Request Cookies:", req.cookies);

  const token = req.cookies.adminToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
      console.log("❌ No token found!");
      return res.status(403).json({ message: "Forbidden: No token provided" });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = decoded;
      console.log("✅ Token verified!");
      next();
  } catch (error) {
      console.error("❌ Token verification failed:", error);
      return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

app.get("/api/admin/check", (req, res) => {
  const token = req.cookies.adminToken;
  if (!token) return res.status(403).json({ message: "Not authenticated" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: "Authenticated" });
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
});

//////////////////////////////////////////
// Admin Bagel Requests
/////////////////////////////////////////

app.get("/api/admin/bagels", (req, res) => {
  console.log("Fetching all bagels for admin..."); // Debugging line
  db.query("SELECT * FROM bb_bagels", (err, results) => {
    if (err) {
      console.error("Database error:", err); // Debugging line
      return res.status(500).json({ message: "Database error", error: err });
    }
    console.log("Bagels fetched:", results); // Debugging line
    res.json(results);
  });
});

// Protect routes
app.patch("/api/bagels/:id/stock", verifyAdmin, (req, res) => {
  const bagelId = req.params.id;
  const { stock } = req.body; // Expecting stock as 1 or 0

  db.query(
    "UPDATE bb_bagels SET stock = ? WHERE id = ?",
    [stock, bagelId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json({ id: bagelId, stock });
    }
  );
});

app.patch("/api/bagels/:id/visibility", verifyAdmin, (req, res) => {
  const bagelId = req.params.id;
  const { visible } = req.body;

  db.query(
    "UPDATE bb_bagels SET visible = ? WHERE id = ?",
    [visible, bagelId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json({ id: bagelId, visible });
    }
  );
});

app.delete("/api/bagels/:id/delete", verifyAdmin, (req, res) => {
  const bagelId = req.params.id;

  db.query("DELETE FROM bb_bagels WHERE id = ?", [bagelId], (err, result) => {
    if (err) {
      console.error("Error deleting bagel:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Bagel not found" });
    }

    res.json({ message: "Bagel deleted successfully", id: bagelId });
  });
});

////////////////////////////////////////////////////
// Admin Cream Cheese Requests
////////////////////////////////////////////////////

app.get("/api/admin/cream_cheese", verifyAdmin, (req, res) => {
  db.query("SELECT * FROM bb_cream_cheese", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json(results);
  });
});

// 🟢 Toggle Visibility of Cream Cheese
app.patch("/api/cream_cheese/:id/visibility", verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { visible } = req.body;

  db.query(
    "UPDATE bb_cream_cheese SET visible = ? WHERE id = ?",
    [visible, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.json({ id, visible });
    }
  );
});

app.patch("/api/cream_cheese/:id/stock", verifyAdmin, (req, res) => {
  const cheeseId = req.params.id;
  const { stock } = req.body; // Expecting stock as 1 or 0

  db.query(
    "UPDATE bb_cream_cheese SET stock = ? WHERE id = ?",
    [stock, cheeseId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json({ id: cheeseId, stock });
    }
  );
});

// 💲 Update Cream Cheese Price
app.patch("/api/cream_cheese/:id/price", verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  db.query(
    "UPDATE bb_cream_cheese SET price = ? WHERE id = ?",
    [price, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.json({ id, price });
    }
  );
});

// 🗑️ Delete a Cream Cheese
app.delete("/api/cream_cheese/:id/delete", verifyAdmin, (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM bb_cream_cheese WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json({ message: "Cream cheese deleted successfully!" });
  });
});

////////////////////////////////
// Admin Topping Requests
////////////////////////////////

// 🟢 Fetch all toppings (including hidden ones)
app.get("/api/admin/toppings", verifyAdmin, (req, res) => {
  db.query("SELECT * FROM bb_toppings", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json(results);
  });
});

// 👀 Toggle visibility of a topping
app.patch("/api/toppings/:id/visibility", verifyAdmin, (req, res) => {
  const toppingId = req.params.id;
  const { visible } = req.body;

  db.query(
    "UPDATE bb_toppings SET visible = ? WHERE id = ?",
    [visible, toppingId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.json({ id: toppingId, visible });
    }
  );
});

// 🔄 Toggle in-stock / out-of-stock
app.patch("/api/toppings/:id/stock", verifyAdmin, (req, res) => {
  const toppingId = req.params.id;
  const { stock } = req.body;

  db.query(
    "UPDATE bb_toppings SET stock = ? WHERE id = ?",
    [stock, toppingId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.json({ id: toppingId, stock });
    }
  );
});

// 🗑️ Delete a topping
app.delete("/api/toppings/:id/delete", verifyAdmin, (req, res) => {
  const toppingId = req.params.id;

  db.query("DELETE FROM bb_toppings WHERE id = ?", [toppingId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json({ message: "Topping deleted successfully", id: toppingId });
  });
});

//////////////////////////
//Admin Breakfast Sandwich Requests
//////////////////////////

// 🥪 Fetch all breakfast sandwiches (including hidden ones)
app.get("/api/admin/breakfast_sandwiches", verifyAdmin, (req, res) => {
  db.query("SELECT * FROM bb_breakfast_sandwiches", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json(results);
  });
});

// 👀 Toggle visibility of a breakfast sandwich
app.patch("/api/breakfast_sandwiches/:id/visibility", verifyAdmin, (req, res) => {
  const sandwichId = req.params.id;
  const { visible } = req.body;

  db.query(
    "UPDATE bb_breakfast_sandwiches SET visible = ? WHERE id = ?",
    [visible, sandwichId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.json({ id: sandwichId, visible });
    }
  );
});

// 🔄 Toggle in-stock / out-of-stock
app.patch("/api/breakfast_sandwiches/:id/stock", verifyAdmin, (req, res) => {
  const sandwichId = req.params.id;
  const { stock } = req.body;

  db.query(
    "UPDATE bb_breakfast_sandwiches SET stock = ? WHERE id = ?",
    [stock, sandwichId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.json({ id: sandwichId, stock });
    }
  );
});

// 🗑️ Delete a breakfast sandwich
app.delete("/api/breakfast_sandwiches/:id/delete", verifyAdmin, (req, res) => {
  const sandwichId = req.params.id;

  db.query("DELETE FROM bb_breakfast_sandwiches WHERE id = ?", [sandwichId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json({ message: "Breakfast sandwich deleted successfully", id: sandwichId });
  });
});

//////////////////////////
//Admin Meats Requests
//////////////////////////

app.get("/api/admin/meats", verifyAdmin, (req, res) => {
  db.query("SELECT * FROM bb_meats", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

app.patch("/api/meats/:id/visibility", verifyAdmin, (req, res) => {
  const meatId = req.params.id;
  const { visible } = req.body;

  db.query("UPDATE bb_meats SET visible = ? WHERE id = ?", [visible, meatId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ id: meatId, visible });
  });
});

app.patch("/api/meats/:id/stock", verifyAdmin, (req, res) => {
  const meatId = req.params.id;
  const { stock } = req.body;

  db.query("UPDATE bb_meats SET stock = ? WHERE id = ?", [stock, meatId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ id: meatId, stock });
  });
});

app.delete("/api/meats/:id/delete", verifyAdmin, (req, res) => {
  const meatId = req.params.id;

  db.query("DELETE FROM bb_meats WHERE id = ?", [meatId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "Meat item deleted successfully", id: meatId });
  });
});


//////////////////////////
//Admin Cheeses Requests
//////////////////////////

app.get("/api/admin/cheeses", verifyAdmin, (req, res) => {
  db.query("SELECT * FROM bb_cheeses", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

app.patch("/api/cheeses/:id/visibility", verifyAdmin, (req, res) => {
  const cheeseId = req.params.id;
  const { visible } = req.body;

  db.query("UPDATE bb_cheeses SET visible = ? WHERE id = ?", [visible, cheeseId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ id: cheeseId, visible });
  });
});


app.patch("/api/cheeses/:id/stock", verifyAdmin, (req, res) => {
  const cheeseId = req.params.id;
  const { stock } = req.body;

  db.query("UPDATE bb_cheeses SET stock = ? WHERE id = ?", [stock, cheeseId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ id: cheeseId, stock });
  });
});

app.delete("/api/cheeses/:id/delete", verifyAdmin, (req, res) => {
  const cheeseId = req.params.id;

  db.query("DELETE FROM bb_cheeses WHERE id = ?", [cheeseId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "Cheese item deleted successfully", id: cheeseId });
  });
});

/////////////////////////////////
// Admin Extras Requests
/////////////////////////////////

// 🟢 Fetch All Extras (including hidden ones for Admin Panel)
app.get("/api/admin/extras", verifyAdmin, (req, res) => {
  db.query("SELECT * FROM bb_extras", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

// 🔄 Toggle Visibility (Show/Hide an Extra)
app.patch("/api/extras/:id/visibility", verifyAdmin, (req, res) => {
  const extraId = req.params.id;
  const { visible } = req.body;

  db.query("UPDATE bb_extras SET visible = ? WHERE id = ?", [visible, extraId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ id: extraId, visible });
  });
});

// 🛒 Toggle Stock (In Stock / Out of Stock)
app.patch("/api/extras/:id/stock", verifyAdmin, (req, res) => {
  const extraId = req.params.id;
  const { stock } = req.body;

  db.query("UPDATE bb_extras SET stock = ? WHERE id = ?", [stock, extraId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ id: extraId, stock });
  });
});

// ❌ Delete an Extra Item
app.delete("/api/extras/:id/delete", verifyAdmin, (req, res) => {
  const extraId = req.params.id;

  db.query("DELETE FROM bb_extras WHERE id = ?", [extraId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "Extra deleted successfully!", id: extraId });
  });
});

///////////////////////////////
// Admin Premium Sandwiches Requests
///////////////////////////////

// 🥪 Get all premium sandwiches (including hidden)
app.get("/api/admin/premium_sandwiches", verifyAdmin, (req, res) => {
  db.query("SELECT * FROM bb_premium_sandwiches", (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json(results);
  });
});

// 🥪 Toggle visibility
app.patch("/api/premium_sandwiches/:id/visibility", verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { visible } = req.body;

  db.query(
    "UPDATE bb_premium_sandwiches SET visible = ? WHERE id = ?",
    [visible, id],
    (err) => {
      if (err) {
        console.error("Error updating visibility:", err);
        return res.status(500).json({ message: "Error updating visibility" });
      }
      res.json({ id, visible });
    }
  );
});

// 🥪 Toggle in-stock status
app.patch("/api/premium_sandwiches/:id/stock", verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  db.query(
    "UPDATE bb_premium_sandwiches SET stock = ? WHERE id = ?",
    [stock, id],
    (err) => {
      if (err) {
        console.error("Error updating stock:", err);
        return res.status(500).json({ message: "Error updating stock" });
      }
      res.json({ id, stock });
    }
  );
});


// 🗑️ Delete a premium sandwich and its associated options
app.delete("/api/premium_sandwiches/:id/delete", verifyAdmin, (req, res) => {
  const { id } = req.params;

  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction error:", err);
      return res.status(500).json({ message: "Transaction error", error: err });
    }

    // First, delete associated premium sandwich options
    db.query("DELETE FROM bb_premium_sandwich_options WHERE sandwich_id = ?", [id], (err) => {
      if (err) {
        console.error("Error deleting sandwich options:", err);
        return db.rollback(() => {
          res.status(500).json({ message: "Error deleting sandwich options" });
        });
      }

      // Then, delete the premium sandwich
      db.query("DELETE FROM bb_premium_sandwiches WHERE id = ?", [id], (err) => {
        if (err) {
          console.error("Error deleting premium sandwich:", err);
          return db.rollback(() => {
            res.status(500).json({ message: "Error deleting premium sandwich" });
          });
        }

        db.commit((err) => {
          if (err) {
            console.error("Commit error:", err);
            return db.rollback(() => {
              res.status(500).json({ message: "Commit error" });
            });
          }

          res.json({ message: "Premium sandwich and associated options deleted", id });
        });
      });
    });
  });
});

////////////////////////////////////
// Admin Pemium Sandwich Options Requests
////////////////////////////////////

// 🔹 Fetch all premium sandwich options with sandwich names
app.get("/api/admin/premium_sandwich_options", verifyAdmin, (req, res) => {
  const query = `
    SELECT o.id, o.sandwich_id, o.type, o.price, o.visible, s.name AS sandwich_name
    FROM bb_premium_sandwich_options o
    JOIN bb_premium_sandwiches s ON o.sandwich_id = s.id
    ORDER BY s.name, o.type;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching premium sandwich options:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.json(results);
  });
});

app.patch("/api/premium_sandwich_options/:id/visibility", verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { visible } = req.body;

  db.query(
    "UPDATE bb_premium_sandwich_options SET visible = ? WHERE id = ?",
    [visible, id],
    (err) => {
      if (err) {
        console.error("❌ Error updating visibility:", err);
        return res.status(500).json({ message: "Error updating visibility" });
      }
      res.json({ id, visible });
    }
  );
});

app.delete("/api/premium_sandwich_options/:id/delete", async (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM bb_premium_sandwich_options WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "Premium Sandwich Option deleted successfully!", id: id });
  });
});


/////////////////////////////////
// Add Item Requests
/////////////////////////////////
const addItemToDatabase = (table, columns, values, res) => {
  const placeholders = values.map(() => "?").join(", ");
  const sql = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(`Error adding item to ${table}:`, err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json({ message: "Item added successfully", id: result.insertId });
  });
};

// 🥯 Add a new Bagel
app.post("/api/bagels/add", verifyAdmin, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });
  addItemToDatabase("bb_bagels", ["name"], [name], res);
});

// 🧀 Add a new Cream Cheese
app.post("/api/cream_cheese/add", verifyAdmin, (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).json({ message: "Name and price are required" });
  addItemToDatabase("bb_cream_cheese", ["name", "price"], [name, price], res);
});

// 🍅 Add a new Topping
app.post("/api/toppings/add", verifyAdmin, (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).json({ message: "Name and price are required" });
  addItemToDatabase("bb_toppings", ["name", "price"], [name, price], res);
});

// 🍳 Add a new Breakfast Sandwich
app.post("/api/breakfast_sandwiches/add", verifyAdmin, (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).json({ message: "Name and price are required" });
  addItemToDatabase("bb_breakfast_sandwiches", ["name", "price"], [name, price], res);
});

// 🥩 Add a new Meat
app.post("/api/meats/add", verifyAdmin, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });
  addItemToDatabase("bb_meats", ["name"], [name], res);
});

// 🧀 Add a new Cheese
app.post("/api/cheeses/add", verifyAdmin, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });
  addItemToDatabase("bb_cheeses", ["name"], [name], res);
});

// 🥑 Add a new Extra
app.post("/api/extras/add", verifyAdmin, (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).json({ message: "Name and price are required" });
  addItemToDatabase("bb_extras", ["name", "price"], [name, price], res);
});

// 🥪 Add a new Premium Sandwich
app.post("/api/premium_sandwiches/add", verifyAdmin, (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) return res.status(400).json({ message: "Name and description are required" });
  addItemToDatabase("bb_premium_sandwiches", ["name", "description"], [name, description], res);
});

// 🥪➕ Add a new Premium Sandwich Option
app.post("/api/premium_sandwich_options/add", verifyAdmin, (req, res) => {
  const { sandwich_id, type, price } = req.body;
  if (!sandwich_id || !type || !price) return res.status(400).json({ message: "All fields are required" });
  addItemToDatabase("bb_premium_sandwich_options", ["sandwich_id", "type", "price"], [sandwich_id, type, price], res);
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
