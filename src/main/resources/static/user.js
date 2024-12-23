let userId;

function fetchCurrentUser() {
    fetch('http://localhost:8080/api/users/current')
        .then(response => {
            if (!response.ok) {
                window.location.href = 'login.html';
            }
            return response.json();
        })
        .then(user => {
            userId = user.id;
            loadProfile();
            loadTariffs();
            loadPayments();
        })
        .catch(() => {
            alert('Authentication required!');
            window.location.href = 'login.html';
        });
}

function loadProfile() {
    fetch(`http://localhost:8080/api/user-profile/${userId}`)
        .then(response => response.json())
        .then(profile => {
            document.getElementById('username').textContent = profile.username;
            document.getElementById('balance').textContent = `$${profile.balance}`;
            document.getElementById('profile-details').value = profile.details;
        });
}

document.getElementById('update-profile-btn').addEventListener('click', () => {
    const updatedDetails = document.getElementById('profile-details').value;
    fetch(`http://localhost:8080/api/user-profile/update/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details: updatedDetails })
    }).then(() => alert('Profile updated successfully'));
});

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
        });
}

function loadPayments() {
    fetch(`http://localhost:8080/api/payments/history/${userId}`)
        .then(response => response.json())
        .then(payments => {
            const list = document.getElementById('payments-list');
            list.innerHTML = '';
            payments.forEach(payment => {
                const li = document.createElement('li');
                li.textContent = `ID: ${payment.id} - Amount: $${payment.amount} - Status: ${payment.status}`;
                list.appendChild(li);
            });
        });
}

fetchCurrentUser();