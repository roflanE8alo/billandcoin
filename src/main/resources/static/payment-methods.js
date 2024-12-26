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
        const userId = sessionStorage.getItem('userId');

        fetch(`/api/payment-methods/user/${userId}`)
            .then(response => response.json())
            .then(methods => {
                const list = document.getElementById('methods-list');
                list.innerHTML = '';

                if (methods.length === 0) {
                    list.innerHTML = '<li>No payment methods available</li>';
                    return;
                }

                methods.forEach(method => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        ${method.name} - ${method.description}
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

    // Добавление нового метода оплаты (фиктивная реализация)
    document.getElementById('add-method-btn').addEventListener('click', () => {
        const methodName = document.getElementById('new-method-name').value;
        const methodDesc = document.getElementById('new-method-desc').value;

        console.log('New method added:', methodName, methodDesc);
        alert(`Payment method '${methodName}' added successfully`);
        loadPaymentMethods(); // Перезагрузка списка
    });

    // Выбор метода оплаты для подписки
    function selectPaymentMethod(methodId) {
        alert(`Payment method ${methodId} selected!`);
        window.location.href = 'user.html';
    }

    // Инициализация
    loadPaymentMethods();
});