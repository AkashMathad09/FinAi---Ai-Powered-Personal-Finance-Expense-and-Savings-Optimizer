document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const rewardContainer = document.getElementById('reward-status-container');
    const formatCurrency = (amount) => `₹${Math.abs(amount).toFixed(2)}`;

    const fetchRewardStatus = async () => {
        try {
            const res = await fetch(`${API_URL}/rewards/status`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Could not load reward status.');

            const data = await res.json(); // { hasReward, message, budgetLimit, totalExpense }

            let rewardHTML = '';

            if (data.hasReward) {
                // SUCCESS: User is under budget
                rewardHTML = `
                    <div class="reward-card reward-success">
                        <div class="reward-icon"><i class="fas fa-trophy"></i></div>
                        <h2>Budget Master!</h2>
                        <p>${data.message}</p>
                        
                        <div class="reward-stats">
                            <div>
                                <p style="color: var(--subtle-text-color);">Your Budget</p>
                                <strong style="font-size: 1.25rem;">${formatCurrency(data.budgetLimit)}</strong>
                            </div>
                            <div>
                                <p style="color: var(--subtle-text-color);">You Spent</p>
                                <strong style="font-size: 1.25rem; color: var(--success-color);">${formatCurrency(data.totalExpense)}</strong>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // FAIL: User is over budget or has no budget
                rewardHTML = `
                    <div class="reward-card reward-fail">
                        <div class="reward-icon"><i class="fas fa-chart-line"></i></div>
                        <h2>Keep Going!</h2>
                        <p>${data.message}</p>

                        ${data.budgetLimit > 0 ? `
                        <div class="reward-stats">
                            <div>
                                <p style="color: var(--subtle-text-color);">Your Budget</p>
                                <strong style="font-size: 1.25rem;">${formatCurrency(data.budgetLimit)}</strong>
                            </div>
                            <div>
                                <p style="color: var(--subtle-text-color);">You Spent</p>
                                <strong style="font-size: 1.25rem; color: var(--danger-color);">${formatCurrency(data.totalExpense)}</strong>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                `;
            }
            
            rewardContainer.innerHTML = rewardHTML;

        } catch (err) {
            console.error(err);
            rewardContainer.innerHTML = `<p style="color: var(--danger-color);">${err.message}</p>`;
        }
    };

    fetchRewardStatus();
});