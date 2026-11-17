import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { User, Mail, Shield, LogOut, Clock, HelpCircle, ArrowLeft, Key } from 'lucide-react';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalChats: 0,
        totalQuizzes: 0,
    });
    const [loading, setLoading] = useState(true);

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
        <div className="min-h-screen w-full bg-[#F8F6F4] text-[#323232] flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
                {/* Header Navigation */}
                <header className="mb-6 sm:mb-8">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#555555] hover:text-[#323232] transition mb-3 cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Dashboard</span>
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-[#323232] tracking-tight">
                        Account Settings
                    </h1>
                    <p className="text-[#555555] mt-1 text-sm">
                        View profile details, account credentials, and overall study statistics.
                    </p>
                </header>

                <div className="space-y-4 sm:space-y-6">
                    {/* Main Profile Info Card */}
                    <section className="bg-white border border-[#DDD0C8] rounded-lg p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
                            {/* User Avatar */}
                            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-md border border-[#DDD0C8] overflow-hidden flex items-center justify-center bg-[#F4EFEB] text-[#323232] shrink-0">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8" />
                                )}
                            </div>

                            {/* User Details */}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg sm:text-xl font-semibold text-[#323232] mb-0.5 truncate">
                                    {user?.displayName || 'Student User'}
                                </h2>
                                <p className="text-[#555555] text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1.5 mb-2.5 truncate">
                                    <Mail className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate">{user?.email || 'No email provided'}</span>
                                </p>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F4EFEB] border border-[#DDD0C8] text-[#323232] text-xs font-medium">
                                    <Shield className="w-3 h-3 shrink-0" />
                                    <span>Authenticated via Google OAuth 2.0</span>
                                </div>
                            </div>
                        </div>

                        {/* Database User ID */}
                        <div className="mt-6 pt-4 border-t border-[#DDD0C8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-1.5 text-[#555555] font-medium">
                                <Key className="w-3.5 h-3.5 text-[#323232] shrink-0" />
                                <span>MongoDB Account ID</span>
                            </div>
                            <code className="px-2.5 py-1 rounded-md bg-[#F4EFEB] text-[#323232] font-mono text-xs border border-[#DDD0C8] break-all sm:break-normal">
                                {user?._id || 'Unavailable'}
                            </code>
                        </div>
                    </section>

                    {/* Account Activity Summary Metrics */}
                    <section className="bg-white border border-[#DDD0C8] rounded-lg p-5 sm:p-6">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#555555] mb-3.5">
                            Activity Overview
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {/* Metric 1 */}
                            <div className="p-4 rounded-md bg-[#F8F6F4] border border-[#DDD0C8] flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-md bg-[#F4EFEB] text-[#323232] flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xl font-semibold text-[#323232]">
                                        {loading ? '...' : stats.totalChats}
                                    </div>
                                    <p className="text-xs text-[#555555] mt-0.5">
                                        Chat Sessions
                                    </p>
                                </div>
                            </div>

                            {/* Metric 2 */}
                            <div className="p-4 rounded-md bg-[#F8F6F4] border border-[#DDD0C8] flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-md bg-[#F4EFEB] text-[#323232] flex items-center justify-center shrink-0">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xl font-semibold text-[#323232]">
                                        {loading ? '...' : stats.totalQuizzes}
                                    </div>
                                    <p className="text-xs text-[#555555] mt-0.5">
                                        Quizzes Generated
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Session Controls */}
                    <section className="bg-white border border-[#DDD0C8] rounded-lg p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-semibold text-[#323232]">Session Management</h3>
                                <p className="text-xs text-[#555555] mt-0.5">
                                    Sign out of your active session on this device.
                                </p>
                            </div>

                            <button 
                                onClick={handleLogout}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-white hover:bg-red-50 text-red-700 border border-red-300 font-medium text-xs transition cursor-pointer"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
