document.addEventListener('DOMContentLoaded', () => {
    const API_URL_REWARDS = 'http://localhost:5000/api/user/rewards'; // Example endpoint
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const rewardsContainer = document.getElementById('rewards-container');

    const fetchRewards = async () => {
         try {
            // Replace with your actual API call
            /*
            const res = await fetch(API_URL_REWARDS, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Could not load rewards');
            const rewards = await res.json();
            */

            // --- SIMULATED DATA ---
            const rewards = [
                { icon: 'fa-star', color: '#FBBF24', title: 'August Saver', description: 'You stayed $150 under budget in August 2025!' },
                { icon: 'fa-trophy', color: '#9CA3AF', title: '3-Month Streak', description: 'Achieved in July 2025.' },
                { icon: 'fa-gem', color: 'var(--primary-color)', title: 'Super Saver', description: 'Saved over $1,000 in total.' },
                { icon: 'fa-leaf', color: 'var(--secondary-color)', title: 'Eco-Warrior', description: 'Reduced transport spending by 20%.' },
            ];
            // --- END SIMULATED DATA ---

            rewardsContainer.innerHTML = ''; // Clear placeholders
            if (rewards.length === 0) {
                 rewardsContainer.innerHTML = '<p>No rewards yet. Keep saving to earn them!</p>';
                 return;
            }

            rewards.forEach(reward => {
                const card = document.createElement('div');
                card.className = 'card';
                card.style.textAlign = 'center';
                card.innerHTML = `
                    <i class="fas ${reward.icon}" style="font-size: 3rem; color: ${reward.color}; margin-bottom: 1rem;"></i>
                    <h3 style="margin-bottom: 0.5rem;">${reward.title}</h3>
                    <p style="color: var(--subtle-text-color);">${reward.description}</p>
                `;
                rewardsContainer.appendChild(card);
            });

         } catch (err) {
            rewardsContainer.innerHTML = `<p style="color:var(--danger-color)">${err.message}</p>`;
         }
    };

    fetchRewards();
});