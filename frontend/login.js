const usernameInput = document.getElementById('username');
const senhaInput = document.getElementById('senha');
const emailInput = document.getElementById('email');
const loginBtn = document.getElementById('loginBtn');
const imagemInput = document.getElementById('imagem');
const previewImg = document.getElementById('previewImg');

imagemInput.addEventListener('change', () => {
  const file = imagemInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => previewImg.src = e.target.result;
  reader.readAsDataURL(file);
});

loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  const senha = senhaInput.value.trim();
  const email = emailInput.value.trim();
  const imagem = previewImg.src;

  if (!username || !senha || !email) {
    alert('Preencha todos os campos obrigatórios!');
    return;
  }

  fetch('http://localhost:3000/api/login', {
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
