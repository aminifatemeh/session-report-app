import { createContext, useContext, useState, useCallback } from 'react';
import { login as apiLogin } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const stored = sessionStorage.getItem('auth_user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const login = useCallback(async (username, password) => {
        const userData = await apiLogin(username, password);
        setUser(userData);
        sessionStorage.setItem('auth_user', JSON.stringify(userData));
        return userData;
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        sessionStorage.removeItem('auth_user');
    }, []);

    return (
        // ✅ role را مستقیم از user.role میخوانیم
        <AuthContext.Provider value={{ user, role: user?.role ?? null, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
