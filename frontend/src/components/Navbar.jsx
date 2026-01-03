import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaBriefcase, FaCogs, FaEnvelope, FaSignInAlt, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { useUserContext } from '../context/UserContext';

function Navbar() {
  const { username, isLoggedIn, setIsLoggedIn, setUserRole, setUsername, isMinimized } = useUserContext();
  const location = useLocation();
  const isDashboardRoute = ['/customers', '/communications', '/orders', '/finances', '/reports'].includes(location.pathname);

  const navItems = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'About', path: '/about', icon: <FaUser /> },
    { name: 'Portfolio', path: '/portfolio', icon: <FaBriefcase /> },
    { name: 'Services', path: '/services', icon: <FaCogs /> },
    { name: 'Contact', path: '/contact', icon: <FaEnvelope /> },
  ];

  const handleLogout = () => {
    Cookies.remove('user_role');
    Cookies.remove('username');
    Cookies.remove('is_logged_in');
    setIsLoggedIn(false);
    setUserRole('standard');
    setUsername('');
  };

  return (
    <nav className={`bg-gray-800 p-4 shadow-lg sticky top-0 z-50 ${isDashboardRoute ? (isMinimized ? 'ml-16 md:ml-0' : 'ml-64 md:ml-0') : ''}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Malik Azmat Abbas</h1>
        <ul className="flex space-x-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 text-lg hover:text-accent transition-colors ${isActive ? 'text-accent font-semibold' : 'text-white'
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
          {isLoggedIn ? (
            <>
              <li className="flex items-center space-x-2 text-lg text-white">
                <span>Welcome, {username}</span>
              </li>
              <li>
                <NavLink
                  to="/"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-lg hover:text-accent transition-colors text-white"
                >
                  <span className="text-xl"><FaSignOutAlt /></span>
                  <span>Logout</span>
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className="flex items-center space-x-2 text-lg hover:text-accent transition-colors text-white"
                >
                  <span className="text-xl"><FaSignInAlt /></span>
                  <span>Login</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className="flex items-center space-x-2 text-lg hover:text-accent transition-colors text-white"
                >
                  <span className="text-xl"><FaUserPlus /></span>
                  <span>Register</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;