const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { sql, connectDB } = require("./db");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Conexão com o banco
connectDB();

// Rota simples
app.get("/", (req, res) => {
  res.send("💬 Chat interno rodando...");
});

// Socket.io para chat em tempo real
io.on("connection", (socket) => {
  console.log("🟢 Usuário conectado:", socket.id);

  // Receber mensagem e salvar no banco
  socket.on("enviarMensagem", async (msg) => {
    const { remetenteId, destinatarioId, conteudo } = msg;

    await sql.query`
      INSERT INTO mensagens (remetenteId, destinatarioId, conteudo)
      VALUES (${remetenteId}, ${destinatarioId}, ${conteudo})
    `;

    io.emit("novaMensagem", msg); // envia para todos
  });

  socket.on("disconnect", () => {
    console.log("🔴 Usuário desconectado:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
