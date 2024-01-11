document.addEventListener('DOMContentLoaded', function () {
    const registerButton = document.getElementById('register');
    const loginButton = document.getElementById('login');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    registerButton.addEventListener('click', function () {
        if (!usernameInput.value || !passwordInput.value) {
            alert('Please enter both username and password.');
            return;
        }
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/register', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    window.location.href = `/${response.userId}/profile`;
                } else {
                    alert(response.message);
                }
            }
        };
        xhr.send(JSON.stringify({
            username: usernameInput.value,
            password: passwordInput.value
        }));
    });

    loginButton.addEventListener('click', function () {
        if (!usernameInput.value || !passwordInput.value) {
            alert('Please enter both username and password.');
            return;
        }
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                const response = JSON.parse(xhr.responseText);
                if (xhr.status === 200 && response.success) {
                    window.location.href = `/${response.userId}/profile`;
                } else {
                    alert(response.message);
                }
            }
        };
        xhr.send(JSON.stringify({
            username: usernameInput.value,
            password: passwordInput.value
        }));
    });
});
