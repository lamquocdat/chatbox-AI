import { useAuthStore } from '../contexts/authen/authStore';

export const useAuth = () => {
    const { auth, isAuthenticated, loading, setAuth, clearAuth, setLoading } = useAuthStore();

    return {
        auth,
        isAuthenticated,
        loading,
        setAuth,
        clearAuth,
        setLoading,
    };
};
