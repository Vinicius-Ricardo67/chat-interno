const username = localStorage.getItem('username');

if (!username) {
  window.location.href = 'login.html';
}

const socket = io('http://localhost:3000', { query: { username } });

const usuariosEl = document.getElementById('usuariosOnline');
const mensagensEl = document.getElementById('chatMensagens');
const inputEl = document.getElementById('mensagemInput');
const btnEnviar = document.getElementById('enviarBtn');
const chatHeader = document.getElementById('chatHeader');
const destinatarioInput = document.getElementById('destinatarioInput');
const abrirChatBtn = document.getElementById('abrirChatBtn');

let usuarioAtual = null;
let mensagens = [];

function renderizarMensagens() {
  mensagensEl.innerHTML = '';
  mensagens.forEach(msg => {
    const div = document.createElement('div');
    div.classList.add('msg');
    div.classList.add(msg.remetente === username ? 'enviada' : 'recebida');
    div.innerHTML = `<p>${msg.conteudo}</p><small>${formatarHora(msg.dataHora)}</small>`;
    mensagensEl.appendChild(div);
  });
  mensagensEl.scrollTop = mensagensEl.scrollHeight;
}

destinatarioInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') abrirChatBtn.click();
});

abrirChatBtn.addEventListener('click', () => {
  const nome = destinatarioInput.value.trim();
  if (!nome) return alert('Digite o nome do usuário!');
  if (!nome) return alert('Digite o nome do usuÃ¡rio!');
  usuarioAtual = nome;
  chatHeader.textContent = `Conversando com ${nome}`;
  mensagens = [];
  renderizarMensagens();
  destinatarioInput.value = '';
});

inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') enviarMensagem();
});

btnEnviar.addEventListener('click', enviarMensagem);

function enviarMensagem() {
  const texto = inputEl.value.trim();
  if (!texto || !usuarioAtual) return;

  const novaMsg = {
    remetente: username,
    destinatario: usuarioAtual,
    conteudo: texto,
    dataHora: new Date().toISOString()
  };

  socket.emit('mensagem', novaMsg);
  mensagens.push(novaMsg);
  renderizarMensagens();
  inputEl.value = '';
}

function formatarHora(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

window.onload = function() {
  const email = localStorage.getItem('email');
  const imagem = localStorage.getItem('imagem');
  if (username && email && imagem) {
    document.getElementById('welcomeMessage').innerText = `Bem-vindo, ${username}!`;
    document.getElementById('userImage').src = imagem;
  } else {
    window.location.href = 'login.html';
  }
};