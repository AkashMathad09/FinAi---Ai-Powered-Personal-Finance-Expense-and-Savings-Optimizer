document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // Get the <canvas> element from the HTML
    const ctx = document.getElementById('expense-pie-chart')?.getContext('2d');

    if (!ctx) {
        console.error('Chart canvas not found');
        return;
    }

    // Helper function to generate random pretty colors
    const generateColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const hue = (i * (360 / numColors)) % 360;
            colors.push(`hsl(${hue}, 70%, 60%)`);
        }
        return colors;
    };

    // --- Fetch Data and Draw Chart ---
    const renderPieChart = async () => {
        try {
            // 1. Call the backend API we built
            const res = await fetch(`${API_URL}/budget/expense-categories`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to fetch chart data');

            // Data will be like: [{ category: "Other", total: 500 }, { category: "Transfer", total: 100 }]
            const data = await res.json();

            if (data.length === 0) {
                document.querySelector('.chart-container').innerHTML = '<p style="text-align:center; color: var(--subtle-text-color);">No expense data for this month. Add some expenses to see your report.</p>';
                return;
            }

            // 2. Prepare data for the chart
            const labels = data.map(item => item.category);
            const totals = data.map(item => item.total);
            const colors = generateColors(data.length);

            // 3. Create the chart
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Expense by Category',
                        data: totals,
                        backgroundColor: colors,
                        borderColor: '#ffffff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        tooltip: {
                            callbacks: {
                                // Format the tooltip to show "₹"
                                label: function(context) {
                                    let label = context.label || '';
                                    let value = context.raw || 0;
                                    return `${label}: ₹${value.toFixed(2)}`;
                                }
                            }
                        }
                    }
                }
            });

        } catch (err) {
            console.error(err);
            document.querySelector('.chart-container').innerHTML = `<p style="text-align:center; color: var(--danger-color);">${err.message}</p>`;
        }
    };

    renderPieChart();
});