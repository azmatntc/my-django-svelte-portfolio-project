// src/pages/UserRoleView.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserRoleView = () => {
    const [role, setRole] = useState(null);

    useEffect(() => {
        axios.get('/api/user-role/')
            .then(res => setRole(res.data.role))
            .catch(err => setRole('error'));
    }, []);

    return (
        <div className="p-8 text-white">
            <h1 className="text-2xl font-bold mb-4">User Role</h1>
            <p>Current role: <span className="text-emerald-400">{role}</span></p>
        </div>
    );
};

export default UserRoleView;