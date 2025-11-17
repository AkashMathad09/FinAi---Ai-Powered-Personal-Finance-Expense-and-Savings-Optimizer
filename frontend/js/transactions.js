document.addEventListener('DOMContentLoaded', () => {
    // API_URL is correct, it includes the /transactions path
    const API_URL = 'http://localhost:5000/api/transactions';
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const transactionForm = document.getElementById('transaction-form');
    const transactionTableBody = document.getElementById('transaction-table-body');
    const formError = document.getElementById('form-error');

    // Function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Fetch and display all transactions
    const fetchTransactions = async () => {
        try {
            const res = await fetch(API_URL, { // GET request
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to fetch transactions');

            const transactions = await res.json();
            transactionTableBody.innerHTML = ''; // Clear loading/existing rows

            if (transactions.length === 0) {
                transactionTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No transactions found.</td></tr>';
                return;
            }

            transactions.forEach(tx => {
                const row = document.createElement('tr');
                const amountClass = tx.type === 'income' ? 'type-income' : 'type-expense';
                const amountSign = tx.type === 'income' ? '+' : '-';

                // --- FIX: Use ₹ and Math.abs() to avoid double negatives ---
                row.innerHTML = `
                    <td>${tx.description}</td>
                    <td>${tx.category}</td>
                    <td>${formatDate(tx.date)}</td>
                    <td class="${amountClass}">${amountSign}₹${Math.abs(tx.amount).toFixed(2)}</td>
                `;
                transactionTableBody.appendChild(row);
            });

        } catch (err) {
            transactionTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--danger-color);">${err.message}</td></tr>`;
        }
    };

    // Handle form submission for new transaction
    if (transactionForm) { // Added a check in case the element isn't found
        transactionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (formError) formError.style.display = 'none';

            const description = document.getElementById('description').value;
            const amount = document.getElementById('amount').value;
            const type = document.getElementById('type').value;
            
            // --- FIX: REMOVED THIS LINE THAT CAUSED THE CRASH ---
            // const category = document.getElementById('category').value; 

            if (!description || !amount) {
                formError.textContent = 'Please fill out all fields.';
                formError.style.display = 'block';
                return;
            }

            try {
                const res = await fetch(API_URL, { // POST request
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    // --- FIX: Removed category from the body ---
                    body: JSON.stringify({ description, amount, type })
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Failed to add transaction');
                }

                transactionForm.reset(); // Clear form fields
                fetchTransactions(); // Refresh the list

            } catch (err) {
                formError.textContent = err.message;
                formError.style.display = 'block';
            }
        });
    }

    // Initial fetch
    fetchTransactions();
});