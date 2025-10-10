const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// --- Socket.IO setup ---
const io = new Server(server, {
  cors: {
    origin: "*", // coloque o domínio do seu front-end aqui em produção
    methods: ["GET", "POST"],
  },
});

// --- Lista de usuários conectados ---
let connectedUsers = new Map(); // socket.id -> { nome, email, ip }

// Função para obter IP real (mesmo atrás de proxy)
function getClientIP(socket) {
  const forwarded = socket.handshake.headers["x-forwarded-for"];
  const ip = forwarded ? forwarded.split(",")[0] : socket.handshake.address;
  return ip.replace(/^.*:/, ""); // remove "::ffff:" se existir
}

io.on("connection", (socket) => {
  const ip = getClientIP(socket);
  console.log(`🟢 Nova conexão: ${socket.id} (${ip})`);

  // Quando o cliente envia dados do usuário (ex: após login)
  socket.on("user_connected", (userData) => {
    connectedUsers.set(socket.id, { ...userData, ip });
    console.log(`Usuário conectado:`, userData);
    io.emit("users_online", Array.from(connectedUsers.values())); // atualiza lista no frontend
  });

  // Mensagem pública (enviada para todos)
  socket.on("chat_message", (msg) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      io.emit("chat_message", { user, msg, time: new Date() });
    }
  });

  // Mensagem privada
  socket.on("private_message", ({ toSocketId, msg }) => {
    const user = connectedUsers.get(socket.id);
    if (user && io.sockets.sockets.get(toSocketId)) {
      io.to(toSocketId).emit("private_message", { from: user, msg, time: new Date() });
    }
  });

  // Desconexão
  socket.on("disconnect", () => {
    const user = connectedUsers.get(socket.id);
    console.log(`🔴 Desconectado: ${user?.nome || "desconhecido"}`);
    connectedUsers.delete(socket.id);
    io.emit("users_online", Array.from(connectedUsers.values()));
  });
});

// --- Endpoint simples (teste de API) ---
app.get("/", (req, res) => {
  res.send("Servidor do chat está rodando ✅");
});

// --- Inicia o servidor ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
