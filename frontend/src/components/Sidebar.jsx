import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaUsers, FaComments, FaShoppingCart, FaChartBar, FaFileAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useUserContext } from '../context/UserContext';

function Sidebar() {
    const [isMobile, setIsMobile] = useState(false);
    const { userRole, isMinimized, setIsMinimized } = useUserContext();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) setIsMinimized(true);
            else setIsMinimized(Cookies.get('sidebar_minimized') === 'true');
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [setIsMinimized]);

    const menuItems = [
        { path: '/customers', icon: <FaUsers />, label: 'Customers', adminOnly: false },
        { path: '/communications', icon: <FaComments />, label: 'Communications', adminOnly: false },
        { path: '/orders', icon: <FaShoppingCart />, label: 'Orders', adminOnly: false },
        { path: '/finances', icon: <FaChartBar />, label: 'Finances', adminOnly: true },
        { path: '/reports', icon: <FaFileAlt />, label: 'Reports', adminOnly: true },
    ];

    const filteredItems = menuItems.filter(item =>
        !item.adminOnly || userRole === 'admin'
    );

    return (
        <aside className={`bg-gray-800 h-screen p-4 fixed left-0 top-0 overflow-y-auto transition-all duration-300 ease-in-out
      ${isMinimized ? 'w-16' : 'w-64'} ${isMobile ? 'w-full p-2 z-50' : ''}`}>
            <div className="flex justify-between items-center mb-6">
                {!isMinimized && !isMobile && <h2 className="text-2xl font-bold text-emerald-500">Dashboard</h2>}
                <button onClick={() => setIsMinimized(!isMinimized)} className="text-white">
                    {isMinimized ? <FaArrowRight /> : <FaArrowLeft />}
                </button>
            </div>
            <ul className="space-y-4">
                {filteredItems.map((item) => (
                    <li key={item.path}>
                        <Link
                            to={item.path}
                            className="flex items-center space-x-3 text-gray-300 hover:text-emerald-400 hover:bg-gray-700 p-2 rounded transition-colors"
                        >
                            <span className="text-xl">{item.icon}</span>
                            {!isMinimized && !isMobile && <span>{item.label}</span>}
                        </Link>
                    </li>
                ))}
            </ul>
            {userRole === 'admin' && !isMinimized && !isMobile && (
                <div className="mt-4 text-center text-gray-500 text-sm">
                    Admin Mode
                </div>
            )}
        </aside>
    );
}

export default Sidebar;