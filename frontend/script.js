const username = localStorage.getItem('username');
const userId = localStorage.getItem('userId');
if (!username) {
  window.location.href = 'login.html';
}

const socket = io('http://localhost:3000', { query: { userId } });

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
    div.classList.add(msg.remetenteId == userId ? 'enviada' : 'recebida');
    div.innerHTML = `<p>${msg.conteudo}</p><small>${formatarHora(msg.dataHora)}</small>`;
    mensagensEl.appendChild(div);
  });
  mensagensEl.scrollTop = mensagensEl.scrollHeight;
}

if (destinatarioInput && abrirChatBtn) {
  destinatarioInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      abrirChatBtn.click();
    }
  });
}

socket.on('usuariosOnline', (usuarios) => {
  if (!usuariosEl) return;
  usuariosEl.innerHTML = '';
  usuarios.forEach(u => {
    if (u.id != userId) {
      const li = document.createElement('li');
      li.textContent = u.nome;
      li.onclick = () => selecionarUsuario(u);
      usuariosEl.appendChild(li);
    }
  });
});

function selecionarUsuario(usuario) {
  usuarioAtual = usuario;
  if (chatHeader) chatHeader.textContent = `Conversando com ${usuario.nome}`;
  mensagens = [];
  renderizarMensagens();
}

if (abrirChatBtn) {
  abrirChatBtn.addEventListener('click', () => {
    const nome = destinatarioInput.value.trim();
    if (!nome) return alert('Digite o nome do usuário!');
    selecionarUsuario({ nome, id: null }); 
    destinatarioInput.value = '';
  });
}

function enviarMensagem() {
  const texto = inputEl.value.trim();
  if (!texto || !usuarioAtual || !usuarioAtual.id) return;

  const novaMsg = {
    remetenteId: userId,
    destinatarioId: usuarioAtual.id,
    conteudo: texto,
    dataHora: new Date().toISOString()
  };

  socket.emit('enviarMensagem', novaMsg);
  mensagens.push(novaMsg);
  renderizarMensagens();
  inputEl.value = '';
}

if (inputEl) {
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      enviarMensagem();
    }
  });
}
if (btnEnviar) btnEnviar.addEventListener('click', enviarMensagem);

socket.on('novaMensagem', (msg) => {
  if (usuarioAtual && (msg.remetenteId == usuarioAtual.id || msg.destinatarioId == usuarioAtual.id)) {
    mensagens.push(msg);
    renderizarMensagens();
  }
});

function formatarHora(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function destacarUsuario(nome) {
  if (!usuariosEl) return;
  const itens = usuariosEl.querySelectorAll('li');
  itens.forEach(li => {
    if (li.textContent.includes(nome)) li.style.fontWeight = 'bold';
  });
}

window.onload = function() {
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const imagem = localStorage.getItem('imagem');
  if (username && email && imagem) {
    document.getElementById('welcomeMessage').innerText = `Bem-vindo, ${username}!`;
    const imgElement = document.getElementById('userImage');
    if(imgElement) imgElement.src = imagem;
  } else {
    window.location.href = 'login.html';
  }
};
