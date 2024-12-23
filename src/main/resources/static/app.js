const API_BASE_URL = 'http://localhost:8080/api';

// Авторизация
document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                sessionStorage.setItem('userId', data.id);
                loadProfile(data.id);
            } else {
                document.getElementById('login-status').textContent = 'Invalid login';
            }
        });
});

// Загрузка профиля
function loadProfile(userId) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('profile-section').style.display = 'block';
    document.getElementById('tariffs-section').style.display = 'block';
    document.getElementById('payments-section').style.display = 'block';

    fetch(`${API_BASE_URL}/user-profile/${userId}`)
        .then(response => response.json())
        .then(profile => {
            document.getElementById('user-info').textContent = `Balance: $${profile.balance}`;
        });

    loadTariffs();
    loadPayments(userId);
}

// Загрузка тарифов
function loadTariffs() {
    fetch(`${API_BASE_URL}/tariffs`)
        .then(response => response.json())
        .then(tariffs => {
            const list = document.getElementById('tariffs-list');
            list.innerHTML = '';
            tariffs.forEach(tariff => {
                const li = document.createElement('li');
                li.textContent = `${tariff.name} - $${tariff.price}`;
                list.appendChild(li);
            });
        });
}

// Загрузка платежей
function loadPayments(userId) {
    fetch(`${API_BASE_URL}/payments/history/${userId}`)
        .then(response => response.json())
        .then(payments => {
            const list = document.getElementById('payment-history');
            list.innerHTML = '';
            payments.forEach(payment => {
                const li = document.createElement('li');
                li.textContent = `Amount: $${payment.amount} - Status: ${payment.status}`;
                list.appendChild(li);
            });
        });
}

// Выход
document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('userId');
    location.reload();
});