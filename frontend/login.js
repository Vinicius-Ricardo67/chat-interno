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
    alert('Preencha todos os campos obrigatórios!');
    return;
  }

  // Salva os dados no localStorage
  localStorage.setItem('username', username);
  localStorage.setItem('email', email);
  localStorage.setItem('imagem', imagem);

  window.location.href = 'index.html';
});