import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { MessageSquare, BookOpen, Clock, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // State management for MongoDB activity history
    const [chats, setChats] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch past study chats and practice quizzes in parallel
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                const [chatRes, quizRes] = await Promise.all([
                    axiosInstance.get('/chat'),
                    axiosInstance.get('/quiz'),
                ]);

                setChats(chatRes.data.chats || []);
                setQuizzes(quizRes.data.quizzes || []);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load activity history from server.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="min-h-screen w-full bg-[#E3FDFD] text-slate-800 flex flex-col">
            {/* Top Navigation Bar */}
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                
                {/* 1. Welcome Banner Header */}
                <header className="mb-8 sm:mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#A6E3E9] text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-[#71C9CE] animate-pulse" />
                        Student Workspace
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Welcome back, <span className="text-[#71C9CE]">{user?.displayName?.split(' ')[0] || 'Student'}</span>! 👋
                    </h1>
                    <p className="text-slate-600 mt-1.5 sm:mt-2 text-sm sm:text-base md:text-lg">
                        What would you like to study or generate today?
                    </p>
                </header>

                {/* 2. Quick Action Cards (Grid: 1 col on mobile, 2 cols on tablet+) */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12">
                    
                    {/* Action Card A: AI Study Chat */}
                    <div 
                        onClick={() => navigate('/chat')}
                        className="group bg-white/90 backdrop-blur-sm border border-[#A6E3E9] hover:border-[#71C9CE] rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-md hover:shadow-[#71C9CE]/20 transition-all duration-300 cursor-pointer hover:-translate-y-1 flex items-start justify-between"
                    >
                        <div className="flex-1 pr-3 sm:pr-4">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#CBF1F5] text-[#71C9CE] flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#71C9CE] transition-colors">
                                AI Study Chat
                            </h3>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                Start an interactive session with Google Gemini AI to ask questions, solve doubts, and get simple explanations.
                            </p>
                        </div>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#CBF1F5]/60 text-[#71C9CE] flex items-center justify-center self-center shrink-0 group-hover:bg-[#71C9CE] group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>

                    {/* Action Card B: Quiz Generator */}
                    <div 
                        onClick={() => navigate('/quiz')}
                        className="group bg-white/90 backdrop-blur-sm border border-[#A6E3E9] hover:border-[#71C9CE] rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-md hover:shadow-[#71C9CE]/20 transition-all duration-300 cursor-pointer hover:-translate-y-1 flex items-start justify-between"
                    >
                        <div className="flex-1 pr-3 sm:pr-4">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#CBF1F5] text-[#71C9CE] flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#71C9CE] transition-colors">
                                Generate Quiz
                            </h3>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                Paste study notes or textbook excerpts to instantly generate custom multiple-choice quizzes with answer keys.
                            </p>
                        </div>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#CBF1F5]/60 text-[#71C9CE] flex items-center justify-center self-center shrink-0 group-hover:bg-[#71C9CE] group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>

                </section>

                {/* 3. Data History Section */}
                {loading ? (
                    <div className="bg-white/70 border border-[#A6E3E9] rounded-3xl p-10 sm:p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 rounded-full border-4 border-[#A6E3E9] border-t-[#71C9CE] animate-spin mb-4" />
                        <p className="text-slate-600 font-medium text-sm">Loading your study activity...</p>
                    </div>
                ) : error ? (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 sm:px-6 py-4 rounded-2xl text-sm font-medium">
                        {error}
                    </div>
                ) : (
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        
                        {/* Recent AI Study Chats */}
                        <div className="bg-white/90 backdrop-blur-sm border border-[#A6E3E9] rounded-3xl p-5 sm:p-7 shadow-xs">
                            <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-[#CBF1F5]">
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-[#71C9CE]" /> 
                                    Recent Study Chats
                                </h2>
                                <span className="px-2.5 py-0.5 rounded-full bg-[#CBF1F5] text-[#71C9CE] text-xs font-bold">
                                    {chats.length}
                                </span>
                            </div>

                            {chats.length === 0 ? (
                                <div className="text-center py-8 sm:py-10 px-4 border border-dashed border-[#A6E3E9] rounded-2xl bg-[#E3FDFD]/30">
                                    <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-[#71C9CE]/60 mx-auto mb-2.5" />
                                    <p className="text-slate-600 text-xs sm:text-sm font-medium">No past study chats yet.</p>
                                    <p className="text-slate-400 text-xs mt-1">Click above to start your first session!</p>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {chats.slice(0, 5).map((chat) => (
                                        <div
                                            key={chat._id}
                                            onClick={() => navigate('/chat', { state: { chatId: chat._id } })}
                                            className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#E3FDFD]/40 hover:bg-[#CBF1F5]/60 border border-[#A6E3E9]/50 hover:border-[#71C9CE] transition-all cursor-pointer"
                                        >
                                            <div className="flex-1 min-w-0 pr-3">
                                                <h4 className="font-semibold text-slate-800 text-xs sm:text-sm truncate group-hover:text-[#71C9CE] transition-colors">
                                                    {chat.title || 'Study Session'}
                                                </h4>
                                                <span className="text-[11px] sm:text-xs text-slate-500 mt-0.5 block">
                                                    {new Date(chat.updatedAt).toLocaleDateString()} • {chat.messages?.length || 0} messages
                                                </span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#71C9CE] group-hover:translate-x-0.5 transition-all shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Saved Practice Quizzes */}
                        <div className="bg-white/90 backdrop-blur-sm border border-[#A6E3E9] rounded-3xl p-5 sm:p-7 shadow-xs">
                            <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-[#CBF1F5]">
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-[#71C9CE]" /> 
                                    Saved Practice Quizzes
                                </h2>
                                <span className="px-2.5 py-0.5 rounded-full bg-[#CBF1F5] text-[#71C9CE] text-xs font-bold">
                                    {quizzes.length}
                                </span>
                            </div>

                            {quizzes.length === 0 ? (
                                <div className="text-center py-8 sm:py-10 px-4 border border-dashed border-[#A6E3E9] rounded-2xl bg-[#E3FDFD]/30">
                                    <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-[#71C9CE]/60 mx-auto mb-2.5" />
                                    <p className="text-slate-600 text-xs sm:text-sm font-medium">No quizzes generated yet.</p>
                                    <p className="text-slate-400 text-xs mt-1">Paste study notes above to generate one!</p>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {quizzes.slice(0, 5).map((quiz) => (
                                        <div 
                                            key={quiz._id}
                                            className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#E3FDFD]/40 border border-[#A6E3E9]/50"
                                        >
                                            <div className="flex-1 min-w-0 pr-3">
                                                <h4 className="font-semibold text-slate-800 text-xs sm:text-sm truncate">
                                                    {quiz.topic}
                                                </h4>
                                                <span className="text-[11px] sm:text-xs text-slate-500 mt-0.5 block">
                                                    {new Date(quiz.createdAt).toLocaleDateString()} • {quiz.questions?.length || 0} Questions
                                                </span>
                                            </div>
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#CBF1F5] text-[#71C9CE] shrink-0">
                                                {quiz.questions?.length || 0} Qs
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </section>
                )}

            </main>
        </div>
    );
};

export default Dashboard;
