import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { AuthPayload } from './types';

interface AuthState {
    auth: AuthPayload | null;
    isAuthenticated: boolean;
    loading: boolean;
    setAuth: (auth: AuthPayload) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                auth: null,
                isAuthenticated: false,
                loading: false,

                setAuth: (auth: AuthPayload) => {
                    localStorage.setItem('access_token', auth.token);
                    set({ auth, isAuthenticated: true });
                },

                clearAuth: () => {
                    localStorage.removeItem('access_token');
                    set({ auth: null, isAuthenticated: false });
                },

                setLoading: (loading: boolean) => {
                    set({ loading });
                },
            }),
            {
                name: 'auth-storage',
                partialize: (state) => ({
                    auth: state.auth,
                    isAuthenticated: state.isAuthenticated,
                }),
            }
        )
    )
);
