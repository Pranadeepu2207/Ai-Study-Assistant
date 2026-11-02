import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axiosInstance from '../api/axiosInstance';
import { Send, Plus, MessageSquare, Bot, User, Loader2, Sparkles, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const AIChatPage = () => {
    const location = useLocation();

    // State Hooks
    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(location.state?.chatId || null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingChats, setFetchingChats] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Ref hook to auto-scroll chat to the bottom
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Fetch all past chat sessions from MongoDB on component mount
    useEffect(() => {
        const fetchChats = async () => {
            try {
                setFetchingChats(true);
                const response = await axiosInstance.get('/chat');
                const userChats = response.data.chats || [];
                setChats(userChats);

                if (location.state?.chatId) {
                    const selectedChat = userChats.find((c) => c._id === location.state.chatId);
                    if (selectedChat) {
                        setMessages(selectedChat.messages || []);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user chat sessions:', error);
            } finally {
                setFetchingChats(false);
            }
        };

        fetchChats();
    }, [location.state?.chatId]);

    // Switch between different chat sessions from the sidebar
    const handleSelectChat = (chat) => {
        setCurrentChatId(chat._id);
        setMessages(chat.messages || []);
        setSidebarOpen(false); // Close mobile drawer when chat is selected
    };

    // Start a brand new blank chat session
    const handleNewChat = () => {
        setCurrentChatId(null);
        setMessages([]);
        setInputMessage('');
        setSidebarOpen(false);
    };

    // Send message to Node.js backend & Google Gemini AI
    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputMessage.trim() || loading) return;

        const userPrompt = inputMessage.trim();
        setInputMessage('');

        const updatedMessages = [...messages, { sender: 'user', text: userPrompt }];
        setMessages(updatedMessages);
        setLoading(true);

        try {
            const response = await axiosInstance.post('/chat', {
                chatId: currentChatId,
                message: userPrompt,
            });

            const { chatId, aiResponse } = response.data;

            if (!currentChatId) {
                setCurrentChatId(chatId);
            }

            setMessages([...updatedMessages, { sender: 'ai', text: aiResponse }]);

            const updatedChatsRes = await axiosInstance.get('/chat');
            setChats(updatedChatsRes.data.chats || []);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages([
                ...updatedMessages,
                { sender: 'ai', text: 'Sorry, I encountered an error generating a response. Please try again.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-[#E3FDFD] text-slate-800 flex flex-col overflow-hidden">
            <Navbar />

            <div className="flex-1 flex overflow-hidden relative">
                
                {/* Mobile Backdrop for sidebar drawer */}
                {sidebarOpen && (
                    <div 
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-30 md:hidden"
                    />
                )}

                {/* Left Sidebar: Fixed on desktop, slide-over drawer on mobile */}
                <aside className={`
                    fixed md:static inset-y-0 left-0 z-40 
                    w-72 sm:w-80 bg-white/95 md:bg-white/70 backdrop-blur-md 
                    border-r border-[#A6E3E9] flex flex-col shrink-0 transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}>
                    
                    {/* Top New Chat & Close Button */}
                    <div className="p-3 sm:p-4 border-b border-[#A6E3E9]/60 flex items-center gap-2">
                        <button 
                            onClick={handleNewChat}
                            className="flex-1 py-2.5 sm:py-3 px-4 rounded-2xl bg-[#71C9CE] hover:bg-[#5dbbc0] text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>New Study Chat</span>
                        </button>

                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2.5 rounded-xl border border-[#A6E3E9] text-slate-500 hover:text-slate-800 md:hidden cursor-pointer"
                            aria-label="Close sidebar"
                        >
                            <PanelLeftClose className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Past Conversations List */}
                    <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1">
                        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Past Conversations
                        </div>

                        {fetchingChats ? (
                            <div className="flex items-center justify-center py-8 text-slate-400 gap-2 text-xs">
                                <Loader2 className="w-4 h-4 animate-spin text-[#71C9CE]" />
                                <span>Loading history...</span>
                            </div>
                        ) : chats.length === 0 ? (
                            <p className="px-3 py-6 text-xs text-slate-400 text-center">
                                No past chats found.
                            </p>
                        ) : (
                            chats.map((chat) => {
                                const isActive = currentChatId === chat._id;
                                return (
                                    <button
                                        key={chat._id}
                                        onClick={() => handleSelectChat(chat)}
                                        className={`w-full text-left px-3.5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm flex items-center gap-3 transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-[#CBF1F5] text-slate-900 font-bold border border-[#A6E3E9] shadow-2xs'
                                                : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                                        }`}
                                    >
                                        <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#71C9CE]' : 'text-slate-400'}`} />
                                        <span className="truncate">{chat.title || 'Study Session'}</span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </aside>

                {/* Main Workspace: Active Chat Stream & Input */}
                <main className="flex-1 flex flex-col h-full bg-[#E3FDFD]/40 relative overflow-hidden">
                    
                    {/* Mobile Top Bar to Open Sidebar */}
                    <div className="md:hidden flex items-center justify-between px-4 py-2 bg-white/70 border-b border-[#A6E3E9]/60">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 px-2.5 py-1.5 rounded-lg border border-[#A6E3E9] bg-white cursor-pointer"
                        >
                            <PanelLeftOpen className="w-4 h-4 text-[#71C9CE]" />
                            <span>History ({chats.length})</span>
                        </button>
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">
                            {chats.find(c => c._id === currentChatId)?.title || 'New Chat'}
                        </span>
                    </div>

                    {/* Messages Stream Container */}
                    <div className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-8 sm:py-12 px-4">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-white border border-[#A6E3E9] shadow-md shadow-[#71C9CE]/15 flex items-center justify-center text-[#71C9CE] mb-4 sm:mb-6">
                                    <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
                                    AI Study Workspace
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                                    Ask complex doubts, paste textbook summaries, or request step-by-step explanations.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2 w-full justify-center">
                                    <button 
                                        onClick={() => setInputMessage("Explain photosynthesis in simple terms.")}
                                        className="text-xs bg-white/80 hover:bg-white text-slate-700 border border-[#A6E3E9] px-3.5 py-2.5 rounded-xl transition text-left sm:text-center cursor-pointer shadow-2xs"
                                    >
                                        🌿 "Explain photosynthesis simply"
                                    </button>
                                    <button 
                                        onClick={() => setInputMessage("Summarize the key differences between SQL and NoSQL.")}
                                        className="text-xs bg-white/80 hover:bg-white text-slate-700 border border-[#A6E3E9] px-3.5 py-2.5 rounded-xl transition text-left sm:text-center cursor-pointer shadow-2xs"
                                    >
                                        💾 "SQL vs NoSQL differences"
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                                {messages.map((msg, index) => {
                                    const isUser = msg.sender === 'user';
                                    return (
                                        <div 
                                            key={index} 
                                            className={`flex items-start gap-2.5 sm:gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                                        >
                                            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                                                isUser ? 'bg-[#71C9CE] text-white' : 'bg-white border border-[#A6E3E9] text-[#71C9CE]'
                                            }`}>
                                                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                            </div>

                                            <div className={`max-w-[88%] sm:max-w-[80%] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs ${
                                                isUser 
                                                    ? 'bg-[#71C9CE] text-white rounded-tr-none' 
                                                    : 'bg-white border border-[#A6E3E9] text-slate-800 rounded-tl-none'
                                            }`}>
                                                <div className={`text-[11px] font-bold mb-1 ${isUser ? 'text-[#E3FDFD]' : 'text-[#71C9CE]'}`}>
                                                    {isUser ? 'You' : 'Gemini AI'}
                                                </div>
                                                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                    {msg.text}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}

                                {loading && (
                                    <div className="flex items-start gap-2.5 sm:gap-3.5">
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-[#A6E3E9] text-[#71C9CE] flex items-center justify-center shrink-0">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="bg-white border border-[#A6E3E9] rounded-2xl sm:rounded-3xl rounded-tl-none p-3.5 sm:p-4 shadow-xs flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
                                            <Loader2 className="w-4 h-4 text-[#71C9CE] animate-spin" />
                                            <span>Gemini is generating response...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Bottom Prompt Input Form */}
                    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-t from-[#E3FDFD] via-[#E3FDFD]/90 to-transparent">
                        <form 
                            onSubmit={handleSendMessage}
                            className="max-w-4xl mx-auto bg-white border border-[#A6E3E9] focus-within:border-[#71C9CE] focus-within:ring-2 focus-within:ring-[#71C9CE]/25 rounded-2xl p-1.5 sm:p-2 pl-3 sm:pl-5 flex items-center gap-2 shadow-lg shadow-[#71C9CE]/10 transition-all"
                        >
                            <input
                                type="text"
                                placeholder="Ask Gemini AI a question..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                disabled={loading}
                                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-slate-800 placeholder-slate-400 min-w-0"
                            />
                            <button 
                                type="submit" 
                                disabled={loading || !inputMessage.trim()}
                                className="p-2.5 sm:p-3 rounded-xl bg-[#71C9CE] hover:bg-[#5dbbc0] disabled:opacity-40 text-white shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default AIChatPage;
