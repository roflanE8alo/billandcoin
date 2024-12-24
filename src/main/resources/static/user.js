document.addEventListener('DOMContentLoaded', () => {
    const userId = sessionStorage.getItem('userId'); // Получаем сохраненный ID пользователя

    if (!userId) {
        alert('User not logged in!');
        window.location.href = 'auth.html';
        return;
    }

    // Загрузка профиля
    fetch(`/api/user-profile/${userId}`)
        .then(response => response.json())
        .then(profile => {
            document.getElementById('username').textContent = profile.user.username;
            document.getElementById('balance').textContent = `$${profile.balance.toFixed(2)}`;
            document.getElementById('profile-details').value = profile.details;
        })
        .catch(error => console.error('Error loading profile:', error));

    function loadProfile() {
        const userId = sessionStorage.getItem('userId'); // Получаем ID пользователя из сессии

        if (!userId) {
            alert('User not logged in!');
            window.location.href = 'auth.html'; // Перенаправляем на страницу входа
            return;
        }

        fetch(`/api/user-profile/${userId}`) // Запрашиваем данные профиля с сервера
            .then(response => response.json())
            .then(profile => {
                // Обновляем интерфейс с данными профиля
                document.getElementById('username').textContent = profile.user.username;
                document.getElementById('balance').textContent = `$${profile.balance.toFixed(2)}`;
                document.getElementById('profile-details').value = profile.details;
            })
            .catch(error => {
                console.error('Error loading profile:', error);
                alert('Failed to load profile');
            });
    }

    // Обновление профиля пользователя
    document.getElementById('update-profile-btn').addEventListener('click', () => {
        const updatedDetails = document.getElementById('profile-details').value;
        console.log('Updated details:', updatedDetails);
        alert('Profile updated successfully');
        loadProfile(); // Перезагрузка профиля
    });

    // Пополнение баланса
    document.getElementById('top-up-btn').addEventListener('click', async () => {
        const userId = parseInt(sessionStorage.getItem('userId')); // Преобразуем userId в число
        const amount = parseFloat(document.getElementById('top-up-amount').value); // Преобразуем amount в число
        const methodId = parseInt(document.getElementById('payment-method').value); // Преобразуем methodId в число

        if (isNaN(userId) || isNaN(amount) || amount <= 0 || isNaN(methodId)) {
            alert('Enter valid data!');
            return;
        }

        try {
            const response = await fetch('/api/user-profile/top-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, methodId, amount }) // Все данные теперь числа
            });

            const result = await response.text();
            alert(result);
            loadProfile(); // Обновляем профиль
        } catch (error) {
            console.error('Top-up error:', error);
            alert('Failed to top up balance!');
        }
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
        fetch('/api/payment-methods') // Новый эндпоинт на сервере
            .then(response => response.json())
            .then(methods => {
                const select = document.getElementById('payment-method');
                select.innerHTML = ''; // Очистка старых данных
                methods.forEach(method => {
                    const option = document.createElement('option');
                    option.value = method.id;
                    option.textContent = method.name;
                    select.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error loading payment methods:', error);
                alert('Failed to load payment methods!');
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