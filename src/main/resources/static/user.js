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
    /*document.getElementById('update-profile-btn').addEventListener('click', () => {
        const updatedDetails = document.getElementById('profile-details').value;
        console.log('Updated details:', updatedDetails);
        alert('Profile updated successfully');
        loadProfile(); // Перезагрузка профиля
    });*/

    // Обновление деталей профиля пользователя
    document.getElementById('edit-profile-btn').addEventListener('click', () => {
        const updatedDetails = document.getElementById('profile-details').value;

        // Регулярное выражение для проверки формата телефона: +7 *** *** ** **
        const phoneRegex = /^\+7 \d{3} \d{3} \d{2} \d{2}$/;

        // Проверяем соответствие ввода формату
        if (!phoneRegex.test(updatedDetails)) {
            showNotification("Please enter a valid phone number in the format: +7 *** *** ** **", "error");
            return;
        }

        fetch(`/api/user-profile/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ details: updatedDetails })
        })
        .then(response => {
            if (response.ok) {
                showNotification("Details updated successfully!", "success");
            } else {
                showNotification("Failed to update details!", "error");
            }
        })
        .catch(error => console.error('Error updating details:', error));
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

            showNotification("Balance topped up successfully!", "success");

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
        const userId = sessionStorage.getItem('userId'); // Получаем ID пользователя

        fetch('/api/user-profile/' + userId) // Проверяем профиль пользователя
            .then(response => response.json())
            .then(profile => {
                const details = profile.details;

                // Если в профиле указано "No number", блокируем подписку
                if (details === 'No number') {
                    showNotification('Add your phone number to subscribe!', 'error');
                }

                fetch('/api/tariffs') // Загружаем тарифы
                    .then(response => response.json())
                    .then(tariffs => {
                        const list = document.getElementById('tariffs-list');
                        list.innerHTML = '';

                        tariffs.forEach(tariff => {
                            const li = document.createElement('li');
                            li.textContent = `${tariff.name} - $${tariff.price}`;

                            const button = document.createElement('button');
                            button.textContent = 'Subscribe';

                            fetch(`/api/tariffs/active/${userId}`) // Проверка подписки
                                .then(response => {
                                    if (response.status === 204 || response.headers.get("content-length") === "0") {
                                        return null; // Нет активной подписки
                                    }
                                    return response.json(); // Преобразуем в JSON
                                })
                                .then(activeTariff => {
                                    // Если активная подписка уже есть
                                    if (activeTariff) {
                                        if (activeTariff.id === tariff.id) {
                                            button.textContent = 'Contact support to unsubscribe';
                                            button.disabled = true; // Блокируем кнопку
                                        } else {
                                            button.disabled = true; // Блокируем все остальные тарифы
                                        }
                                    }

                                    // Если у пользователя "No number", блокируем все кнопки
                                    if (details === 'No number') {
                                        button.disabled = true;
                                    } else {
                                        // Добавляем обработчик только если кнопка активна
                                        if (!button.disabled) {
                                            button.addEventListener('click', () =>
                                                subscribeTariff(userId, tariff.id, tariff.price));
                                        }
                                    }
                                })
                                .catch(error => console.error('Error checking active tariff:', error));

                            li.appendChild(button);
                            list.appendChild(li);
                        });
                    })
                    .catch(error => console.error('Error loading tariffs:', error));
            })
            .catch(error => console.error('Error loading profile:', error));
    }

    // Подписка на тарифы
    function subscribeTariff(userId, tariffId, price) {
        fetch(`/api/user-profile/${userId}`) // Проверяем баланс
            .then(response => response.json())
            .then(profile => {
                if (profile.details === 'No number') {
                    showNotification('Add your phone number to subscribe!', 'error');
                    return; // Блокируем подписку
                }

                if (profile.balance < price) {
                    showNotification('Insufficient balance!', 'error');
                    return;
                }

                fetch(`/api/tariffs/assign/${userId}/${tariffId}`, { method: 'POST' }) // Подписываемся
                    .then(() => {
                        showNotification('Subscribed successfully!', 'success');
                        loadProfile();  // Обновляем профиль
                        loadTariffs();  // Обновляем список тарифов (блокируем кнопки)
                    })
                    .catch(error => console.error('Error subscribing:', error));
            })
            .catch(error => console.error('Error checking profile:', error));
    }

    // Загрузка методов оплаты, привязанных к пользователю
    function loadPaymentMethods() {
        const userId = sessionStorage.getItem('userId'); // ID пользователя

        fetch(`/api/payment-methods/user/${userId}`) // Запрос привязанных методов
            .then(response => response.json())
            .then(methods => {
                const select = document.getElementById('payment-method'); // Выпадающий список
                select.innerHTML = ''; // Очистка данных

                if (methods.length === 0) {
                    const option = document.createElement('option');
                    option.textContent = 'No payment methods available';
                    select.appendChild(option);
                    return;
                }

                methods.forEach(method => {
                    const option = document.createElement('option');
                    option.value = method.id; // Устанавливаем ID в качестве значения
                    option.textContent = `${method.id} - ${method.name}`; // ID и имя в списке
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