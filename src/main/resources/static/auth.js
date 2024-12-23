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
                throw new Error("Invalid email or password.");
            }

            const data = await response.json();
            alert("Login successful!");
            redirectToRolePage(data.role); // Перенаправление в зависимости от роли
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

            alert("Registration successful! Redirecting to profile page...");
            window.location.href = 'user.html'; // Перенаправление на страницу профиля
        } catch (error) {
            errorField.textContent = error.message;
        }
    });
});