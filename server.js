require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors")

const app = express();
app.use(cors())
app.use(express.json());

// Configurar pool de conexão com PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Rota de teste para listar dados
app.get("/users", async (req, res) => {  
  let SQL = "SELECT * FROM users;"

  try {
    const result = await pool.query(SQL);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

// Criar um usuário
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  let SQL = "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *"

  try {
    const result = await pool.query(SQL, [name, email]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao criar usuário");
  }
});

app.get('/', (req, res) => {
  res.json({message: 'Servidor Funcionando'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
