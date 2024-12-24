document.addEventListener("DOMContentLoaded", () => {

    // Перенаправление по роли
    function redirectToRolePage(role) {
        switch (role) {
            case 'ADMIN':
                window.location.href = 'admin.html';
                break;
            case 'SUPPORT':
                window.location.href = 'support.html';
                break;
            case 'USER':
                window.location.href = 'user.html';
                break;
            default:
                alert('Unknown role');
                window.location.href = 'auth.html';
        }
    }

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

    // Логин
    document.getElementById("login-btn").addEventListener("click", async () => {
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const errorField = document.getElementById("login-error");

        if (!email || !password) {
            errorField.textContent = "Please fill out all fields.";
            return;
        }

        try {
            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: email,
                    passwordHash: password
                })
            });

            if (!response.ok) {
                throw new showNotification("Invalid email or password.", "error");
            }

            const data = await response.json();
            showNotification("Login successful!", "success");
            redirectToRolePage(data.role);
        } catch (error) {
            errorField.textContent = error.message;
        }
    });

    // Регистрация
    document.getElementById("register-btn").addEventListener("click", async () => {
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const errorField = document.getElementById("register-error");

        if (!email || !password) {
            errorField.textContent = "Please fill out all fields.";
            return;
        }

        try {
            const response = await fetch("/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: email,
                    passwordHash: password
                })
            });

            if (!response.ok) {
                throw new Error("Registration failed.");
            }

            showNotification("Registration successful! Redirecting to profile page...", "success");
            window.location.href = 'user.html';
        } catch (error) {
            errorField.textContent = error.message;
        }
    });
});