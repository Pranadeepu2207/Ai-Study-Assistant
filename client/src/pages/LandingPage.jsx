import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Sparkles, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        window.location.href = `${backendUrl}/api/auth/google`;
    };

    return (
        <div className="min-h-screen w-full bg-[#E3FDFD] text-slate-800 flex flex-col">
            <Navbar />

            {/* Hero Section Container */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-28 flex flex-col items-center text-center relative">

                {/* Background decorative soft ambient glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[550px] h-[250px] sm:h-[350px] bg-[#A6E3E9]/40 blur-[90px] sm:blur-[130px] rounded-full pointer-events-none" />
                <div className="absolute top-1/3 left-1/3 w-[220px] sm:w-[350px] h-[180px] sm:h-[250px] bg-[#CBF1F5]/60 blur-[70px] sm:blur-[100px] rounded-full pointer-events-none" />

                {/* Top Feature Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/80 border border-[#A6E3E9] text-slate-700 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 backdrop-blur-sm shadow-xs hover:border-[#71C9CE] transition">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#71C9CE] shrink-0" />
                    <span>Powered by Google Gemini 2.5 AI & MERN Stack</span>
                </div>

                {/* Hero Headline */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.2] sm:leading-[1.15] mb-5 sm:mb-6 text-slate-900 px-2">
                    Master Any Subject Faster with Your Personal{' '}
                    <span className="text-[#71C9CE] underline decoration-[#A6E3E9] decoration-wavy decoration-2 underline-offset-6 sm:underline-offset-8">
                        AI Study Assistant
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed mb-8 sm:mb-10 px-4">
                    Ask complex questions, summarize notes instantly, and auto-generate multiple-choice practice quizzes from your study materials.
                </p>

                {/* Call-to-Action Buttons */}
                <div className="mb-14 sm:mb-20 w-full max-w-sm sm:max-w-none flex justify-center px-4">
                    {user ? (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[#71C9CE] hover:bg-[#5dbbc0] text-white font-bold text-base sm:text-lg shadow-lg shadow-[#71C9CE]/30 hover:shadow-[#71C9CE]/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        >
                            <span>Go to Your Dashboard</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base sm:text-lg shadow-lg shadow-[#71C9CE]/15 hover:shadow-[#71C9CE]/25 transition-all hover:scale-105 active:scale-95 border border-[#A6E3E9] cursor-pointer"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.35 24 12 24z" />
                                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.22 0 10.06 0 12s.47 3.78 1.29 5.42l3.99-3.15z" />
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                            </svg>
                            <span>Get Started with Google</span>
                        </button>
                    )}
                </div>

                {/* Feature Cards Grid (1 col on mobile, 3 cols on desktop) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 w-full text-left">

                    {/* Card 1: AI Chat */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-sm border border-[#A6E3E9] hover:border-[#71C9CE] shadow-sm hover:shadow-md hover:shadow-[#71C9CE]/15 transition-all duration-300 group hover:-translate-y-1">
                        <div className="w-12 h-12 rounded-2xl bg-[#CBF1F5] text-[#71C9CE] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Interactive AI Chat</h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            Ask Gemini AI about tough study topics and get step-by-step explanations tailored to your learning style.
                        </p>
                    </div>

                    {/* Card 2: Quiz Generator */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-sm border border-[#A6E3E9] hover:border-[#71C9CE] shadow-sm hover:shadow-md hover:shadow-[#71C9CE]/15 transition-all duration-300 group hover:-translate-y-1">
                        <div className="w-12 h-12 rounded-2xl bg-[#CBF1F5] text-[#71C9CE] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Auto Quiz Generator</h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            Paste your raw notes or textbook text to generate 3-question multiple-choice quizzes with detailed answer keys.
                        </p>
                    </div>

                    {/* Card 3: OAuth & History */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-sm border border-[#A6E3E9] hover:border-[#71C9CE] shadow-sm hover:shadow-md hover:shadow-[#71C9CE]/15 transition-all duration-300 group hover:-translate-y-1">
                        <div className="w-12 h-12 rounded-2xl bg-[#CBF1F5] text-[#71C9CE] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Secure OAuth & History</h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            Log in safely with Google OAuth 2.0. All your chat history and practice quizzes are saved securely in MongoDB.
                        </p>
                    </div>

                </div>

            </main>

            {/* Clean Structured Footer */}
            <footer className="w-full border-t border-[#A6E3E9]/60 py-6 text-center text-xs text-slate-500 bg-[#CBF1F5]/30">
                Built with MERN Stack, Google OAuth 2.0 & Gemini AI
            </footer>
        </div>
    );
};

export default LandingPage;
