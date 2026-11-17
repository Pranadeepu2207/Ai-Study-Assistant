import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        window.location.href = `${backendUrl}/api/auth/google`;
    };

    return (
        <div className="min-h-screen w-full bg-[#F8F6F4] text-[#323232] flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center text-center">
                
                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight max-w-3xl leading-tight mb-4 text-[#323232]">
                    Structured Study Assistance and Automated Assessment
                </h1>

                <p className="text-sm sm:text-base text-[#555555] max-w-2xl font-normal leading-relaxed mb-8">
                    Review academic material through an interactive workspace and generate multiple-choice practice quizzes directly from study notes.
                </p>

                {/* Call-to-Action Buttons */}
                <div className="mb-16 w-full max-w-xs flex justify-center">
                    {user ? (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#323232] text-[#DDD0C8] hover:bg-[#1E1E1E] text-xs sm:text-sm font-medium transition cursor-pointer"
                        >
                            <span>Go to Dashboard</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#323232] text-[#DDD0C8] hover:bg-[#1E1E1E] text-xs sm:text-sm font-medium transition cursor-pointer"
                        >
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.35 24 12 24z" />
                                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.22 0 10.06 0 12s.47 3.78 1.29 5.42l3.99-3.15z" />
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                            </svg>
                            <span>Sign in with Google</span>
                        </button>
                    )}
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
                    
                    {/* Feature 1 */}
                    <div className="p-6 rounded-lg bg-white border border-[#DDD0C8]">
                        <div className="w-9 h-9 rounded-md bg-[#F4EFEB] text-[#323232] flex items-center justify-center mb-4">
                            <MessageSquare className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-semibold text-[#323232] mb-1.5">Interactive Study Chat</h2>
                        <p className="text-xs text-[#555555] leading-relaxed">
                            Submit coursework queries and receive structured, concept-level explanations for study revision.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-6 rounded-lg bg-white border border-[#DDD0C8]">
                        <div className="w-9 h-9 rounded-md bg-[#F4EFEB] text-[#323232] flex items-center justify-center mb-4">
                            <BookOpen className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-semibold text-[#323232] mb-1.5">Practice Quiz Generation</h2>
                        <p className="text-xs text-[#555555] leading-relaxed">
                            Convert notes into three-question multiple-choice evaluations with automated grading and explanations.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-6 rounded-lg bg-white border border-[#DDD0C8]">
                        <div className="w-9 h-9 rounded-md bg-[#F4EFEB] text-[#323232] flex items-center justify-center mb-4">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-semibold text-[#323232] mb-1.5">Session Persistence</h2>
                        <p className="text-xs text-[#555555] leading-relaxed">
                            Maintain conversation records and completed quiz evaluations under an authenticated user profile.
                        </p>
                    </div>

                </div>

            </main>

            {/* Clean Footer */}
            <footer className="w-full border-t border-[#DDD0C8] py-5 text-center text-xs text-[#555555] bg-white">
                StudyAI. All rights reserved.
            </footer>
        </div>
    );
};

export default LandingPage;
