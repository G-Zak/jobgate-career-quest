import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useLogout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        const result = logout();
        if (result.success) {
            navigate('/login');
        } else {
            console.error('Logout failed:', result.error);
        }
    }, [logout, navigate]);

    return { handleLogout };
};

export default useLogout;
