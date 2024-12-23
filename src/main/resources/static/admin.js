const API_BASE_URL = 'http://localhost:8080/api';

// Загрузка пользователей
function loadUsers() {
    fetch(`${API_BASE_URL}/users`)
        .then(response => response.json())
        .then(users => {
            const list = document.getElementById('users-list');
            list.innerHTML = '';
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.username} - ${user.roles.map(r => r.name).join(', ')}`;
                li.dataset.id = user.id;
                list.appendChild(li);
            });
        });
}

// Добавление списка пользователей на странице
function displayUsersList() {
    fetch(`${API_BASE_URL}/users`)
        .then(response => response.json())
        .then(users => {
            const list = document.getElementById('users-list');
            list.innerHTML = '';
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.username} - ${user.roles.map(role => role.name).join(', ')}`;
                list.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading users:', error));
}

// Добавление и удаление тарифа
function manageTariffs() {
    document.getElementById('add-tariff-btn').addEventListener('click', () => {
        const name = document.getElementById('tariff-name').value;
        const price = parseFloat(document.getElementById('tariff-price').value);
        const description = document.getElementById('tariff-desc').value;

        fetch(`${API_BASE_URL}/tariffs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, description, active: true })
        }).then(loadTariffs);
    });

    document.getElementById('delete-tariff-btn').addEventListener('click', () => {
        const id = prompt('Enter Tariff ID to delete:');
        fetch(`${API_BASE_URL}/tariffs/${id}`, {
            method: 'DELETE'
        }).then(loadTariffs);
    });
}

// Обработка тикетов поддержки
function manageSupportTickets() {
    document.getElementById('resolve-ticket-btn').addEventListener('click', () => {
        const id = prompt('Enter Ticket ID:');
        const response = document.getElementById('support-response').value;

        fetch(`${API_BASE_URL}/support/tickets/${id}/respond`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ response })
        }).then(loadSupportTickets);
    });

    document.getElementById('delete-ticket-btn').addEventListener('click', () => {
        const id = prompt('Enter Ticket ID to delete:');
        fetch(`${API_BASE_URL}/support/tickets/${id}`, {
            method: 'DELETE'
        }).then(loadSupportTickets);
    });
}

function searchUser() {
            const input = document.getElementById('search-user').value.toLowerCase();
            const userList = document.getElementById('all-users-list');
            const users = userList.getElementsByTagName('li');

            for (let i = 0; i < users.length; i++) {
                const username = users[i].textContent.toLowerCase();
                if (username.includes(input)) {
                    users[i].style.display = '';
                } else {
                    users[i].style.display = 'none';
                }
            }
        }

        document.getElementById('view-methods-btn').addEventListener('click', () => {
                    const userId = document.getElementById('user-id').value;
                    fetch(`http://localhost:8080/api/user-payment-methods/${userId}`)
                        .then(response => response.json())
                        .then(methods => {
                            const list = document.getElementById('user-methods-list');
                            list.innerHTML = '';
                            methods.forEach(method => {
                                const li = document.createElement('li');
                                li.textContent = `${method.id} - ${method.name} - ${method.description}`;
                                list.appendChild(li);
                            });
                        });
                });

        document.getElementById('edit-method-btn').addEventListener('click', () => {
                    const methodId = document.getElementById('edit-method-id').value;
                    const methodName = document.getElementById('edit-method-name').value;
                    const methodDesc = document.getElementById('edit-method-desc').value;
                    fetch(`http://localhost:8080/api/payment-methods/${methodId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: methodName, description: methodDesc })
                    }).then(() => alert('Method updated successfully'));
                });

        document.getElementById('delete-method-btn').addEventListener('click', () => {
                    const methodId = document.getElementById('edit-method-id').value;
                    fetch(`http://localhost:8080/api/payment-methods/${methodId}`, {
                        method: 'DELETE'
                    }).then(() => alert('Method deleted successfully'));
                });

        document.getElementById('view-ticket-btn').addEventListener('click', () => {
                    const ticketId = document.getElementById('ticket-id').value;
                    fetch(`http://localhost:8080/api/support/tickets/${ticketId}`)
                        .then(response => response.json())
                        .then(ticket => {
                            document.getElementById('support-response').value = ticket.response;
                        });
                });

        document.getElementById('delete-ticket-btn').addEventListener('click', () => {
                            const ticketId = document.getElementById('ticket-id').value;
                            fetch(`http://localhost:8080/api/support/tickets/${ticketId}`, {
                                method: 'DELETE'
                            }).then(() => alert('Ticket deleted successfully'));
                        });

        fetch('http://localhost:8080/api/support/tickets')
                    .then(response => response.json())
                    .then(tickets => {
                        const list = document.getElementById('support-list');
                        list.innerHTML = '';
                        tickets.filter(ticket => ticket.response).forEach(ticket => {
                            const li = document.createElement('li');
                            li.textContent = `ID: ${ticket.id} - Subject: ${ticket.subject}`;
                            list.appendChild(li);
                        });
                    });
}

// Инициализация
loadUsers();
displayUsersList();
manageTariffs();
manageSupportTickets();
searchUser();