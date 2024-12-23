document.addEventListener('DOMContentLoaded', () => {
    let userId;

    // Получение текущего пользователя
    function fetchCurrentUser() {
        console.log('Fetching current user...'); // Лог начала запроса
        const username = localStorage.getItem('username'); // Получаем username из localStorage

        if (!username) {
        console.log('Username not found in localStorage. Redirecting to auth.html.');
        window.location.href = 'auth.html';
        return;
        }

        fetch('http://localhost:8080/api/users/current?username=' + encodeURIComponent(username))
            .then(response => {
                console.log('Response status:', response.status); // Лог статуса ответа

                if (!response.ok) {
                    console.log('Redirecting to auth.html due to authentication failure.');
                    window.location.href = 'auth.html';
                }
                return response.json();
            })
            .then(user => {
                console.log('User data received:', user); // Лог данных пользователя

                if (!user || !user.id) {
                    console.log('Invalid user data. Redirecting...');
                    window.location.href = 'auth.html';
                } else {
                    userId = user.id;
                    console.log('User ID loaded:', userId); // Лог ID пользователя
                    loadProfile();
                    loadTariffs();
                    loadPayments();
                    loadPaymentMethods(); // Загрузить методы оплаты
                }
            })
            .catch(error => {
                console.error('Error fetching current user:', error);
                alert('Authentication required!');
                window.location.href = 'auth.html';
            });
    }

    // Загрузка профиля пользователя
    function loadProfile() {
        fetch('http://localhost:8080/api/user-profile/' + userId)
            .then(response => {
                console.log('Profile response status:', response.status); // Лог статуса ответа
                if (!response.ok) {
                    throw new Error('Failed to load profile');
                }
                return response.json();
            })
            .then(profile => {
                console.log('Profile data:', profile); // Лог полученных данных
                document.getElementById('username').textContent = profile.user.username; // Доступ к user.username
                document.getElementById('balance').textContent = `$${profile.balance.toFixed(2)}`; // Баланс с 2 знаками
                document.getElementById('profile-details').value = profile.details || 'No details provided'; // Проверка на null
            })
            .catch(error => {
                console.error('Error loading profile:', error);
                alert('Failed to load profile!');
            });
    }

    // Обновление профиля пользователя
    document.getElementById('update-profile-btn').addEventListener('click', () => {
        if (!userId) {
            alert('User ID not loaded. Please try again.');
            return;
        }
        const updatedDetails = document.getElementById('profile-details').value;
        fetch('http://localhost:8080/api/user-profile/update/' + userId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: { id: userId },
                balance: parseFloat(document.getElementById('balance').textContent.replace('$', '')), // сохраняем текущий баланс
                details: updatedDetails
            })
        })
        .then(response => {
            if (response.ok) {
                alert('Profile updated successfully');
                loadProfile(); // Перезагрузить профиль
            } else {
                alert('Failed to update profile');
            }
        });
    });

    // Пополнение баланса
    document.getElementById('top-up-btn').addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('top-up-amount').value);
        const methodId = parseInt(document.getElementById('payment-method').value);

        console.log('Top-up initiated. Amount:', amount, 'Method ID:', methodId); // Лог введенных данных

        if (isNaN(amount) || amount <= 0) {
            alert('Enter a valid amount!');
            return;
        }

        fetch('http://localhost:8080/api/user-profile/top-up', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: { id: userId }, // Проверка ID пользователя
                paymentMethod: { id: methodId }, // Проверка ID метода
                amount: amount,
                status: 'completed'
            })
        })
        .then(response => {
            console.log('Top-up response status:', response.status); // Лог ответа
            return response.text();
        })
        .then(message => {
            console.log('Top-up result:', message); // Лог сообщения
            alert(message);
            loadProfile();
            loadPayments();
        })
        .catch(error => {
            console.error('Top-up error:', error);
            alert('Failed to top-up balance');
        });
    });

    // Загрузка тарифов
    function loadTariffs() {
        fetch('http://localhost:8080/api/tariffs')
            .then(response => response.json())
            .then(tariffs => {
                const list = document.getElementById('tariffs-list');
                list.innerHTML = '';
                tariffs.forEach(tariff => {
                    const li = document.createElement('li');
                    li.textContent = `ID: ${tariff.id} - ${tariff.name} - $${tariff.price}`;
                    list.appendChild(li);
                });
            })
            .catch(() => alert('Failed to load tariffs'));
    }

    function loadPaymentMethods() {
        console.log('Loading payment methods...'); // Лог начала запроса

        fetch('http://localhost:8080/api/payment-methods') // Запрос к контроллеру
            .then(response => {
                console.log('Payment methods response status:', response.status); // Лог статуса ответа
                if (!response.ok) throw new Error('Failed to load payment methods');
                return response.json();
            })
            .then(methods => {
                console.log('Payment methods loaded:', methods); // Лог полученных методов
                const select = document.getElementById('payment-method');
                select.innerHTML = ''; // Очистить существующие опции
                methods.forEach(method => {
                    const option = document.createElement('option');
                    option.value = method.id; // ID метода оплаты
                    option.textContent = method.name; // Название метода
                    select.appendChild(option); // Добавить в выпадающий список
                });
            })
            .catch(error => {
                console.error('Error loading payment methods:', error);
                alert('Failed to load payment methods!');
            });
    }

    // Загрузка истории платежей
    function loadPayments() {
        fetch('http://localhost:8080/api/payments/history/' + userId)
            .then(response => response.json())
            .then(payments => {
                const list = document.getElementById('payments-list');
                list.innerHTML = '';
                payments.forEach(payment => {
                    const li = document.createElement('li');
                    li.textContent = `ID: ${payment.id} - Amount: $${payment.amount} - Status: ${payment.status}`;
                    list.appendChild(li);
                });
            })
            .catch(() => alert('Failed to load payments'));
    }

    // Инициализация
    fetchCurrentUser();
});