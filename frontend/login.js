document.getElementById('loginBtn').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await login(username, password);
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.userId);
        window.location.href = "index.html";
    } catch(e) {
        alert("erro ao logar: " + e.message);
    }
});