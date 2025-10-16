const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Carrega os dados
const dataPath = path.join(__dirname, "../data.json");

// --- Funções auxiliares ---
function loadData() {
  const jsonData = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(jsonData);
}

// --- Rotas ---
function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

// --- Rotas ---

// ✅ Lista todos os usuários
router.get("/users", (req, res) => {
  const data = loadData();
  console.log("📂 Usuários carregados:", data.users);
  res.json(data.users);
});

// ✅ Busca um usuário específico
router.get("/users/:nome", (req, res) => {
  const { nome } = req.params;
  const data = loadData();
  const user = data.users.find(u => u.nome.toLowerCase() === nome.toLowerCase());
  if (user) return res.json(user);
  res.status(404).json({ error: "Usuário não encontrado" });
});


module.exports = router;
// ✅ Adiciona novo usuário
router.post("/users", (req, res) => {
  const { nome, email, senha, foto } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Campos obrigatórios: nome, email e senha" });
  }

  const data = loadData();

  // Verifica se já existe
  const existe = data.users.some(
    u => u.email === email || u.nome.toLowerCase() === nome.toLowerCase()
  );
  if (existe) {
    return res.status(400).json({ error: "Usuário já existe" });
  }

  // Cria o novo usuário
  const novoUsuario = {
    nome,
    email,
    senha,
    foto: foto || "foto_padrao.png",
  };

  data.users.push(novoUsuario);
  saveData(data);

  console.log("✅ Novo usuário cadastrado:", novoUsuario);

  res.status(201).json(novoUsuario);
});

module.exports = router;
