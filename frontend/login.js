const imgInput = document.getElementById('imgInput');
const previewImg = document.getElementById('previewImg');
const form = document.getElementById('cadastroForm');

imgInput.addEventListener('change', () => {
  const file = imgInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => previewImg.src = e.target.result;
    reader.readAsDataURL(file);
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const imagem = imgInput.files[0] || null;

  if (!nome || !email || !senha) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('email', email);
  formData.append('senha', senha);
  if (imagem) formData.append('imagem', imagem);

  try {
    const res = await fetch('http://localhost:3000', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (res.ok) {
      alert('Cadastro realizado com sucesso!');
      window.location.href = 'index.html';
    } else {
      alert(`Erro: ${data.message || 'Falha ao cadastrar'}`);
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao conectar ao servidor.');
  }
});