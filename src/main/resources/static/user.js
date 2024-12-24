document.addEventListener('DOMContentLoaded', () => {
    let userId = 1; // Фиксированный ID пользователя для демонстрации

    // Загрузка профиля пользователя
    function loadProfile() {
        console.log('Loading profile...');
        const profile = {
            user: { username: 'demo_user' },
            balance: 100.00,
            details: 'Demo profile details'
        };
        console.log('Profile data:', profile);
        document.getElementById('username').textContent = profile.user.username;
        document.getElementById('balance').textContent = `$${profile.balance.toFixed(2)}`;
        document.getElementById('profile-details').value = profile.details;
    }

    // Обновление профиля пользователя
    document.getElementById('update-profile-btn').addEventListener('click', () => {
        const updatedDetails = document.getElementById('profile-details').value;
        console.log('Updated details:', updatedDetails);
        alert('Profile updated successfully');
        loadProfile(); // Перезагрузка профиля
    });

    // Пополнение баланса
    document.getElementById('top-up-btn').addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('top-up-amount').value);
        const methodId = parseInt(document.getElementById('payment-method').value);

        console.log('Top-up initiated. Amount:', amount, 'Method ID:', methodId);
        if (isNaN(amount) || amount <= 0) {
            alert('Enter a valid amount!');
            return;
        }
        alert('Balance topped up successfully');
        loadProfile();
    });

    // Загрузка тарифов
    function loadTariffs() {
        console.log('Loading tariffs...');
        const tariffs = [
            { id: 2, name: 'Standard', price: 10.00 },
            { id: 3, name: 'Premium', price: 20.00 },
            { id: 4, name: 'Gold', price: 30.00 }
        ];
        const list = document.getElementById('tariffs-list');
        list.innerHTML = '';
        tariffs.forEach(tariff => {
            const li = document.createElement('li');
            li.textContent = `ID: ${tariff.id} - ${tariff.name} - $${tariff.price}`;
            const button = document.createElement('button');
            button.textContent = 'Subscribe';
            button.addEventListener('click', () => {
                sessionStorage.setItem('selectedTariffId', tariff.id);
                window.location.href = 'payment-methods.html';
            });
            li.appendChild(button);
            list.appendChild(li);
        });
    }

    // Загрузка методов оплаты
    function loadPaymentMethods() {
        console.log('Loading payment methods...');
        const methods = [
            { id: 1, name: 'Visa' },
            { id: 2, name: 'Mir' }
        ];
        const select = document.getElementById('payment-method');
        select.innerHTML = '';
        methods.forEach(method => {
            const option = document.createElement('option');
            option.value = method.id;
            option.textContent = method.name;
            select.appendChild(option);
        });
    }

    // Загрузка истории платежей
    function loadPayments() {
        console.log('Loading payments...');
        const payments = [
            { id: 1, amount: 100.00, status: 'completed' },
            { id: 2, amount: 50.00, status: 'completed' },
            { id: 3, amount: 50.00, status: 'completed' }
        ];
        const list = document.getElementById('payments-list');
        list.innerHTML = '';
        payments.forEach(payment => {
            const li = document.createElement('li');
            li.textContent = `ID: ${payment.id} - Amount: $${payment.amount} - Status: ${payment.status}`;
            list.appendChild(li);
        });
    }

    // Инициализация
    loadProfile();
    loadTariffs();
    loadPaymentMethods();
    loadPayments();
});