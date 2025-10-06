const username = localStorage.getItem('username');
if (!username) {
  window.location.href = 'login.html';
}

const socket = io('http://localhost:3000', {
  query: { username }
});

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
  mensagensEl.innerHTML = ''
  mensagens.forEach(msg => {
    const div = document.createElement('div');
    div.classList.add('msg');
    div.classList.add(msg.remetente === username ? 'enviada' : 'recebida');
    div.innerHTML = `
      <p>${msg.conteudo}</p>
      <small>${formatarHora(msg.dataHora)}</small>
    `;
    mensagensEl.appendChild(div);
  });
  mensagensEl.scrollTop = mensagensEl.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      enviarMensagem();
    }
  });

  destinatarioInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      abrirChatBtn.click();
    }
  });
});

socket.on('usuarios', (usuarios) => {
  usuariosEl.innerHTML = '';
  usuarios.forEach(u => {
    if (u !== username) {
      const li = document.createElement('li');
      li.textContent = u;
      li.onclick = () => selecionarUsuario(u);
      usuariosEl.appendChild(li);
    }
  });
});

function selecionarUsuario(nome) {
  usuarioAtual = nome;
  chatHeader.textContent = `Conversando com ${nome}`;
  mensagens = [];
  renderizarMensagens();
}

abrirChatBtn.addEventListener('click', () => {
  const nome = destinatarioInput.value.trim();
  if (!nome) return alert('Digite o nome do usuário!');
  selecionarUsuario(nome);
  destinatarioInput.value = '';
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

socket.on('mensagem', (msg) => {
  if (usuarioAtual && (msg.remetente === usuarioAtual || msg.destinatario === usuarioAtual)) {
    mensagens.push(msg);
    renderizarMensagens();
  } else {
    destacarUsuario(msg.remetente);
  }
});

function formatarHora(iso) {
  const d = new Date(iso);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function destacarUsuario(nome) {
  const itens = usuariosEl.querySelectorAll('li');
  itens.forEach(li => {
    if (li.textContent.includes(nome)) {
      li.style.fontWeight = 'bold';
    }
  });
}
