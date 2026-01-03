import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mock registration: replace with /api/auth/register/ call
      console.log('Registration attempt:', { name, email, password });
      // Simulate successful registration
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <section className="py-16 bg-gray-900 min-h-screen">
      <div className="max-w-md mx-auto px-4">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-accent"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-accent"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-accent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </section>
  );
}

export default Register;