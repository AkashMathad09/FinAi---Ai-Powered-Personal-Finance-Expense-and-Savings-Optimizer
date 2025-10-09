// This script should be included in index.html, register.html, and all authenticated pages.

document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api'; // Change to your backend URL

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // If on an authenticated page without a token, redirect to login
    const protectedPages = ['home.html', 'transactions.html', 'balance.html', 'reports.html', 'rewards.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage) && !token) {
        window.location.href = 'index.html';
    }

    // Populate user info on protected pages
    if (user && document.getElementById('username-display')) {
        document.getElementById('username-display').textContent = user.username;
    }

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');
    const errorMessage = document.getElementById('error-message');

    // --- LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Failed to login');
                }
                
                // Store token and user info
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                window.location.href = 'home.html'; // Redirect to dashboard

            } catch (err) {
                errorMessage.textContent = err.message;
                errorMessage.style.display = 'block';
            }
        });
    }

    // --- REGISTER ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                 const res = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await res.json();

                 if (!res.ok) {
                    throw new Error(data.message || 'Failed to register');
                }

                alert('Registration successful! Please login.');
                window.location.href = 'index.html';

            } catch (err) {
                 errorMessage.textContent = err.message;
                 errorMessage.style.display = 'block';
            }
        });
    }

    // --- LOGOUT ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }
});