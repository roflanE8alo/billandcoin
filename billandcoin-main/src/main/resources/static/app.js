async function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = { username, passwordHash: password };

    const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    if (response.ok) {
        alert('User registered successfully');
        loadUsers();
    } else {
        alert('Error registering user');
    }
}

async function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = { username, passwordHash: password };

    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    const message = await response.text();
    if (message === 'Login successful') {
        window.location.href = '/success.html';
    } else {
        alert(message);
    }
}

async function loadUsers() {
    const response = await fetch('/api/users');
    const users = await response.json();

    const usersList = document.getElementById('usersList');
    if (usersList) {
        usersList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `ID: ${user.id}, Username: ${user.username}`;
            usersList.appendChild(li);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});