import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { MessageSquare, BookOpen, Clock, ArrowRight, HelpCircle, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [chats, setChats] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        <div className="min-h-screen w-full bg-[#F8F6F4] text-[#323232] flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
                {/* Header */}
                <header className="mb-8">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F4EFEB] border border-[#DDD0C8] text-xs font-medium text-[#555555] mb-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#323232]" />
                        Workspace
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-[#323232] tracking-tight">
                        Welcome, {user?.displayName?.split(' ')[0] || 'Student'}
                    </h1>
                    <p className="text-[#555555] mt-1 text-sm">
                        Access your interactive study chats and practice quizzes.
                    </p>
                </header>

                {/* Action Cards */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10">
                    {/* Action Card A: AI Study Chat */}
                    <div 
                        onClick={() => navigate('/chat')}
                        className="group bg-white border border-[#DDD0C8] hover:border-[#323232] rounded-lg p-5 sm:p-6 transition cursor-pointer flex items-start justify-between"
                    >
                        <div className="flex-1 pr-4">
                            <div className="w-10 h-10 rounded-md bg-[#F4EFEB] text-[#323232] flex items-center justify-center mb-4">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <h2 className="text-base sm:text-lg font-semibold text-[#323232] mb-1">
                                Study Chat
                            </h2>
                            <p className="text-[#555555] text-xs sm:text-sm leading-relaxed">
                                Start an interactive session to clarify concepts, break down complex topics, and review material.
                            </p>
                        </div>
                        <div className="w-8 h-8 rounded-md bg-[#F4EFEB] text-[#323232] flex items-center justify-center self-center shrink-0 group-hover:bg-[#323232] group-hover:text-[#DDD0C8] transition">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Action Card B: Quiz Generator */}
                    <div 
                        onClick={() => navigate('/quiz')}
                        className="group bg-white border border-[#DDD0C8] hover:border-[#323232] rounded-lg p-5 sm:p-6 transition cursor-pointer flex items-start justify-between"
                    >
                        <div className="flex-1 pr-4">
                            <div className="w-10 h-10 rounded-md bg-[#F4EFEB] text-[#323232] flex items-center justify-center mb-4">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <h2 className="text-base sm:text-lg font-semibold text-[#323232] mb-1">
                                Quiz Generator
                            </h2>
                            <p className="text-[#555555] text-xs sm:text-sm leading-relaxed">
                                Convert raw notes or syllabus sections into multiple-choice practice tests with explanations.
                            </p>
                        </div>
                        <div className="w-8 h-8 rounded-md bg-[#F4EFEB] text-[#323232] flex items-center justify-center self-center shrink-0 group-hover:bg-[#323232] group-hover:text-[#DDD0C8] transition">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </section>

                {/* History Section */}
                {loading ? (
                    <div className="bg-white border border-[#DDD0C8] rounded-lg p-10 flex flex-col items-center justify-center text-center">
                        <div className="w-8 h-8 rounded-full border-2 border-[#DDD0C8] border-t-[#323232] animate-spin mb-3" />
                        <p className="text-[#555555] text-xs font-medium">Loading activity history...</p>
                    </div>
                ) : error ? (
                    <div className="bg-[#F4EFEB] border border-red-300 text-red-700 px-4 py-3 rounded-md text-xs font-medium">
                        {error}
                    </div>
                ) : (
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Study Chats */}
                        <div className="bg-white border border-[#DDD0C8] rounded-lg p-5">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DDD0C8]">
                                <h3 className="text-sm font-semibold text-[#323232] flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-[#555555]" /> 
                                    Recent Study Chats
                                </h3>
                                <span className="px-2 py-0.5 rounded-md bg-[#F4EFEB] text-[#323232] text-xs font-medium">
                                    {chats.length}
                                </span>
                            </div>

                            {chats.length === 0 ? (
                                <div className="text-center py-8 px-4 border border-dashed border-[#DDD0C8] rounded-md bg-[#F8F6F4]">
                                    <MessageSquare className="w-6 h-6 text-[#555555] mx-auto mb-2" />
                                    <p className="text-[#555555] text-xs font-medium">No past study chats recorded.</p>
                                    <p className="text-[#555555]/70 text-[11px] mt-0.5">Start a new chat to begin.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {chats.slice(0, 5).map((chat) => (
                                        <div
                                            key={chat._id}
                                            onClick={() => navigate('/chat', { state: { chatId: chat._id } })}
                                            className="group flex items-center justify-between p-3 rounded-md bg-[#F8F6F4] hover:bg-[#F4EFEB] border border-[#DDD0C8] transition cursor-pointer"
                                        >
                                            <div className="flex-1 min-w-0 pr-3">
                                                <h4 className="font-medium text-[#323232] text-xs truncate">
                                                    {chat.title || 'Study Session'}
                                                </h4>
                                                <span className="text-[11px] text-[#555555] mt-0.5 block">
                                                    {new Date(chat.updatedAt).toLocaleDateString()} | {chat.messages?.length || 0} messages
                                                </span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-[#555555] group-hover:text-[#323232] group-hover:translate-x-0.5 transition shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Saved Practice Quizzes */}
                        <div className="bg-white border border-[#DDD0C8] rounded-lg p-5">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DDD0C8]">
                                <h3 className="text-sm font-semibold text-[#323232] flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4 text-[#555555]" /> 
                                    Saved Quizzes
                                </h3>
                                <span className="px-2 py-0.5 rounded-md bg-[#F4EFEB] text-[#323232] text-xs font-medium">
                                    {quizzes.length}
                                </span>
                            </div>

                            {quizzes.length === 0 ? (
                                <div className="text-center py-8 px-4 border border-dashed border-[#DDD0C8] rounded-md bg-[#F8F6F4]">
                                    <BookOpen className="w-6 h-6 text-[#555555] mx-auto mb-2" />
                                    <p className="text-[#555555] text-xs font-medium">No quizzes generated yet.</p>
                                    <p className="text-[#555555]/70 text-[11px] mt-0.5">Enter notes on the quiz page to generate one.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {quizzes.slice(0, 5).map((quiz) => (
                                        <div 
                                            key={quiz._id}
                                            onClick={() => navigate('/quiz')}
                                            className="group flex items-center justify-between p-3 rounded-md bg-[#F8F6F4] hover:bg-[#F4EFEB] border border-[#DDD0C8] transition cursor-pointer"
                                        >
                                            <div className="flex-1 min-w-0 pr-3">
                                                <h4 className="font-medium text-[#323232] text-xs truncate">
                                                    {quiz.topic}
                                                </h4>
                                                <span className="text-[11px] text-[#555555] mt-0.5 block">
                                                    {new Date(quiz.createdAt).toLocaleDateString()} | {quiz.questions?.length || 0} Questions
                                                </span>
                                            </div>
                                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#F4EFEB] text-[#323232] border border-[#DDD0C8] shrink-0">
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
