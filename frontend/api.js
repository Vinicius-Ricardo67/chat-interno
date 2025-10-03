const API_URL = 'http://localhost:1717/api';

async function login(username, senha) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, senha }),
  });

  if (!res.ok) throw new Error('Login falhou');
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