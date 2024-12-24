document.addEventListener('DOMContentLoaded', () => {
    let userId = 1; // Фиксированный ID пользователя для демонстрации

    // Загрузка фиктивных методов оплаты
    function loadPaymentMethods() {
        console.log('Loading payment methods for user ID:', userId);
        const methods = [
            { id: 2, name: 'Visa', description: 'Credit Card' },
            { id: 3, name: 'Mir', description: 'Credit Card' } // Исправлена ошибка с кавычками
        ];

        const list = document.getElementById('methods-list');
        list.innerHTML = '';
        methods.forEach(method => {
            const li = document.createElement('li');
            li.textContent = `ID: ${method.id} - ${method.name} (${method.description})`;
            li.addEventListener('click', () => selectPaymentMethod(method.id));
            list.appendChild(li);
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