document.addEventListener('DOMContentLoaded', async () => {
    const API_URL_REPORTS = 'http://localhost:5000/api/transactions/reports'; // Example endpoint
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    
    // --- Helper function to get random colors for charts ---
    const getRandomColor = () => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`;

    try {
        // --- SIMULATED API CALL AND DATA ---
        // In a real app, you would fetch this data from your backend.
        // const res = await fetch(API_URL_REPORTS, { headers: { 'Authorization': `Bearer ${token}` }});
        // const reportData = await res.json();
        
        const reportData = {
            spendingByCategory: {
                labels: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment'],
                data: [450, 220, 300, 500, 150]
            },
            incomeVsExpense: {
                labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                income: [5000, 5000, 5100, 4900, 5000, 5000],
                expense: [2800, 3100, 2900, 3500, 3200, 2150]
            }
        };
        // --- END SIMULATION ---

        // --- Render Spending by Category Chart (Doughnut) ---
        const categoryCtx = document.getElementById('category-chart').getContext('2d');
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: reportData.spendingByCategory.labels,
                datasets: [{
                    label: 'Spending',
                    data: reportData.spendingByCategory.data,
                    backgroundColor: reportData.spendingByCategory.labels.map(() => getRandomColor()),
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });

        // --- Render Income vs Expense Chart (Bar) ---
        const flowCtx = document.getElementById('flow-chart').getContext('2d');
        new Chart(flowCtx, {
            type: 'bar',
            data: {
                labels: reportData.incomeVsExpense.labels,
                datasets: [
                    {
                        label: 'Income',
                        data: reportData.incomeVsExpense.income,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Expense',
                        data: reportData.incomeVsExpense.expense,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true
            }
        });

    } catch (err) {
        console.error("Failed to load chart data:", err);
        document.querySelector('.main-content').innerHTML = `<h2>Could not load reports.</h2><p>${err.message}</p>`;
    }
});