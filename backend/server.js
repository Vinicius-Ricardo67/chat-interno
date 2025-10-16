const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, "data.json");

function lerUsuarios() {
  if (!fs.existsSync(dataPath)) return { usuarios: [] };
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
}

function salvarUsuarios(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
  res.send("💬 Chat interno rodando...");
});

app.post("/usuarios", (req, res) => {
  const { username, senha, email, imagem } = req.body;

  if (!username || !senha || !email) {
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
  }

  const data = lerUsuarios();
  const existe = data.usuarios.find(
    (u) => u.username === username || u.email === email
  );

  if (existe) {
    return res.status(400).json({ erro: "Usuário ou email já cadastrado." });
  }

  const novoUsuario = { username, senha, email, imagem };
  data.usuarios.push(novoUsuario);
  salvarUsuarios(data);

  console.log(`✅ Novo usuário cadastrado: ${username}`);
  return res.status(201).json(novoUsuario);
});

app.get("/usuarios/:username", (req, res) => {
  const { username } = req.params;
  console.log(req.params, "ewasrtyukjhgfdsa")
  const data = lerUsuarios();

  const usuario = data.usuarios.find((u) => u.username === username);

  if (!usuario) {
    return res.status(404).json({ erro: "Usuário não encontrado." });
  }

  return res.json(usuario);
});

// Socket.io
let connectedUsers = new Map();

function getClientIP(socket) {
  const forwarded = socket.handshake.headers["x-forwarded-for"];
  const ip = forwarded ? forwarded.split(",")[0] : socket.handshake.address;
  return ip.replace(/^.*:/, "");
}

io.on("connection", (socket) => {
  const ip = getClientIP(socket);
  console.log(`🟢 Nova conexão: ${socket.id} (${ip})`);

  socket.on("user_connected", (userData) => {
    connectedUsers.set(socket.id, { ...userData, ip });
    console.log(`👤 Usuário conectado:`, userData);
    io.emit("users_online", Array.from(connectedUsers.values()));
  });

  socket.on("chat_message", (msg) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      io.emit("chat_message", { user, msg, time: new Date() });
    }
  });

  socket.on("private_message", ({ toSocketId, msg }) => {
    const user = connectedUsers.get(socket.id);
    if (user && io.sockets.sockets.get(toSocketId)) {
      io.to(toSocketId).emit("private_message", {
        from: user,
        msg,
        time: new Date(),
      });
    }
  });

  socket.on("enviarMensagem", (msg) => {
    console.log("📩 Nova mensagem recebida:", msg);
    io.emit("novaMensagem", msg);
  });

  socket.on("disconnect", () => {
    const user = connectedUsers.get(socket.id);
    console.log(`🔴 Desconectado: ${user?.nome || "desconhecido"}`);
    connectedUsers.delete(socket.id);
    io.emit("users_online", Array.from(connectedUsers.values()));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
