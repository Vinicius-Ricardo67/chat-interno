const { catchError } = require("rxjs");

const cadastroBtn = document.getElementById('cadastroBtn');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const imagemInput = document.getElementById('imagemPerfil');
const irParaLogin = document.getElementById('irParaLogin');

cadastroBtn.addEventListener('click', async () => {
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();
    const arquivo = imagemInput.files[0];

    if (!nome || !email || !senha) return alert('Preencha todos os campos obrigatórios!');

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('email', email);
    formData.append('senha', senha);
    if(arquivo) {
        formData.append('imagem', arquivo);
    }

    try {
        const res = await fetch("http://localhost:3000/api/cadastro", {
            method: 'POST',
            body: formData
        });

        if (!res.ok) throw new Error('Erro ao cadastrar');

        const data = await res.json();
        alert('Cadastro realizado com sucesso');
        window.href = 'index.html';
    } catch (err) {
        alert('Erro: ' + err.message);
    }
});

irParaLogin.addEventListener('click', () => {
    window.location.href = 'login.html';
});