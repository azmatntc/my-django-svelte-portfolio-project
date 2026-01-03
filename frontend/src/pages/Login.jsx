import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';

function Login() {
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('standard');
  const [error, setError] = useState('');
  const { setUserRole, setUsername, setIsLoggedIn } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.get('http://localhost:8000/api/csrf/')
      .then(response => {
        Cookies.set('csrftoken', response.data.csrfToken);
      })
      .catch(err => console.error('Error fetching CSRF token:', err));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/login/',
        { username: usernameInput, password, role },
        {
          headers: {
            'X-CSRFToken': Cookies.get('csrftoken'),
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      Cookies.set('user_role', response.data.role, { expires: 7 });
      Cookies.set('username', usernameInput, { expires: 7 });
      Cookies.set('is_logged_in', 'true', { expires: 7 });
      setUserRole(response.data.role);
      setUsername(usernameInput);
      setIsLoggedIn(true);
      setError('');
      navigate('/customers');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed: Invalid credentials or CSRF token issue');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-gray-800 rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-emerald-500">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          placeholder="Username"
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
          autoComplete="username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
          autoComplete="current-password"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
        >
          <option value="standard">Standard User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full bg-emerald-500 p-2 rounded text-white hover:bg-emerald-400"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;