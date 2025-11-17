document.addEventListener('DOMContentLoaded', () => {
    // --- All your code goes inside this block ---
    
    const API_URL = 'http://localhost:5000/api/payments/transfer';
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // --- 1. GET ELEMENTS (Now safe) ---
    const sendMoneyForm = document.getElementById('send-money-form');
    const formMessage = document.getElementById('form-message');
    const recipientUpiId = document.getElementById('recipient-upi');
    const amountInput = document.getElementById('amount');

    // --- 2. ADD EVENT LISTENER ---
    if (sendMoneyForm) {
        sendMoneyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formMessage.style.display = 'none'; // Hide old messages

            const toUpiId = recipientUpiId.value;
            const amount = parseFloat(amountInput.value);

            if (!toUpiId || !amount || amount <= 0) {
                formMessage.textContent = 'Please enter a valid UPI ID and amount.';
                formMessage.style.color = 'var(--danger-color)';
                formMessage.style.display = 'block';
                return;
            }

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ toUpiId, amount })
                });

                const data = await res.json();

                if (!res.ok) {
                    // This will show errors like "You cannot send to yourself"
                    throw new Error(data.message || 'Transfer failed');
                }

                // SUCCESS
                formMessage.textContent = data.message || 'Transfer successful!';
                formMessage.style.color = 'var(--success-color)';
                formMessage.style.display = 'block';
                sendMoneyForm.reset();

                alert('Transfer complete! Go to the Dashboard to see your updated balance.');

            } catch (err) {
                formMessage.textContent = err.message;
                formMessage.style.color = 'var(--danger-color)';
                formMessage.style.display = 'block';
            }
        });
    }
});