document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const balanceDisplay = document.getElementById('current-balance');
    const budgetLimitDisplay = document.getElementById('budget-limit'); // For the user's *set* limit
    const suggestBtn = document.getElementById('suggest-budget-btn');
    const suggestionsContainer = document.getElementById('suggestions-container');
    const loadingMsg = document.getElementById('ai-loading');

    // Helper to format currency
    const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

    // --- 1. FETCH BUDGET SUMMARY (Income, Expense, and Set Limit) ---
    const fetchBudgetSummary = async () => {
        try {
            const res = await fetch(`${API_URL}/budget/summary`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch balance');
            
            const data = await res.json();
            
            // Update the main balance card (This is from the Wallet)
            const walletRes = await fetch(`${API_URL}/wallet/balance`, {
                 headers: { 'Authorization': `Bearer ${token}` }
            });
            const walletData = await walletRes.json();
            balanceDisplay.textContent = formatCurrency(walletData.balance);

            // Update the summary card (This is from Transactions)
            if (document.getElementById('total-income')) {
                document.getElementById('total-income').textContent = formatCurrency(data.totalIncome);
            }
            if (document.getElementById('total-expense')) {
                document.getElementById('total-expense').textContent = formatCurrency(data.totalExpense);
            }
            if (document.getElementById('amount-remaining')) {
                 const remaining = data.budgetLimit - data.totalExpense;
                 document.getElementById('amount-remaining').textContent = formatCurrency(remaining);
            }
             if (document.getElementById('budget-limit-display')) {
                 document.getElementById('budget-limit-display').textContent = formatCurrency(data.budgetLimit);
            }


        } catch (err) {
            console.error(err);
            balanceDisplay.textContent = 'Error';
        }
    };

    // --- 2. FETCH AI BUDGET SUGGESTIONS ---
    const fetchAiSuggestions = async () => {
        loadingMsg.style.display = 'block';
        suggestBtn.disabled = true;
        suggestionsContainer.innerHTML = ''; 

        try {
            const res = await fetch(`${API_URL}/budget/suggestions`, { // Calls new GET route
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'AI Error');

            if (data.suggestions && data.suggestions.length > 0) {
                data.suggestions.forEach(plan => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <div style="display:flex; align-items:center; margin-bottom:1rem;">
                            <i class="fas fa-lightbulb" style="font-size:1.5rem; color:var(--primary-color); margin-right:1rem;"></i>
                            <h3 style="margin:0;">${plan.title}</h3>
                        </div>
                        <h2 style="color:var(--primary-color); margin-bottom:0.5rem;">₹${plan.limit}</h2>
                        <p style="color:var(--subtle-text-color); font-size:0.9rem; margin-bottom:1rem;">${plan.description}</p>
                        <!-- Added data-limit attribute -->
                        <button class="btn btn-set-budget" data-limit="${plan.limit}" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Set This Plan</button>
                    `;
                    suggestionsContainer.appendChild(card);
                });
            } else {
                suggestionsContainer.innerHTML = '<p>No suggestions available. Try adding more transactions first!</p>';
            }

        } catch (err) {
            console.error(err, "Error fetching AI suggestions");
            suggestionsContainer.innerHTML = `<p style="color:var(--danger-color)">Error: ${err.message}</p>`;
        } finally {
            loadingMsg.style.display = 'none';
            suggestBtn.disabled = false;
        }
    };

    // --- 3. SET THE BUDGET ---
    const setBudget = async (amount) => {
        try {
            const res = await fetch(`${API_URL}/budget/set`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount })
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Could not set budget');

            // Success! Refresh the main summary.
            fetchBudgetSummary();
            alert(`Success! Your new monthly budget is set to ₹${amount}.`);

        } catch (err) {
            console.error(err, "Error setting budget");
            alert(`Error: ${err.message}`);
        }
    };

    // --- 4. EVENT LISTENERS ---
    fetchBudgetSummary(); // Load summary on page load

    if (suggestBtn) {
        suggestBtn.addEventListener('click', fetchAiSuggestions);
    }

    // Event delegation for the "Set This Plan" buttons
    suggestionsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-set-budget')) {
            const limit = e.target.getAttribute('data-limit');
            setBudget(limit);
        }
    });
});