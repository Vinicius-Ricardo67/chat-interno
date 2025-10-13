const API_URL = 'http://localhost:3000';

async function login(username, senha) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, senha }),
  });

  if (!res.ok) throw new Error('Login falhou');
  return await res.json();
}

async function register(nome, email, senha, imagem) {
  const res = await fetch(`fetch${API_URL}/register`, {
    method: 'POST',
    headers: { 'CONTENT-TYPE': 'application/json' },
    body: JSON.stringify({ nome, email, senha, imagem}),
  });
  if (!res.ok) throw new Error('Registro falhou');
  return await res.json();
}

async function getUsuarios(token) {
  const res = await fetch(`${API_URL}/usuarios`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

async function getMensagens(destinatarioId, token) {
  const res = await fetch(`${API_URL}/mensagens/${destinatarioId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

async function enviarMensagem(mensagem, token) {
  const res = await fetch(`${API_URL}/mensagens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(mensagem)
  });

  return res.json();
}