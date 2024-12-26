document.addEventListener('DOMContentLoaded', () => {
    let userId = 1; // Фиксированный ID пользователя для демонстрации

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