document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api/auth';
    
    // --- LOGIN LOGIC ---
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const errorMsg = document.getElementById('error-message');
            const btn = loginForm.querySelector('button');
            
            errorMsg.textContent = '';
            btn.disabled = true;
            btn.innerText = 'Logging in...';

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Login failed');

                // --- 🛡️ START: NEW SAFE SAVE LOGIC ---
                const token = data.token;
                const user = data.user; // This is the nested object

                if (token && user) {
                    // Scenario 1: Backend sent { token: "...", user: {...} }
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                } else if (token && data.username) {
                    // Scenario 2: Backend sent a "flat" object
                    localStorage.setItem('token', token);
                    const userToSave = { ...data };
                    delete userToSave.token; // Don't save token inside the user object
                    localStorage.setItem('user', JSON.stringify(userToSave));
                } else {
                    throw new Error('Invalid response from server.');
                }
                // --- 🛡️ END: NEW SAFE SAVE LOGIC ---

                window.location.href = 'home.html';

            } catch (err) {
                errorMsg.style.color = 'red';
                errorMsg.textContent = err.message;
                btn.disabled = false;
                btn.innerText = 'Login';
            }
        });
    }

    // --- REGISTER LOGIC ---
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const errorMsg = document.getElementById('error-message');
            const btn = registerForm.querySelector('button');

            errorMsg.textContent = '';
            btn.disabled = true;
            btn.innerText = 'Creating Account...';

            const nameInput = document.getElementById('name');
            const usernameInput = document.getElementById('username');
            const usernameValue = nameInput ? nameInput.value : (usernameInput ? usernameInput.value : '');
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: usernameValue, email, password })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Registration failed');

                // --- 🛡️ START: NEW SAFE SAVE LOGIC ---
                const token = data.token;
                const user = data.user; // This is the nested object

                if (token && user) {
                    // Scenario 1: Backend sent { token: "...", user: {...} }
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                } else if (token && data.username) {
                    // Scenario 2: Backend sent a "flat" object
                    localStorage.setItem('token', token);
                    const userToSave = { ...data };
                    delete userToSave.token;
                    localStorage.setItem('user', JSON.stringify(userToSave));
                } else {
                    throw new Error('Invalid response from server.');
                }
                // --- 🛡️ END: NEW SAFE SAVE LOGIC ---

                window.location.href = 'home.html';

            } catch (err) {
                errorMsg.style.color = 'red';
                errorMsg.textContent = err.message;
                btn.disabled = false;
                btn.innerText = 'Register';
            }
        });
    }

    // --- LOGOUT LOGIC ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }

    // --- MOBILE MENU TOGGLE LOGIC ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');

    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
});
