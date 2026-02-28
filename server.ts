import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || "luxury_concept.db";
const db = new Database(dbPath);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    image_url TEXT,
    dimensions TEXT,
    materials TEXT,
    fabrics TEXT,
    additional_images TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_address TEXT,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: Add columns if they don't exist
const columns = [
  { table: "products", column: "fabrics", type: "TEXT" },
  { table: "products", column: "additional_images", type: "TEXT" },
  { table: "orders", column: "customer_phone", type: "TEXT" },
  { table: "orders", column: "customer_address", type: "TEXT" }
];

columns.forEach(({ table, column, type }) => {
  try {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
  } catch (e) { }
});

// Seed initial data if empty
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (productCount.count === 0) {
  const insertProduct = db.prepare("INSERT INTO products (name, description, price, category, image_url, dimensions, materials, fabrics, additional_images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  const initialProducts = [
    ["The Velvet Sovereign", "Deep emerald velvet sofa with gold-leaf accents.", 350000, "Living Room", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800", "220cm x 95cm x 85cm", "Velvet, Solid Oak, Gold Leaf", "Premium Italian Velvet", "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800"],
    ["Ethereal Oak Table", "Hand-carved solid white oak dining table.", 225000, "Dining Room", "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800", "240cm x 100cm x 75cm", "Solid White Oak", "N/A", "https://images.unsplash.com/photo-1530018607912-eff2df114f11?auto=format&fit=crop&q=80&w=800"],
    ["Celestial Lounge Chair", "Ergonomic lounge chair with premium Italian leather.", 185000, "Living Room", "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800", "85cm x 90cm x 100cm", "Italian Leather, Walnut Shell", "Top-grain Italian Leather", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800"],
    ["Marble Zenith Console", "Italian Carrara marble top with brushed brass base.", 145000, "Living Room", "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800", "140cm x 40cm x 80cm", "Carrara Marble, Brass", "N/A", "https://images.unsplash.com/photo-1538688598139-682181377e3c?auto=format&fit=crop&q=80&w=800"],
    ["Onyx Nightstand", "Minimalist nightstand with black marble and walnut.", 65000, "Bedroom", "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=800", "50cm x 45cm x 55cm", "Black Marble, Walnut Wood", "N/A", "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800"],
    ["Luminous Floor Lamp", "Sculptural floor lamp with hand-blown glass.", 85000, "Decor", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800", "40cm x 40cm x 160cm", "Hand-blown Glass, Steel", "N/A", "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800"],
    ["Executive Monarch Desk", "Grand mahogany desk with leather inlay.", 420000, "Office", "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800", "180cm x 90cm x 76cm", "Mahogany, Top-grain Leather", "Top-grain Leather Inlay", "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"],
    ["Zenith Office Chair", "High-back ergonomic chair with mesh and aluminum.", 120000, "Office", "https://images.unsplash.com/photo-1505797149-43b0ad766207?auto=format&fit=crop&q=80&w=800", "70cm x 70cm x 120cm", "Aluminum, Breathable Mesh", "High-performance Mesh", "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=800"],
    ["Aurelian Bed Frame", "King-size bed frame with brushed gold finish and velvet headboard.", 450000, "Bedroom", "https://images.unsplash.com/photo-1505693415958-4d5ec170653d?auto=format&fit=crop&q=80&w=800", "210cm x 200cm x 140cm", "Steel, Gold Plating, Velvet", "Plush Champagne Velvet", "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800"],
    ["Nordic Silence Sideboard", "Minimalist sideboard in light ash wood with brass handles.", 175000, "Living Room", "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800", "160cm x 45cm x 75cm", "Ash Wood, Brass", "N/A", "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&q=80&w=800"],
    ["Ivory Cloud Armchair", "Soft bouclé armchair with organic curves.", 95000, "Living Room", "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800", "90cm x 85cm x 80cm", "Bouclé Fabric, Pine Wood", "Premium White Bouclé", "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=800"],
    ["Obsidian Dining Chair", "Sleek black-stained ash dining chair with leather seat.", 45000, "Dining Room", "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800", "45cm x 50cm x 85cm", "Ash Wood, Leather", "Black Nappa Leather", "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800"],
    ["Quartz Coffee Table", "Solid quartz top with geometric steel base.", 115000, "Living Room", "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800", "100cm x 100cm x 35cm", "Quartz, Powder-coated Steel", "N/A", "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800"],
    ["Amber Glass Vase", "Hand-blown amber glass vase with textured finish.", 12000, "Decor", "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800", "20cm x 20cm x 35cm", "Hand-blown Glass", "N/A", "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800"]
  ];
  initialProducts.forEach(p => insertProduct.run(...p));
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Simple Admin Middleware
  const isAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const adminKey = req.headers["x-admin-key"];
    if (adminKey === "luxury-admin-2026") {
      next();
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  };

  // API Routes
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.post("/api/waitlist", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    try {
      db.prepare("INSERT INTO waitlist (email) VALUES (?)").run(email);
      res.status(201).json({ success: true });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).json({ error: "Email already exists" });
      }
      res.status(500).json({ error: "Failed to join waitlist" });
    }
  });

  app.get("/api/products/:id", (req, res) => {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  // Admin Routes
  app.post("/api/admin/products", isAdmin, (req, res) => {
    const { name, description, price, category, image_url, dimensions, materials, fabrics, additional_images } = req.body;
    try {
      const info = db.prepare("INSERT INTO products (name, description, price, category, image_url, dimensions, materials, fabrics, additional_images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .run(name, description, price, category, image_url, dimensions, materials, fabrics, additional_images);
      res.status(201).json({ id: info.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to add product" });
    }
  });

  app.put("/api/admin/products/:id", isAdmin, (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, image_url, dimensions, materials, fabrics, additional_images } = req.body;
    try {
      db.prepare("UPDATE products SET name = ?, description = ?, price = ?, category = ?, image_url = ?, dimensions = ?, materials = ?, fabrics = ?, additional_images = ? WHERE id = ?")
        .run(name, description, price, category, image_url, dimensions, materials, fabrics, additional_images, id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", isAdmin, (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM products WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.get("/api/admin/orders", isAdmin, (req, res) => {
    try {
      const orders = db.prepare(`
        SELECT o.*, GROUP_CONCAT(p.name || ' (x' || oi.quantity || ')') as items_summary
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `).all();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", (req, res) => {
    const { customer_name, customer_email, customer_phone, customer_address, items, total_amount } = req.body;

    const transaction = db.transaction(() => {
      const info = db.prepare("INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, total_amount) VALUES (?, ?, ?, ?, ?)").run(customer_name, customer_email, customer_phone, customer_address, total_amount);
      const orderId = info.lastInsertRowid;

      const insertItem = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
      for (const item of items) {
        insertItem.run(orderId, item.id, item.quantity, item.price);
      }
      return orderId;
    });

    try {
      const orderId = transaction();
      res.status(201).json({ success: true, orderId });
    } catch (error) {
      console.error("Order creation failed:", error);
      res.status(500).json({ success: false, error: "Failed to place order" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
