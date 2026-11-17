import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, User as UserIcon, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const handleGoogleLogin = () => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        window.location.href = `${backendUrl}/api/auth/google`;
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Study Chat', path: '/chat' },
        { name: 'Quiz Generator', path: '/quiz' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-[#DDD0C8]">
            <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2 text-[#323232]">
                    <div className="w-8 h-8 rounded-md bg-[#323232] flex items-center justify-center text-[#DDD0C8]">
                        <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-base tracking-tight text-[#323232]">
                        StudyAI
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {user ? (
                        <>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-xs font-medium transition-colors ${
                                        isActive(link.path)
                                            ? 'text-[#323232] border-b-2 border-[#323232] pb-0.5'
                                            : 'text-[#555555] hover:text-[#323232]'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="flex items-center gap-3 pl-3 border-l border-[#DDD0C8]">
                                <Link
                                    to="/profile"
                                    className={`w-8 h-8 rounded-md border flex items-center justify-center bg-white ${
                                        isActive('/profile') ? 'border-[#323232]' : 'border-[#DDD0C8]'
                                    }`}
                                    title="Profile"
                                >
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-md" />
                                    ) : (
                                        <UserIcon className="w-4 h-4 text-[#323232]" />
                                    )}
                                </Link>

                                <button
                                    onClick={logout}
                                    title="Sign out"
                                    className="p-1.5 rounded-md text-[#555555] hover:text-[#323232] hover:bg-[#F4EFEB] transition"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <button
                            onClick={handleGoogleLogin}
                            className="text-xs font-medium px-4 py-2 rounded-md bg-[#323232] text-[#DDD0C8] hover:bg-[#1E1E1E] transition"
                        >
                            Sign in with Google
                        </button>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-2 md:hidden">
                    {user && (
                        <Link
                            to="/profile"
                            className="w-7 h-7 rounded-md border border-[#DDD0C8] flex items-center justify-center bg-white"
                        >
                            {user.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-md" />
                            ) : (
                                <UserIcon className="w-3.5 h-3.5 text-[#323232]" />
                            )}
                        </Link>
                    )}

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-1.5 rounded-md border border-[#DDD0C8] text-[#323232]"
                        aria-label="Toggle navigation"
                    >
                        {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>

            </div>

            {/* Mobile Dropdown Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-[#DDD0C8] bg-white px-4 py-3 space-y-1">
                    {user ? (
                        <>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-xs font-medium ${
                                        isActive(link.path)
                                            ? 'bg-[#F4EFEB] text-[#323232]'
                                            : 'text-[#555555] hover:bg-[#F4EFEB]'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                to="/profile"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-xs font-medium text-[#555555] hover:bg-[#F4EFEB]"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    logout();
                                }}
                                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-red-700 hover:bg-red-50"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Sign out</span>
                            </button>
                        </>
                    ) : (
                        <div className="pt-2">
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full py-2.5 rounded-md bg-[#323232] text-[#DDD0C8] text-xs font-medium"
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
