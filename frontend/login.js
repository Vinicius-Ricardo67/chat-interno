document.getElementById('loginBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();

    if (!username) {
        alert("Digite um nome para entrar!");
    }
    
    localStorage.setItem('username', username);

    window.location.href = "index.html";
});