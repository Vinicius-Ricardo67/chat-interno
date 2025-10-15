const { query } = require("mssql");

const usuario = JSON.parse(localStorage.getItem('usuario'));

if (!usuario || !usuario.username) {
  window.location.href = 'login.html';
}

const username = usuario.username;
const email = usuario.email;
const imagem = usuario.imagem;

const socket = io('http://localhost:3000', { query: { username } });

const usuariosEl = document.getElementById('usuarios');
const mensagensEl = document.getElementById('mensagens');
const inputEl = document.getElementById('inputMensagem');
const btnEnviar = document.getElementById('btnEnviar');
const chatHeader = document.getElementById('chatHeader');
const destinatarioInput = document.getElementById('destinatarioInput');
const abrirChatBtn = document.getElementById('abrirChatBtn');

let usuarioAtual = null;
let mensagens = [];

function renderizarUsuarios(usuarios) {
  mensagensEl.innerHTML = '';
  mensagens.forEach(msg => {
    const div = document.createElement('div');
    div.classList.add('msg')
    div.classList.add(msg.remetente === username ? 'enviada' : 'recebida');
    div.innerHTML = `<p>${msg.conteudo}</p><small>${formatarHora(msg.dataHora)}</small>`;
    mensagensEl.appendChild(div);
  });
  mensagensEl.scrollTop = mensagensEl.scrollHeight;
}