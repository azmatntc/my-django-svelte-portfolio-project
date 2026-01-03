import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

function Finances() {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get('/api/finances/')
            .then(response => setData(response.data))
            .catch(error => console.error('Error fetching finances:', error));
    }, []);

    const chartData = {
        labels: data ? data.months : [],
        datasets: [
            {
                label: 'Revenue',
                data: data ? data.revenue : [],
                borderColor: '#10B981',
                tension: 0.1,
            },
            {
                label: 'Expenses',
                data: data ? data.expenses : [],
                borderColor: '#EF4444',
                tension: 0.1,
            },
        ],
    };

    return (
        <main className="ml-64 p-8">
            <h1 className="text-3xl font-bold mb-6">Financial Performance</h1>
            <div className="bg-gray-800 p-6 rounded-lg">
                <Line data={chartData} />
            </div>
        </main>
    );
}

export default Finances;