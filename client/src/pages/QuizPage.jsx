import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axiosInstance from '../api/axiosInstance';
import { BookOpen, CheckCircle, XCircle, HelpCircle, Loader2, RotateCcw, Award } from 'lucide-react';

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
        <div className="min-h-screen w-full bg-[#F8F6F4] text-[#323232] flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
                {/* Header */}
                <header className="mb-8">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F4EFEB] border border-[#DDD0C8] text-xs font-medium text-[#555555] mb-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#323232]" />
                        Assessment
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-[#323232] tracking-tight">
                        Quiz Generator
                    </h1>
                    <p className="text-[#555555] mt-1 text-sm">
                        Create multiple-choice practice assessments from source notes and text.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column (5 Cols): Quiz Input Form & Past Quizzes */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Generation Form Card */}
                        <section className="bg-white border border-[#DDD0C8] rounded-lg p-5 sm:p-6">
                            <h2 className="text-sm font-semibold text-[#323232] mb-4 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-[#555555]" />
                                Create New Quiz
                            </h2>

                            <form onSubmit={handleGenerateQuiz} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#555555] mb-1.5">
                                        Topic
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Operating Systems, Thermodynamics"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        disabled={loading}
                                        required
                                        className="w-full rounded-md border border-[#DDD0C8] bg-white px-3 py-2 text-xs sm:text-sm text-[#323232] placeholder-[#555555]/60 focus:border-[#323232] outline-none transition disabled:opacity-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#555555] mb-1.5">
                                        Source Notes or Text
                                    </label>
                                    <textarea
                                        rows={5}
                                        placeholder="Paste study notes or reading excerpt here..."
                                        value={studyText}
                                        onChange={(e) => setStudyText(e.target.value)}
                                        disabled={loading}
                                        required
                                        className="w-full rounded-md border border-[#DDD0C8] bg-white p-3 text-xs sm:text-sm text-[#323232] placeholder-[#555555]/60 focus:border-[#323232] outline-none transition resize-none disabled:opacity-50"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading || !topic.trim() || !studyText.trim()}
                                    className="w-full py-2.5 px-4 rounded-md bg-[#323232] hover:bg-[#1E1E1E] disabled:opacity-40 text-[#DDD0C8] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-[#DDD0C8]" />
                                            <span>Generating Quiz...</span>
                                        </>
                                    ) : (
                                        <>
                                            <BookOpen className="w-4 h-4" />
                                            <span>Generate 3-Question Quiz</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </section>

                        {/* Saved Quizzes History */}
                        <section className="bg-white border border-[#DDD0C8] rounded-lg p-5">
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#DDD0C8]">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#555555]">
                                    Past Quizzes
                                </h3>
                                <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#F4EFEB] text-[#323232] font-medium">
                                    {savedQuizzes.length}
                                </span>
                            </div>

                            {fetchingHistory ? (
                                <div className="flex items-center justify-center py-6 text-[#555555] gap-2 text-xs">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#323232]" />
                                    <span>Loading quiz history...</span>
                                </div>
                            ) : savedQuizzes.length === 0 ? (
                                <p className="text-xs text-[#555555] text-center py-4">
                                    No past quizzes saved.
                                </p>
                            ) : (
                                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                                    {savedQuizzes.map((quiz) => (
                                        <div
                                            key={quiz._id}
                                            onClick={() => {
                                                setActiveQuiz(quiz);
                                                setSelectedAnswers({});
                                                setSubmitted(false);
                                            }}
                                            className="group p-2.5 rounded-md bg-[#F8F6F4] hover:bg-[#F4EFEB] border border-[#DDD0C8] transition cursor-pointer flex items-center justify-between"
                                        >
                                            <div className="min-w-0 pr-2">
                                                <h4 className="font-medium text-[#323232] text-xs truncate">
                                                    {quiz.topic}
                                                </h4>
                                                <span className="text-[11px] text-[#555555]">
                                                    {new Date(quiz.createdAt).toLocaleDateString()} | {quiz.questions?.length || 0} Qs
                                                </span>
                                            </div>
                                            <BookOpen className="w-3.5 h-3.5 text-[#555555] group-hover:text-[#323232] shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column (7 Cols): Active Quiz */}
                    <div className="lg:col-span-7">
                        {!activeQuiz ? (
                            <div className="bg-white border border-dashed border-[#DDD0C8] rounded-lg p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[320px]">
                                <div className="w-10 h-10 rounded-md bg-[#F4EFEB] text-[#323232] flex items-center justify-center mb-3">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-semibold text-[#323232] mb-1">
                                    No Active Quiz Selected
                                </h3>
                                <p className="text-[#555555] text-xs max-w-sm leading-relaxed">
                                    Generate questions using the form on the left, or select an existing quiz from history.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Quiz Header Bar */}
                                <div className="bg-white border border-[#DDD0C8] rounded-lg p-4 sm:p-5 flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="text-[11px] font-medium text-[#555555] uppercase tracking-wider mb-0.5">
                                            Active Quiz
                                        </div>
                                        <h2 className="text-base sm:text-lg font-semibold text-[#323232] truncate">
                                            {activeQuiz.topic}
                                        </h2>
                                        <p className="text-[11px] text-[#555555]">
                                            {activeQuiz.questions.length} Questions
                                        </p>
                                    </div>
                                    <button 
                                        onClick={handleReset}
                                        className="px-3 py-1.5 rounded-md border border-[#DDD0C8] hover:bg-[#F4EFEB] text-[#323232] text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shrink-0"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Reset</span>
                                    </button>
                                </div>

                                {/* Score Summary Card */}
                                {submitted && (
                                    <div className="bg-[#F4EFEB] border border-[#323232] rounded-lg p-4 sm:p-5 text-center">
                                        <div className="w-10 h-10 rounded-md bg-[#323232] text-[#DDD0C8] mx-auto flex items-center justify-center mb-2">
                                            <Award className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-base font-semibold text-[#323232] mb-0.5">
                                            Quiz Complete
                                        </h3>
                                        <p className="text-xs sm:text-sm text-[#323232]">
                                            Score: <span className="font-semibold">{score}</span> / {activeQuiz.questions.length} ({Math.round((score / activeQuiz.questions.length) * 100)}%)
                                        </p>
                                    </div>
                                )}

                                {/* Questions List */}
                                <div className="space-y-4">
                                    {activeQuiz.questions.map((q, qIndex) => (
                                        <div 
                                            key={qIndex}
                                            className="bg-white border border-[#DDD0C8] rounded-lg p-4 sm:p-5"
                                        >
                                            <h4 className="text-xs sm:text-sm font-semibold text-[#323232] mb-3 leading-relaxed">
                                                <span className="text-[#555555] mr-1.5">Q{qIndex + 1}.</span>
                                                {q.questionText}
                                            </h4>

                                            {/* Multiple Choice Options */}
                                            <div className="space-y-2">
                                                {q.options.map((option, oIndex) => {
                                                    const isSelected = selectedAnswers[qIndex] === option;
                                                    const isCorrect = option === q.correctAnswer;

                                                    let buttonStyle = 'bg-white border-[#DDD0C8] text-[#323232] hover:bg-[#F4EFEB]';
                                                    if (!submitted && isSelected) {
                                                        buttonStyle = 'bg-[#F4EFEB] border-[#323232] text-[#323232] font-semibold';
                                                    } else if (submitted) {
                                                        if (isCorrect) {
                                                            buttonStyle = 'bg-[#F4EFEB] border-[#323232] text-[#323232] font-semibold';
                                                        } else if (isSelected && !isCorrect) {
                                                            buttonStyle = 'bg-red-50 border-red-300 text-red-900';
                                                        } else {
                                                            buttonStyle = 'opacity-40 border-[#DDD0C8] text-[#555555]';
                                                        }
                                                    }

                                                    return (
                                                        <button
                                                            key={oIndex}
                                                            type="button"
                                                            onClick={() => handleSelectOption(qIndex, option)}
                                                            disabled={submitted}
                                                            className={`w-full text-left p-3 rounded-md border text-xs sm:text-sm flex items-center justify-between transition cursor-pointer disabled:cursor-default ${buttonStyle}`}
                                                        >
                                                            <span className="pr-3 leading-snug break-words">{option}</span>
                                                            {submitted && isCorrect && (
                                                                <CheckCircle className="w-4 h-4 text-[#323232] shrink-0" />
                                                            )}
                                                            {submitted && isSelected && !isCorrect && (
                                                                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Explanation Box */}
                                            {submitted && q.explanation && (
                                                <div className="mt-3 p-3 rounded-md bg-[#F4EFEB] border border-[#DDD0C8] text-xs text-[#323232] leading-relaxed">
                                                    <span className="block font-semibold uppercase tracking-wider text-[11px] text-[#555555] mb-0.5">
                                                        Explanation:
                                                    </span> 
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
                                            className="w-full py-2.5 rounded-md bg-[#323232] hover:bg-[#1E1E1E] disabled:opacity-40 text-[#DDD0C8] font-medium text-xs sm:text-sm transition cursor-pointer disabled:cursor-not-allowed"
                                        >
                                            Submit Quiz
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
