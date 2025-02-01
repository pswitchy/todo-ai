// frontend/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface AuthContextType {
    isLoggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
    token: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
            setIsLoggedIn(true);
        }
    }, []);

    // Login function to set token and update state
    const login = (newToken: string) => {
        setToken(newToken);
        setIsLoggedIn(true);
        localStorage.setItem('authToken', newToken);
    };

    // Logout function to clear token and update state
    const logout = () => {
        setToken(null);
        setIsLoggedIn(false);
        localStorage.removeItem('authToken');
    };

    // Context value
    const value: AuthContextType = {
        isLoggedIn,
        login,
        logout,
        token,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export { AuthContext, AuthProvider };