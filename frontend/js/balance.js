document.addEventListener('DOMContentLoaded', () => {
    // NOTE: In a real app, you'd have dedicated API endpoints for this data.
    // For now, we'll use placeholder data.
    const API_URL_BUDGET = 'http://localhost:5000/api/user/budget'; // Example endpoint
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const monthlyLimitEl = document.getElementById('monthly-limit');
    const amountSpentEl = document.getElementById('amount-spent');
    const amountRemainingEl = document.getElementById('amount-remaining');
    const forecastStatusEl = document.getElementById('forecast-status');

    const fetchBudgetData = async () => {
        try {
            // This is a simulated fetch. Replace with your actual API call.
            /*
            const res = await fetch(API_URL_BUDGET, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Could not fetch budget data');
            const data = await res.json();
            */
           
            // --- SIMULATED DATA ---
            const data = {
                monthlyLimit: 2500.00,
                amountSpent: 2150.00,
                aiForecast: "You are projected to be $250 under budget this month. Keep up the great work!"
            };
            // --- END SIMULATED DATA ---

            const amountRemaining = data.monthlyLimit - data.amountSpent;

            monthlyLimitEl.textContent = `$${data.monthlyLimit.toFixed(2)}`;
            amountSpentEl.textContent = `$${data.amountSpent.toFixed(2)}`;
            amountRemainingEl.textContent = `$${amountRemaining.toFixed(2)}`;
            forecastStatusEl.parentElement.innerHTML = data.aiForecast; // Update forecast text

            // Change color based on remaining amount
            if (amountRemaining < 0) {
                amountRemainingEl.style.color = 'var(--danger-color)';
            } else {
                amountRemainingEl.style.color = 'var(--secondary-color)';
            }

        } catch (err) {
            console.error(err);
            document.querySelector('.main-content').innerHTML = `<h2>Error loading data.</h2><p>${err.message}</p>`;
        }
    };

    fetchBudgetData();
});