import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [userRole, setUserRole] = useState('standard');
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        const role = Cookies.get('user_role') || 'standard';
        const savedUsername = Cookies.get('username') || '';
        const loggedIn = Cookies.get('is_logged_in') === 'true';
        const minimized = Cookies.get('sidebar_minimized') === 'true';
        setUserRole(role);
        setUsername(savedUsername);
        setIsLoggedIn(loggedIn);
        setIsMinimized(minimized);

        axios.get('/api/user-role/')
            .then(response => setUserRole(response.data.role))
            .catch(() => setUserRole('standard'));
    }, []);

    useEffect(() => {
        Cookies.set('sidebar_minimized', isMinimized.toString(), { expires: 7 });
    }, [isMinimized]);

    return (
        <UserContext.Provider value={{ userRole, setUserRole, username, setUsername, isLoggedIn, setIsLoggedIn, isMinimized, setIsMinimized }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    return useContext(UserContext);
}