import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { User, Mail, Shield, LogOut, Clock, Sparkles, ArrowLeft, Key } from 'lucide-react';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // State to calculate total account activity stats
    const [stats, setStats] = useState({
        totalChats: 0,
        totalQuizzes: 0,
    });
    const [loading, setLoading] = useState(true);

    // Fetch metrics asynchronously from backend
    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                setLoading(true);

                const [chatRes, quizRes] = await Promise.all([
                    axiosInstance.get('/chat'),
                    axiosInstance.get('/quiz'),
                ]);

                setStats({
                    totalChats: chatRes.data.chats?.length || 0,
                    totalQuizzes: quizRes.data.quizzes?.length || 0,
                });
            } catch (error) {
                console.error('Error fetching account statistics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserStats();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    return (
        <div className="min-h-screen w-full bg-[#E3FDFD] text-slate-800 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Top Header Navigation */}
                <header className="mb-6 sm:mb-8">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#71C9CE] transition mb-3 sm:mb-4 cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </button>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        User Profile & Account
                    </h1>
                    <p className="text-slate-600 mt-1 text-xs sm:text-sm md:text-base">
                        Manage your account credentials, view study metrics, and handle session controls.
                    </p>
                </header>

                <div className="space-y-4 sm:space-y-6">
                    {/* Main Profile Info Card */}
                    <section className="bg-white/90 backdrop-blur-sm border border-[#A6E3E9] rounded-3xl p-5 sm:p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
                            {/* User Avatar */}
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-[#71C9CE]/30 overflow-hidden flex items-center justify-center bg-[#CBF1F5] text-[#71C9CE] shrink-0 shadow-sm">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10" />
                                )}
                            </div>

                            {/* User Details */}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 truncate">
                                    {user?.displayName || 'Student User'}
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mb-3 truncate">
                                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span className="truncate">{user?.email || 'No email provided'}</span>
                                </p>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CBF1F5] text-[#71C9CE] text-[11px] sm:text-xs font-semibold">
                                    <Shield className="w-3.5 h-3.5 shrink-0" />
                                    <span>Authenticated via Google OAuth 2.0</span>
                                </div>
                            </div>
                        </div>

                        {/* Database User ID Details */}
                        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#A6E3E9]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 text-slate-500 font-semibold">
                                <Key className="w-4 h-4 text-[#71C9CE] shrink-0" />
                                <span>MongoDB User ID</span>
                            </div>
                            <code className="px-3 py-1.5 rounded-xl bg-[#E3FDFD] text-slate-700 font-mono text-[11px] sm:text-xs border border-[#A6E3E9]/60 break-all sm:break-normal">
                                {user?._id || 'Unavailable'}
                            </code>
                        </div>
                    </section>

                    {/* Account Activity Summary Metrics */}
                    <section className="bg-white/90 backdrop-blur-sm border border-[#A6E3E9] rounded-3xl p-5 sm:p-8 shadow-sm">
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                            Study Activity Overview
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                            {/* Metric Card 1: Chat Sessions */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#E3FDFD]/40 border border-[#A6E3E9]/60 flex items-center gap-3.5 sm:gap-4">
                                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#CBF1F5] text-[#71C9CE] flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
                                        {loading ? '...' : stats.totalChats}
                                    </div>
                                    <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5">
                                        AI Study Chat Sessions
                                    </p>
                                </div>
                            </div>

                            {/* Metric Card 2: Quizzes Generated */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#E3FDFD]/40 border border-[#A6E3E9]/60 flex items-center gap-3.5 sm:gap-4">
                                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#CBF1F5] text-[#71C9CE] flex items-center justify-center shrink-0">
                                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
                                        {loading ? '...' : stats.totalQuizzes}
                                    </div>
                                    <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5">
                                        Practice Quizzes Generated
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Session Controls */}
                    <section className="bg-white/90 backdrop-blur-sm border border-rose-200/80 rounded-3xl p-5 sm:p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-slate-900">Session Controls</h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Sign out of your active Google session and invalidate your local token.
                                </p>
                            </div>

                            <button 
                                onClick={handleLogout}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out of Account</span>
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
