const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Caminho do arquivo JSON
const dataPath = path.join(__dirname, "data.json");

// Carrega os dados
function loadData() {
  const jsonData = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(jsonData);
}

// --- Rotas ---
router.get("/users", (req, res) => {
  const data = loadData();
  console.log("📂 Usuários carregados:", data.users);
  res.json(data.users);
});

router.get("/users/:nome", (req, res) => {
  const { nome } = req.params;
  const data = loadData();
  const user = data.users.find(u => u.nome.toLowerCase() === nome.toLowerCase());
  if (user) return res.json(user);
  res.status(404).json({ error: "Usuário não encontrado" });
});

console.log("teste")

module.exports = router;