import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [users, setUsers] = useState([]);
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg]     = useState("");

  const load = async () => {
    try {
      const r = await fetch(API + "/users");
      setUsers(await r.json());
    } catch {
      setMsg("No se pudo conectar con el servidor");
    }
  };

  const add = async (e) => {
    e.preventDefault();
    const r = await fetch(API + "/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = await r.json();
    if (data.error) { setMsg("Error: " + data.error); return; }
    setName(""); setEmail(""); setMsg("Usuario agregado correctamente");
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "40px auto", padding: "0 20px" }}>
      <h2>CRUD Usuarios - Docker USAC 2026</h2>

      <form onSubmit={add} style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: "6px 10px", flex: 1 }}
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "6px 10px", flex: 1 }}
        />
        <button type="submit" style={{ padding: "6px 16px", background: "#0ea5e9", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
          Agregar
        </button>
      </form>

      {msg && <p style={{ color: msg.startsWith("Error") ? "red" : "green" }}>{msg}</p>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f1f5f9" }}>
            <th style={{ padding: 8, textAlign: "left", border: "1px solid #e2e8f0" }}>ID</th>
            <th style={{ padding: 8, textAlign: "left", border: "1px solid #e2e8f0" }}>Nombre</th>
            <th style={{ padding: 8, textAlign: "left", border: "1px solid #e2e8f0" }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={{ padding: 8, border: "1px solid #e2e8f0" }}>{u.id}</td>
              <td style={{ padding: 8, border: "1px solid #e2e8f0" }}>{u.name}</td>
              <td style={{ padding: 8, border: "1px solid #e2e8f0" }}>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <p style={{ color: "#94a3b8", textAlign: "center" }}>Sin usuarios aun. Agrega uno arriba.</p>
      )}
    </div>
  );
}