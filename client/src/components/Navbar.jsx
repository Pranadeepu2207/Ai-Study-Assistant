import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, LogOut, User as UserIcon, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const handleGoogleLogin = () => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        window.location.href = `${backendUrl}/api/auth/google`;
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'AI Chat', path: '/chat' },
        { name: 'Quiz Generator', path: '/quiz' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#E3FDFD]/90 border-b border-[#A6E3E9]/60 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* 1. Brand Logo */}
                <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#71C9CE] flex items-center justify-center text-white shadow-md shadow-[#71C9CE]/30 group-hover:scale-105 transition-transform">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight">
                        Study<span className="text-[#71C9CE]">AI</span>
                    </span>
                </Link>

                {/* 2. Desktop Navigation Actions */}
                <nav className="hidden md:flex items-center gap-6">
                    {user ? (
                        <>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-sm font-semibold transition-colors ${isActive(link.path)
                                            ? 'text-[#71C9CE] border-b-2 border-[#71C9CE] pb-0.5'
                                            : 'text-slate-600 hover:text-[#71C9CE]'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="flex items-center gap-3 pl-3 border-l border-[#A6E3E9]">
                                <Link
                                    to="/profile"
                                    className={`w-9 h-9 rounded-full ring-2 overflow-hidden flex items-center justify-center bg-white transition shrink-0 ${isActive('/profile') ? 'ring-[#71C9CE]' : 'ring-[#A6E3E9] hover:ring-[#71C9CE]'
                                        }`}
                                    title="View Profile"
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
                                    className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <button
                            onClick={handleGoogleLogin}
                            className="text-sm font-semibold px-4 py-2.5 rounded-xl bg-[#71C9CE] hover:bg-[#5dbbc0] text-white shadow-sm shadow-[#71C9CE]/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                            Sign in with Google
                        </button>
                    )}
                </nav>

                {/* 3. Mobile Hamburger Toggle Button */}
                <div className="flex items-center gap-2 md:hidden">
                    {user && (
                        <Link
                            to="/profile"
                            className="w-8 h-8 rounded-full ring-2 ring-[#71C9CE] overflow-hidden flex items-center justify-center bg-white shrink-0"
                        >
                            {user.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-4 h-4 text-[#71C9CE]" />
                            )}
                        </Link>
                    )}

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-xl bg-white/80 border border-[#A6E3E9] text-slate-700 hover:text-[#71C9CE] transition cursor-pointer"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

            </div>

            {/* 4. Mobile Dropdown Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-[#A6E3E9]/60 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                    {user ? (
                        <>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-xl text-sm font-semibold transition ${isActive(link.path)
                                            ? 'bg-[#CBF1F5] text-[#71C9CE]'
                                            : 'text-slate-700 hover:bg-[#E3FDFD]'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                to="/profile"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-[#E3FDFD]"
                            >
                                User Profile & Settings
                            </Link>
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    logout();
                                }}
                                className="w-full text-left flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </button>
                        </>
                    ) : (
                        <div className="pt-2">
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full py-3 rounded-xl bg-[#71C9CE] text-white font-semibold text-sm shadow-md text-center cursor-pointer"
                            >
                                Sign in with Google
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Navbar;
