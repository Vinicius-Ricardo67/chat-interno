const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');

app.post('/usuarios', (req, res) => { 
  const { username, senha, email, imagem } = req.body;
const usernameInput = document.getElementById('username');
const senhaInput = document.getElementById('senha');
const emailInput = document.getElementById('email');
const imagemInput = document.getElementById('imagem');
const previewImg = document.getElementById('previewImg');
const loginBtn = document.getElementById('loginBtn');

imagemInput.addEventListener('change', () => {
  const file = imagemInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => previewImg.src = e.target.result;
  reader.readAsDataURL(file);
});

loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  const senha = senhaInput.value.trim();
  const email = emailInput.value.trim();
  const imagem = previewImg.src || 'default.png';

  if (!username || !senha || !email) {
    return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
  }

  let data = { usuarios: [] };
  if (fs.existsSync(dataPath)) {
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    data = JSON.parse(fileContent); 
  }

  const existe = data.usuarios.find(u => u.username === username || u.email === email);
  if (existe) {
    return res.status(400).json({ erro: 'Usuário ou email já cadastrado.' });
  }

  const novoUsuario = { username, senha, email, imagem };
  data.usuarios.push(novoUsuario);

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  return res.status(201).json(novoUsuario);
  // Salva os dados no localStorage
  localStorage.setItem('username', username);
  localStorage.setItem('email', email);
  localStorage.setItem('imagem', imagem);

  window.location.href = 'index.html';
});   
});   