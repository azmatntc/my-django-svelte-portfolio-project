import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
function Customers() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        axios.get('/api/customers/')
            .then(response => setCustomers(response.data))
            .catch(error => console.error('Error fetching customers:', error));
    }, []);

    return (
        <main className="ml-64 p-8">
            <h1 className="text-3xl font-bold mb-6">Customer Profiles</h1>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-700">
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id} className="border-b border-gray-600">
                            <td className="p-3">{customer.name}</td>
                            <td className="p-3">{customer.email}</td>
                            <td className="p-3">
                                <Link to={`/customers/${customer.id}`} className="text-accent hover:underline">
                                    View/Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}

export default Customers;