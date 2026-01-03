import { useState, useEffect } from 'react';
import axios from 'axios';

function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('/api/orders/')
            .then(response => setOrders(response.data))
            .catch(error => console.error('Error fetching orders:', error));
    }, []);

    return (
        <main className="ml-64 p-8">
            <h1 className="text-3xl font-bold mb-6">Orders & Transactions</h1>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-700">
                        <th className="p-3 text-left">Order ID</th>
                        <th className="p-3 text-left">Customer</th>
                        <th className="p-3 text-left">Amount</th>
                        <th className="p-3 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-600">
                            <td className="p-3">{order.id}</td>
                            <td className="p-3">{order.customer}</td>
                            <td className="p-3">${order.amount}</td>
                            <td className="p-3">{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}

export default Orders;