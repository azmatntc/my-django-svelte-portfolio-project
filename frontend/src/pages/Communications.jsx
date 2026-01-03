import { useState, useEffect } from 'react';
import axios from 'axios';

function Communications() {
    const [communications, setCommunications] = useState([]);

    useEffect(() => {
        axios.get('/api/communications/')
            .then(response => setCommunications(response.data))
            .catch(error => console.error('Error fetching communications:', error));
    }, []);

    return (
        <main className="ml-64 p-8">
            <h1 className="text-3xl font-bold mb-6">Communication History</h1>
            <ul className="space-y-4">
                {communications.map((comm) => (
                    <li key={comm.id} className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">{comm.type} with {comm.customer}</h3>
                        <p>{comm.date}: {comm.details}</p>
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default Communications;