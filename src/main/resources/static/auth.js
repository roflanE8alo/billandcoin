// Логин
document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password: password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                sessionStorage.setItem('userId', data.id);
                sessionStorage.setItem('role', data.role);
                redirectToRolePage(data.role);
            } else {
                document.getElementById('login-error').textContent = 'Invalid email or password';
            }
        });
});

// Регистрация
document.getElementById('register-btn').addEventListener('click', () => {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password: password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                sessionStorage.setItem('userId', data.id);
                sessionStorage.setItem('role', 'USER');
                window.location.href = 'index.html';
            } else {
                document.getElementById('register-error').textContent = 'Registration failed';
            }
        });
});

// Перенаправление по роли
function redirectToRolePage(role) {
    switch (role) {
        case 'ADMIN':
            window.location.href = 'admin.html';
            break;
        case 'SUPPORT':
            window.location.href = 'support.html';
            break;
        case 'USER':
            window.location.href = 'user.html';
            break;
        default:
            alert('Unknown role');
            window.location.href = 'auth.html';
    }
}
