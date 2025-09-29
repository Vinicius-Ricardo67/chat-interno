const socket = io('https://localhost:1717', {
    auth: {
        token
    }
});

const token = localStorage.getItem('token');
const userId = parseInt(localStorage.getItem('userId'));

const usuariosEl = document.getElementById('usuariosOnline');
const mensagensEl = document.getElementById('chatMensagens');
const inputEl = document.getElementById('mensagemInput');
const btnEnviar = document.getElementById('enviarBtn');
const chatHeader = document.getElementById('chatHeader');

let usuarioAtual = null;
let mensagens = [];

async function carregarUsuarios() {
  const usuarios = await getUsuarios(token);
  usuariosEl.innerHTML = '';
  usuarios.forEach(u => {
    if (u.id !== userId) {
      const li = document.createElement('li');
      li.textContent = `${u.nome} ${u.statusOnline ? '🟢' : '⚪️'}`;
      li.onclick = () => selecionarUsuario(u);
      usuariosEl.appendChild(li);
    }
  });
}

async function selecionarUsuario(usuario) {
  usuarioAtual = usuario;
  chatHeader.textContent = `Conversando com ${usuario.nome}`;
  mensagens = await getMensagens(usuario.id, token);
  renderizarMensagens();
}

function renderizarMensagens() {
  mensagensEl.innerHTML = '';
  mensagens.forEach(msg => {
    const div = document.createElement('div');
    div.classList.add('msg');
    div.classList.add(msg.remetenteId === userId ? 'enviada' : 'recebida');
    div.innerHTML = `<p>${msg.conteudo}</p><small>${formatarHora(msg.dataHora)}</small>`;
    mensagensEl.appendChild(div);
  });
  mensagensEl.scrollTop = mensagensEl.scrollHeight;
}

btnEnviar.addEventListener('click', async () => {
  const texto = inputEl.value.trim();
  if (!texto || !usuarioAtual) return;

  const novaMsg = {
    destinatarioId: usuarioAtual.id,
    conteudo: texto,
    dataHora: new Date().toISOString(),
};

socket.emit('mensagem', novaMsg);

await enviarMensagem(novaMsg, token)

mensagens.push({ ...novaMsg, remetenteId: userId });
renderizarMensagens();
inputEl.value = '';
});

socket.on('mensagem', (msg) => {
    if (usuarioAtual && msg.remetenteId === usuarioAtual.id) {
        mensagens.push(msg);
        renderizarMensagens();
    } else {
        destacarUsuario(msg.remetenteId);
    }
});

function formatarHora(iso) {
  const d = new Date(iso);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

carregarUsuarios();