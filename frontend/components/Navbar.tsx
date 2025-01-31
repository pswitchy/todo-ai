// frontend/components/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { isLoggedIn, logout } = useAuth();

    return (
        <nav className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-blue-600">
                    TodoApp
                </Link>
                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/" className="text-gray-600 hover:text-blue-600">
                                Tasks
                            </Link>
                            <button
                                onClick={logout}
                                className="text-gray-600 hover:text-blue-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-gray-600 hover:text-blue-600">
                                Login
                            </Link>
                            <Link href="/register" className="text-gray-600 hover:text-blue-600">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;