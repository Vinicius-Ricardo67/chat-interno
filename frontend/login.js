document.getElementById('loginBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    if (!username) return alert("Digite seu nome!");

    localStorage.setItem('username', username);
    window.location.href = "index.html";
});