document.addEventListener('DOMContentLoaded', () => {
    const userId = sessionStorage.getItem('userId'); // Получаем сохраненный ID пользователя

    function showNotification(message, type = "info") {
        const container = document.getElementById("notification-container");

        const notification = document.createElement("div");
        notification.classList.add("notification", type);
        notification.textContent = message;

        container.appendChild(notification);

        // Автоматически скрыть уведомление через 3 секунды
        setTimeout(() => {
            notification.classList.add("fade-out");
            setTimeout(() => container.removeChild(notification), 500);
        }, 3000);
    }

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

    function addPaymentToHistory(payment) {
        const list = document.getElementById('payments-list');

        const li = document.createElement('li');
        li.textContent = `ID: ${payment.id} - Amount: $${payment.amount.toFixed(2)} - Status: ${payment.status}`;
        list.prepend(li); // Добавляем новый элемент в начало списка
    }

    // Пополнение баланса
    document.getElementById('top-up-btn').addEventListener('click', async () => {
        const userId = parseInt(sessionStorage.getItem('userId')); // Преобразуем в число
        const amount = parseFloat(document.getElementById('top-up-amount').value);
        const methodId = parseInt(document.getElementById('payment-method').value);

        if (isNaN(userId) || isNaN(amount) || amount <= 0 || isNaN(methodId)) {
            showNotification("Enter valid data!", "error");
            return;
        }
        if (amount < 0.01) {
            showNotification("Min top-up 1 cent!", "error");
            return;
        }

        try {
            const response = await fetch('/api/user-profile/top-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, methodId, amount })
            });

            if (!response.ok) {
                throw new Error('Failed to top up balance!');
            }

            alert('Balance topped up successfully');

            // Динамическое обновление профиля и истории платежей
            loadProfile(); // Обновляем профиль
            const payment = await response.json(); // Получаем данные о платеже из ответа
            addPaymentToHistory(payment); // Добавляем новый платеж в список
        } catch (error) {
            console.error('Top-up error:', error);
            alert('Failed to top up balance!');
        }
    });

    // Redirect to Add Payment Methods Page
    document.getElementById('add-payment-method-btn').addEventListener('click', () => {
        window.location.href = 'payment-methods.html'; // Update with the actual path to the "Add Payment Methods" page
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
        const userId = sessionStorage.getItem('userId'); // Получаем ID пользователя из сессии

        fetch(`/api/payments/history/${userId}`) // Запрос к API для получения истории платежей
            .then(response => response.json())
            .then(payments => {
                const list = document.getElementById('payments-list');
                list.innerHTML = ''; // Очищаем старый список

                if (payments.length === 0) {
                    list.innerHTML = '<li>No payments found</li>'; // Если история пуста
                    return;
                }

                payments.forEach(payment => {
                    const li = document.createElement('li');
                    li.textContent = `ID: ${payment.id} - Amount: $${payment.amount.toFixed(2)} - Status: ${payment.status}`;
                    list.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error loading payments:', error);
                alert('Failed to load payment history!');
            });
    }

    // Инициализация
    loadProfile();
    loadTariffs();
    loadPaymentMethods();
    loadPayments();
});