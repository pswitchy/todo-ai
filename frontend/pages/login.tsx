// frontend/pages/login.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../utils/api';
import { useRouter } from 'next/router';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { login, isLoggedIn } = useAuth();
    const router = useRouter();

    // Redirect to home page if already logged in
    useEffect(() => {
        if (isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setError(null);

        try {
            // Call the login API
            const response = await loginUser({ email, password });

            // Update auth state with the received token
            login(response.token);

            // Redirect to the home page
            router.push('/');
        } catch (err: any) {
            console.error("Login failed:", err);

            // Handle error message
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                'Login failed. Please check your credentials.';
            setError(errorMessage);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Log In
                    </button>
                    <a
                        href="/register"
                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    >
                        Register
                    </a>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;