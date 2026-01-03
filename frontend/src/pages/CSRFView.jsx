// src/pages/CSRFView.jsx
import React from 'react';

const CSRFView = () => {
    return (
        <div className="p-8 text-white">
            <h1 className="text-2xl font-bold mb-4">CSRF Token</h1>
            <p className="text-gray-400">
                This endpoint returns a CSRF token. Use it in your POST requests.
            </p>
        </div>
    );
};

export default CSRFView;