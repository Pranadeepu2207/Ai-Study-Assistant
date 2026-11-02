import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axiosInstance from '../api/axiosInstance';
import { Sparkles, BookOpen, CheckCircle, XCircle, HelpCircle, Loader2, RotateCcw, Award } from 'lucide-react';

const QuizPage = () => {
    // Input Form State
    const [topic, setTopic] = useState('');
    const [studyText, setStudyText] = useState('');

    // Active Quiz State
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    // History State
    const [savedQuizzes, setSavedQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingHistory, setFetchingHistory] = useState(true);

    // 1. Fetch saved quizzes from MongoDB on component load
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setFetchingHistory(true);
                const response = await axiosInstance.get('/quiz');
                setSavedQuizzes(response.data.quizzes || []);
            } catch (error) {
                console.error('Failed to fetch saved quizzes:', error);
            } finally {
                setFetchingHistory(false);
            }
        };

        fetchQuizzes();
    }, []);

    // 2. Generate a new quiz via Gemini AI API
    const handleGenerateQuiz = async (e) => {
        e.preventDefault();

        if (!topic.trim() || !studyText.trim() || loading) return;

        try {
            setLoading(true);
            setActiveQuiz(null);
            setSelectedAnswers({});
            setSubmitted(false);

            const response = await axiosInstance.post('/quiz/generate', {
                topic: topic.trim(),
                studyText: studyText.trim(),
            });

            const newQuiz = response.data.quiz;
            setActiveQuiz(newQuiz);

            // Refresh saved quizzes list
            const updatedHistory = await axiosInstance.get('/quiz');
            setSavedQuizzes(updatedHistory.data.quizzes || []);
        } catch (error) {
            console.error('Quiz Generation Error:', error);
            alert('Failed to generate quiz. Please ensure your study text is clear and try again.');
        } finally {
            setLoading(false);
        }
    };

    // 3. Track user option selection
    const handleSelectOption = (questionIndex, option) => {
        if (submitted) return;

        setSelectedAnswers((prev) => ({
            ...prev,
            [questionIndex]: option,
        }));
    };

    // 4. Submit quiz and calculate score
    const handleSubmitQuiz = () => {
        if (!activeQuiz || submitted) return;

        let correctCount = 0;
        activeQuiz.questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.correctAnswer) {
                correctCount += 1;
            }
        });

        setScore(correctCount);
        setSubmitted(true);
    };

    // 5. Reset to generate another quiz
    const handleReset = () => {
        setActiveQuiz(null);
        setSelectedAnswers({});
        setSubmitted(false);
        setTopic('');
        setStudyText('');
    };

    return (
        <div className="min-h-screen w-full bg-[#E3FDFD] text-slate-800 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                
                {/* Header Title */}
                <header className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#A6E3E9] text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 text-[#71C9CE]" />
                        Practice & Assessment
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        AI Quiz Generator
                    </h1>
                    <p className="text-slate-600 mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base">
                        Transform raw notes or textbook text into interactive practice quizzes instantly!
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    
                    {/* Left Column (5 Cols): Quiz Input Form & Past Quizzes */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Generation Form Card */}
                        <section className="bg-white/90 backdrop-blur-sm border border-[#A6E3E9] rounded-3xl p-5 sm:p-7 shadow-sm">
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-5 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[#71C9CE]" />
                                Generate New Quiz
                            </h2>

                            <form onSubmit={handleGenerateQuiz} className="space-y-4">
                                <div>
                                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Study Topic
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Photosynthesis, React Hooks, World War II"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        disabled={loading}
                                        required
                                        className="w-full rounded-2xl border border-[#A6E3E9] bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-[#71C9CE] focus:ring-2 focus:ring-[#71C9CE]/25 outline-none transition disabled:opacity-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Study Text / Notes
                                    </label>
                                    <textarea
                                        rows={5}
                                        placeholder="Paste your study notes or article text here..."
                                        value={studyText}
                                        onChange={(e) => setStudyText(e.target.value)}
                                        disabled={loading}
                                        required
                                        className="w-full rounded-2xl border border-[#A6E3E9] bg-white p-3.5 sm:p-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-[#71C9CE] focus:ring-2 focus:ring-[#71C9CE]/25 outline-none transition resize-none disabled:opacity-50"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading || !topic.trim() || !studyText.trim()}
                                    className="w-full py-3 sm:py-3.5 px-6 rounded-2xl bg-[#71C9CE] hover:bg-[#5dbbc0] disabled:opacity-40 disabled:hover:bg-[#71C9CE] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#71C9CE]/25 hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                            <span>Generating Quiz with Gemini...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span>Generate 3-Question Quiz</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </section>

                        {/* Saved Quizzes History */}
                        <section className="bg-white/90 backdrop-blur-sm border border-[#A6E3E9] rounded-3xl p-5 sm:p-6 shadow-sm">
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3.5 flex items-center justify-between">
                                <span>Past Practice Quizzes</span>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#CBF1F5] text-[#71C9CE] font-bold">
                                    {savedQuizzes.length}
                                </span>
                            </h3>

                            {fetchingHistory ? (
                                <div className="flex items-center justify-center py-6 text-slate-400 gap-2 text-xs">
                                    <Loader2 className="w-4 h-4 animate-spin text-[#71C9CE]" />
                                    <span>Loading quiz history...</span>
                                </div>
                            ) : savedQuizzes.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-6">
                                    No past quizzes saved yet.
                                </p>
                            ) : (
                                <div className="space-y-2 max-h-60 sm:max-h-72 overflow-y-auto pr-1">
                                    {savedQuizzes.map((quiz) => (
                                        <div
                                            key={quiz._id}
                                            onClick={() => {
                                                setActiveQuiz(quiz);
                                                setSelectedAnswers({});
                                                setSubmitted(false);
                                            }}
                                            className="group p-3 sm:p-3.5 rounded-2xl bg-[#E3FDFD]/40 hover:bg-[#CBF1F5]/60 border border-[#A6E3E9]/60 hover:border-[#71C9CE] transition cursor-pointer flex items-center justify-between"
                                        >
                                            <div className="min-w-0 pr-2 sm:pr-3">
                                                <h4 className="font-semibold text-slate-800 text-xs sm:text-sm truncate group-hover:text-[#71C9CE] transition-colors">
                                                    {quiz.topic}
                                                </h4>
                                                <span className="text-[11px] text-slate-500">
                                                    {new Date(quiz.createdAt).toLocaleDateString()} • {quiz.questions?.length || 0} Qs
                                                </span>
                                            </div>
                                            <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-[#71C9CE] shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column (7 Cols): Active Interactive Quiz Display */}
                    <div className="lg:col-span-7">
                        {!activeQuiz ? (
                            <div className="bg-white/80 border border-dashed border-[#A6E3E9] rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[320px] sm:min-h-[420px]">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-[#CBF1F5] text-[#71C9CE] flex items-center justify-center mb-4">
                                    <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1.5">
                                    No Active Quiz Selected
                                </h3>
                                <p className="text-slate-500 text-xs sm:text-sm max-w-sm leading-relaxed">
                                    Fill in a topic and study notes on the left to generate questions, or click any past quiz to review it.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-5 sm:space-y-6">
                                
                                {/* Quiz Header Bar */}
                                <div className="bg-white/90 backdrop-blur-sm border border-[#A6E3E9] rounded-3xl p-5 sm:p-6 shadow-sm flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="text-[11px] font-bold text-[#71C9CE] uppercase tracking-wider mb-0.5">
                                            Active Quiz
                                        </div>
                                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                                            {activeQuiz.topic}
                                        </h2>
                                        <p className="text-[11px] sm:text-xs text-slate-500">
                                            {activeQuiz.questions.length} Multiple Choice Questions
                                        </p>
                                    </div>
                                    <button 
                                        onClick={handleReset}
                                        className="px-3.5 py-2 rounded-xl border border-[#A6E3E9] hover:bg-[#CBF1F5]/40 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5 text-[#71C9CE]" />
                                        <span>New</span>
                                    </button>
                                </div>

                                {/* Score Summary Card */}
                                {submitted && (
                                    <div className="bg-gradient-to-br from-white to-[#CBF1F5]/70 border-2 border-[#71C9CE] rounded-3xl p-5 sm:p-6 text-center shadow-md animate-in fade-in zoom-in-95 duration-300">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#CBF1F5] text-[#71C9CE] mx-auto flex items-center justify-center mb-2.5 shadow-xs">
                                            <Award className="w-6 h-6 sm:w-7 sm:h-7" />
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
                                            Quiz Complete! 🎉
                                        </h3>
                                        <p className="text-sm sm:text-base text-slate-700 font-medium">
                                            You scored <span className="font-bold text-[#71C9CE]">{score}</span> out of {activeQuiz.questions.length} (
                                            {Math.round((score / activeQuiz.questions.length) * 100)}%)
                                        </p>
                                    </div>
                                )}

                                {/* Questions List */}
                                <div className="space-y-4 sm:space-y-6">
                                    {activeQuiz.questions.map((q, qIndex) => (
                                        <div 
                                            key={qIndex}
                                            className="bg-white/95 backdrop-blur-sm border border-[#A6E3E9] rounded-3xl p-5 sm:p-7 shadow-sm"
                                        >
                                            <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-3.5 leading-relaxed">
                                                <span className="text-[#71C9CE] mr-2">Q{qIndex + 1}.</span>
                                                {q.questionText}
                                            </h4>

                                            {/* Multiple Choice Options */}
                                            <div className="space-y-2 sm:space-y-2.5">
                                                {q.options.map((option, oIndex) => {
                                                    const isSelected = selectedAnswers[qIndex] === option;
                                                    const isCorrect = option === q.correctAnswer;

                                                    let buttonStyle = 'bg-[#E3FDFD]/30 border-[#A6E3E9]/80 text-slate-700 hover:border-[#71C9CE] hover:bg-white';
                                                    if (!submitted && isSelected) {
                                                        buttonStyle = 'bg-[#CBF1F5] border-2 border-[#71C9CE] text-slate-900 font-bold shadow-xs';
                                                    } else if (submitted) {
                                                        if (isCorrect) {
                                                            buttonStyle = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-900 font-bold';
                                                        } else if (isSelected && !isCorrect) {
                                                            buttonStyle = 'bg-rose-50 border-2 border-rose-400 text-rose-900 font-bold';
                                                        } else {
                                                            buttonStyle = 'opacity-50 border-slate-200 text-slate-500';
                                                        }
                                                    }

                                                    return (
                                                        <button
                                                            key={oIndex}
                                                            type="button"
                                                            onClick={() => handleSelectOption(qIndex, option)}
                                                            disabled={submitted}
                                                            className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer disabled:cursor-default ${buttonStyle}`}
                                                        >
                                                            <span className="pr-3 leading-snug break-words">{option}</span>
                                                            {submitted && isCorrect && (
                                                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                                                            )}
                                                            {submitted && isSelected && !isCorrect && (
                                                                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 shrink-0" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Explanation Box */}
                                            {submitted && q.explanation && (
                                                <div className="mt-3.5 sm:mt-4 p-3.5 sm:p-4 rounded-2xl bg-[#CBF1F5]/50 border border-[#A6E3E9] text-xs text-slate-700 leading-relaxed">
                                                    <strong className="text-[#71C9CE] block mb-1 uppercase tracking-wider font-bold">
                                                        💡 Explanation:
                                                    </strong> 
                                                    {q.explanation}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Submit Quiz Button */}
                                {!submitted && (
                                    <div className="pt-2">
                                        <button
                                            onClick={handleSubmitQuiz}
                                            disabled={Object.keys(selectedAnswers).length < activeQuiz.questions.length}
                                            className="w-full py-3.5 sm:py-4 rounded-2xl bg-[#71C9CE] hover:bg-[#5dbbc0] disabled:opacity-40 disabled:hover:bg-[#71C9CE] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#71C9CE]/25 hover:shadow-xl transition-all cursor-pointer disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                                        >
                                            Submit Quiz & View Score
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QuizPage;
