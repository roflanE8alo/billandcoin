document.addEventListener('DOMContentLoaded', () => {
    let userId = 1; // Фиксированный ID пользователя для демонстрации

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

    // Загрузка методов оплаты
    function loadPaymentMethods() {
        const userId = sessionStorage.getItem('userId'); // ID пользователя

        fetch(`/api/payment-methods/user/${userId}`)
            .then(response => response.json())
            .then(methods => {
                const list = document.getElementById('methods-list');
                list.innerHTML = ''; // Очистка списка

                if (methods.length === 0) {
                    list.innerHTML = '<li>No payment methods available</li>';
                    return;
                }

                methods.forEach(method => {
                    const li = document.createElement('li');
                    li.textContent = `${method.name} - ${method.description}`;
                    list.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error loading payment methods:', error);
                alert('Failed to load payment methods!');
            });
    }

    // Добавить удаление метода оплаты
    window.deletePaymentMethod = function(methodId) {
        fetch(`/api/payment-methods/${methodId}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    showNotification("Payment method deleted successfully!", "success");
                    loadPaymentMethods(); // Обновить список
                } else {
                    showNotification("Failed to delete payment method!", "error");
                }
            })
            .catch(error => {
                console.error('Error deleting payment method:', error);
                showNotification('Error deleting payment method!', "error");
            });
    };

    // Обновление загрузки методов с кнопкой удаления
    function loadPaymentMethods() {
        const userId = sessionStorage.getItem('userId'); // Получаем ID пользователя

        fetch(`/api/payment-methods/user/${userId}`)
            .then(response => response.json())
            .then(methods => {
                const list = document.getElementById('methods-list');
                list.innerHTML = ''; // Очищаем список

                if (methods.length === 0) {
                    list.innerHTML = '<li>No payment methods available</li>';
                    return;
                }

                methods.forEach(method => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        ID: ${method.id} - ${method.name} - ${method.description}
                        <button onclick="deletePaymentMethod(${method.id})">Delete</button>
                    `;
                    list.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error loading payment methods:', error);
                alert('Failed to load payment methods!');
            });
    }

    // Добавление нового метода оплаты с проверкой
    document.getElementById('add-method-btn').addEventListener('click', () => {
        const methodName = document.getElementById('new-method-select').value;
        const methodDesc = document.getElementById('new-method-desc').value;

        // Проверка формата карты: **** **** **** **** **/** ***
        const cardRegex = /^\d{4} \d{4} \d{4} \d{4} (0[1-9]|1[0-2])\/\d{2} \d{3}$/;

        if (!cardRegex.test(methodDesc)) {
            showNotification("Invalid card format! Use **** **** **** **** MM/YY CVV", "error");
            return;
        }

        const userId = sessionStorage.getItem('userId'); // ID пользователя

        fetch(`/api/payment-methods/user/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: methodName, description: methodDesc })
        })
        .then(response => response.json())
        .then(data => {
            showNotification("Payment method added successfully!", "success");
            loadPaymentMethods(); // Перезагрузка списка
        })
        .catch(error => {
            console.error('Error adding payment method:', error);
            showNotification('Failed to add payment method!', "error");
        });
    });

    // Выбор метода оплаты для подписки
    function selectPaymentMethod(methodId) {
        alert(`Payment method ${methodId} selected!`);
        window.location.href = 'user.html';
    }

    // Кнопка возврата на страницу user.html
    document.getElementById('back-to-user-btn').addEventListener('click', () => {
        window.location.href = 'user.html'; // Переход на страницу пользователя
    });

    // Инициализация
    loadPaymentMethods();
});