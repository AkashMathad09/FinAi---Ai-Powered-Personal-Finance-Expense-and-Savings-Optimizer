document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    let user = null;
    try {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== "undefined") {
            user = JSON.parse(userStr);
        }
    } catch (e) {
        console.error("Corrupted user data in localStorage", e);
        localStorage.clear(); // Clear bad data
    }

    if (!token || !user) {
        window.location.href = 'index.html';
        return;
    }

    const API_URL = 'http://localhost:5000/api';

    // Get all HTML elements
    const usernameDisplay = document.getElementById('username-display');
    const userUpiIdDisplay = document.getElementById('user-upi-id');
    const walletBalanceEl = document.getElementById('wallet-balance');
    const dashboardIncomeEl = document.getElementById('dashboard-income');
    const dashboardExpenseEl = document.getElementById('dashboard-expense');

    // Helper to format currency
    const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

    // 1. Set User Info from localStorage
    if (usernameDisplay) usernameDisplay.textContent = user.username;
    if (userUpiIdDisplay) userUpiIdDisplay.textContent = user.upiId;

    // 2. Fetch Wallet Balance
    const fetchWallet = async () => {
        try {
            const res = await fetch(`${API_URL}/wallet/balance`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch wallet');
            const data = await res.json(); // { balance: 50000 }
            if (walletBalanceEl) walletBalanceEl.textContent = formatCurrency(data.balance);
        } catch (err) {
            console.error('Error fetching wallet:', err.message);
            if (walletBalanceEl) walletBalanceEl.textContent = 'Error';
        }
    };

    // 3. Fetch Monthly Summary (Income/Expense)
    const fetchSummary = async () => {
        try {
            const res = await fetch(`${API_URL}/budget/summary`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch summary');
            const data = await res.json(); // { totalIncome, totalExpense }
            
            if (dashboardIncomeEl) dashboardIncomeEl.textContent = formatCurrency(data.totalIncome);
            // 👇 THE FIX IS HERE (it no longer says 'formatTofixed')
            if (dashboardExpenseEl) dashboardExpenseEl.textContent = formatCurrency(data.totalExpense);
        } catch (err) {
            console.error('Error fetching summary:', err.message);
            if (dashboardIncomeEl) dashboardIncomeEl.textContent = 'Error';
            if (dashboardExpenseEl) dashboardExpenseEl.textContent = 'Error';
        }
    };

    // Run both functions on page load
    fetchWallet();
    fetchSummary();
});