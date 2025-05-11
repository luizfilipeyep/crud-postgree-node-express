require("dotenv").config()
const express = require("express")
const { Pool } = require("pg")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

// Configurar pool de conexão com PostgreSQL
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT,
// })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Rota para listar usuários
app.get("/users", async (req, res) => {  
  let SQL = "SELECT * FROM users"

  try {
    const result = await pool.query(SQL)
    res.json(result.rows)
    console.log("<GET/users>: Todos usuários listados")
  } catch (err) {
    console.error(err)
    res.status(500).send("Erro no servidor")
  }
})

// Criar um usuário
app.post("/users", async (req, res) => {
  const { name, email } = req.body

  let SQL = "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *"

  try {
    const result = await pool.query(SQL, [name, email])
    res.json(result.rows[0])
    console.log(`<POST/users>: Usuário ${name} criado`)
  } catch (err) {
    console.error(err)
    res.status(500).send("Erro ao criar usuário")
  }
})

// Atualizar um usuário
app.put("/users/:id", async (req, res) => {
  const { id } = req.params
  const { name, email } = req.body
  try {
    const result = await pool.query(
      "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *",
      [name, email, id]
    )
    res.json(result.rows[0])
    console.log(`<PUT/users>: Usuário com id: ${id} modificado.`)
  } catch (err) {
    console.error(err)
    res.status(500).send("Erro ao atualizar usuário")
  }
})

// Deletar um usuário
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id=$1", [id]);
    res.send("Usuário removido");
    console.log(`<DELETE/users>: Usuário com id: ${id} removido.`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao remover usuário");
  }
});

app.get('/', (req, res) => {
  res.json({message: 'Servidor Funcionando'})
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
