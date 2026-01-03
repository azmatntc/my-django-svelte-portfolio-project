import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

function Reports() {
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        axios.get('/api/reports/')
            .then(response => setReportData(response.data))
            .catch(error => console.error('Error fetching reports:', error));
    }, []);

    const barData = {
        labels: reportData ? reportData.categories : [],
        datasets: [
            {
                label: 'Sales by Category',
                data: reportData ? reportData.sales : [],
                backgroundColor: '#10B981',
            },
        ],
    };

    const pieData = {
        labels: reportData ? reportData.statuses : [],
        datasets: [
            {
                data: reportData ? reportData.statusCounts : [],
                backgroundColor: ['#10B981', '#EF4444', '#FBBF24'],
            },
        ],
    };

    return (
        <main className="ml-64 p-8">
            <h1 className="text-3xl font-bold mb-6">Reports</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Sales by Category</h2>
                    <Bar data={barData} />
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Order Status Distribution</h2>
                    <Pie data={pieData} />
                </div>
            </div>
            <div className="mt-8 text-center">
                <button className="bg-accent text-white py-2 px-4 rounded hover:bg-green-600">Export Report</button>
            </div>
        </main>
    );
}

export default Reports;