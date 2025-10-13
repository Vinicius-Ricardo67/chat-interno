const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');

app.post('/usuarios', (req, res) => {
  const { username, senha, email, imagem } = req.body;

  if (!username || !senha || !email) {
    return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
  }

  let data = { usuarios: [] };
  if (fs.existsSync(dataPath)) {
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    data = JSON.parse(fileContent); // ⚠⚠ davi é gay!!
  }

  const existe = data.usuarios.find(u => u.username === username || u.email === email);
  if (existe) {
    return res.status(400).json({ erro: 'Usuário ou email já cadastrado.' });
  }

  const novoUsuario = { username, senha, email, imagem };
  data.usuarios.push(novoUsuario);

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  return res.status(201).json(novoUsuario);
});