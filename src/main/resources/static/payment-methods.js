let userId;
let selectedTariffId = sessionStorage.getItem('selectedTariffId'); // Тариф сохранен из предыдущей страницы

// Получение текущего пользователя
function fetchCurrentUser() {
    fetch('http://localhost:8080/api/users/current')
        .then(response => response.json())
        .then(user => {
            userId = user.id;
            loadPaymentMethods();
        })
        .catch(() => {
            alert('Authentication required!');
            window.location.href = 'login.html';
        });
}

// Загрузка методов оплаты
function loadPaymentMethods() {
    fetch(`http://localhost:8080/api/user-payment-methods/${userId}`)
        .then(response => response.json())
        .then(methods => {
            const list = document.getElementById('methods-list');
            list.innerHTML = '';
            methods.forEach(method => {
                const li = document.createElement('li');
                li.textContent = `ID: ${method.id} - ${method.name}`;
                li.addEventListener('click', () => selectPaymentMethod(method.id));
                list.appendChild(li);
            });
        });
}

// Добавление нового метода оплаты
document.getElementById('add-method-btn').addEventListener('click', () => {
    const methodName = document.getElementById('new-method-name').value;
    const methodDesc = document.getElementById('new-method-desc').value;

    fetch('http://localhost:8080/api/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: methodName, description: methodDesc })
    })
        .then(() => loadPaymentMethods())
        .then(() => alert('Payment method added successfully'));
});

// Выбор метода оплаты и завершение подписки
function selectPaymentMethod(methodId) {
    fetch(`http://localhost:8080/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: userId,
            methodId: methodId,
            amount: 0, // Подписка может быть оплачена сразу
            status: 'pending'
        })
    })
        .then(() => {
            alert('Subscription completed successfully!');
            window.location.href = 'index.html';
        });
}

fetchCurrentUser();
