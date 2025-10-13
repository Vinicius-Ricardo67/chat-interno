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

loginBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  const senha = senhaInput.value.trim();
  const email = emailInput.value.trim();
  const imagem = previewImg.src || 'default.png';

  if (!username || !senha || !email) {
    alert('Preencha todos os campos obrigatórios!');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, senha, email, imagem })
    });

    const data = await res.json();

    if (res.ok) {
      // Salva os dados no localStorage
      localStorage.setItem('username', data.username);
      localStorage.setItem('email', data.email);
      localStorage.setItem('imagem', data.imagem);

      window.location.href = 'index.html';
    } else {
      alert(data.erro || 'Erro ao registrar usuário.');
    }
  } catch (err) {
    console.error('Erro no cadastro/login:', err);
    alert('Erro de conexão com o servidor.');
  }
});
<<<<<<< HEAD
=======
  fetch('http://localhost:3000/cadastrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, senha, email, imagem })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem('username', username);
      window.location.href = 'index.html';
    } else {
      alert('Erro: ' + data.message);
    }
  })
  .catch(err => alert('Erro: ' + err.message));
});
>>>>>>> 769b2b97ae960c73f0d9b96dcada0f3849a1318a
