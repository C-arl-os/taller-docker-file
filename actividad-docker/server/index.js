const express  = require("express");
const mysql    = require("mysql2/promise");
const cors     = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DB_HOST     = process.env.DB_HOST     || "db";
const DB_USER     = process.env.DB_USER     || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "root";
const DB_NAME     = process.env.DB_NAME     || "dockerdb";
const PORT        = process.env.PORT        || 5000;

async function getConn() {
  return mysql.createConnection({
    host: DB_HOST, user: DB_USER,
    password: DB_PASSWORD, database: DB_NAME
  });
}

async function waitForDB(retries = 20, delayMs = 2000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const c = await getConn();
      await c.execute("SELECT 1;");
      await c.end();
      console.log("MySQL listo");
      return;
    } catch {
      console.log("Esperando MySQL... " + i + "/" + retries);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error("MySQL no respondio");
}

async function initDB() {
  const c = await getConn();
  await c.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id    INT AUTO_INCREMENT PRIMARY KEY,
      name  VARCHAR(100) NOT NULL,
      email VARCHAR(120) NOT NULL UNIQUE
    );
  `);
  await c.end();
  console.log("Tabla users lista");
}

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.get("/users", async (_, res) => {
  const c = await getConn();
  const [rows] = await c.execute("SELECT id,name,email FROM users ORDER BY id;");
  await c.end();
  res.json(rows);
});

app.get("/users/:id", async (req, res) => {
  const c = await getConn();
  const [rows] = await c.execute("SELECT id,name,email FROM users WHERE id=?;", [req.params.id]);
  await c.end();
  if (!rows.length) return res.status(404).json({ error: "No encontrado" });
  res.json(rows[0]);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email)
    return res.status(400).json({ error: "name y email son requeridos" });
  try {
    const c = await getConn();
    const [r] = await c.execute("INSERT INTO users(name,email) VALUES(?,?)", [name, email]);
    await c.end();
    res.status(201).json({ id: r.insertId, name, email });
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) });
  }
});

app.put("/users/:id", async (req, res) => {
  const { name, email } = req.body || {};
  const c = await getConn();
  await c.execute("UPDATE users SET name=?,email=? WHERE id=?", [name, email, req.params.id]);
  await c.end();
  res.json({ mensaje: "Usuario actualizado" });
});

app.delete("/users/:id", async (req, res) => {
  const c = await getConn();
  await c.execute("DELETE FROM users WHERE id=?", [req.params.id]);
  await c.end();
  res.json({ mensaje: "Usuario eliminado" });
});

app.listen(PORT, async () => {
  console.log("Servidor corriendo en puerto " + PORT);
  await waitForDB();
  await initDB();
});