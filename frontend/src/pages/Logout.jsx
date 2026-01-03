// src/pages/Logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        Cookies.remove('user_role');
        Cookies.remove('csrftoken');
        navigate('/');
    }, [navigate]);

    return (
        <div className="p-8 text-white">
            <h1 className="text-2xl font-bold mb-4">Logging out…</h1>
        </div>
    );
};

export default Logout;