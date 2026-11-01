import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#E3FDFD]/80 border-b border-[#A6E3E9]/60 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* 1. Brand Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-xl bg-[#71C9CE] flex items-center justify-center text-white shadow-md shadow-[#71C9CE]/30 group-hover:scale-105 transition-transform">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-extrabold text-xl text-slate-800 tracking-tight">
                        Study<span className="text-[#71C9CE]">AI</span>
                    </span>
                </Link>

                {/* 2. Navigation Actions */}
                <nav className="flex items-center gap-3 sm:gap-6">
                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="text-sm font-semibold text-slate-700 hover:text-[#71C9CE] transition-colors"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/chat"
                                className="text-sm font-semibold text-slate-700 hover:text-[#71C9CE] transition-colors"
                            >
                                AI Chat
                            </Link>
                            <Link
                                to="/quiz"
                                className="text-sm font-semibold text-slate-700 hover:text-[#71C9CE] transition-colors"
                            >
                                Quiz Generator
                            </Link>
                            <Link
                                to="/profile"
                                className="w-9 h-9 rounded-full ring-2 ring-[#71C9CE] overflow-hidden flex items-center justify-center bg-white text-slate-700 hover:ring-[#A6E3E9] transition"
                            >
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-5 h-5 text-[#71C9CE]" />
                                )}
                            </Link>
                            <button
                                onClick={logout}
                                title="Logout"
                                className="p-2 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleGoogleLogin}
                            className="text-sm font-semibold px-4 py-2 rounded-xl bg-[#71C9CE] hover:bg-[#5dbbc0] text-white shadow-sm shadow-[#71C9CE]/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Sign in with Google
                        </button>
                    )}
                </nav>

            </div>
        </header>
    );
};

export default Navbar;
