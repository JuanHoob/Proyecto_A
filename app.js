import express from "express"
import getPool from "./getPool.js";
import { type } from "os";
const app=express();

const PORT = process.env.PORT || 3001;

// MIDDLEWARE
app.use(express.json());


// Leer los usuarios
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(500).send("Error en el servidor!");
    } else {
      res.status(200).json(results);
    }
  });
});

// Crear usuarios
app.post("/users", async(req, res) => {
  try {
    const { name } = req.body;
    const db=await getPool();
    await db.query(
      "INSERT INTO users (name) VALUES (?)",
      [name],
    );
    res.status(201).send("Usuario agregado");
  } catch (error) {
    console.log(error.message)
  }
    
});
// Actualizar
app.put("/users/:id", (req, res) => {
  const { name, subject, full_time } = req.body;
  const { id } = req.params;
  db.query(
    "UPDATE users SET name = ?, subject = ?, full_time = ? WHERE id = ?",
    [name, subject, full_time, id],
    (err, results) => {
      if (err) {
        res.status(500).send("Error al actualizar profesor");
      } else {
        res.send("Profesor actualizado");
      }
    }
  );
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).send("Error al eliminar usuario");
    } else {
      res.send("Usuario eliminado");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en ${PORT}/`);
});
