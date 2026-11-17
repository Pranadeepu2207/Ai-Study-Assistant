import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axiosInstance from '../api/axiosInstance';
import { Send, Plus, MessageSquare, Bot, User, Loader2, BookOpen, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const AIChatPage = () => {
    const location = useLocation();

    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(location.state?.chatId || null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingChats, setFetchingChats] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

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

    const handleSelectChat = (chat) => {
        setCurrentChatId(chat._id);
        setMessages(chat.messages || []);
        setSidebarOpen(false);
    };

    const handleNewChat = () => {
        setCurrentChatId(null);
        setMessages([]);
        setInputMessage('');
        setSidebarOpen(false);
    };

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
                { sender: 'ai', text: 'Error generating response. Please check network connection and try again.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-[#F8F6F4] text-[#323232] flex flex-col overflow-hidden">
            <Navbar />

            <div className="flex-1 flex overflow-hidden relative">
                {/* Mobile Backdrop */}
                {sidebarOpen && (
                    <div 
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-[#323232]/40 z-30 md:hidden"
                    />
                )}

                {/* Left Sidebar */}
                <aside className={`
                    fixed md:static inset-y-0 left-0 z-40 
                    w-72 bg-white border-r border-[#DDD0C8] 
                    flex flex-col shrink-0 transition-transform duration-200 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}>
                    <div className="p-3 border-b border-[#DDD0C8] flex items-center gap-2">
                        <button 
                            onClick={handleNewChat}
                            className="flex-1 py-2 px-3 rounded-md bg-[#323232] hover:bg-[#1E1E1E] text-[#DDD0C8] font-medium text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>New Study Chat</span>
                        </button>

                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 rounded-md border border-[#DDD0C8] text-[#555555] hover:text-[#323232] md:hidden cursor-pointer"
                            aria-label="Close sidebar"
                        >
                            <PanelLeftClose className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#555555]">
                            Saved Sessions
                        </div>

                        {fetchingChats ? (
                            <div className="flex items-center justify-center py-6 text-[#555555] gap-2 text-xs">
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#323232]" />
                                <span>Loading sessions...</span>
                            </div>
                        ) : chats.length === 0 ? (
                            <p className="px-3 py-4 text-xs text-[#555555] text-center">
                                No past sessions recorded.
                            </p>
                        ) : (
                            chats.map((chat) => {
                                const isActive = currentChatId === chat._id;
                                return (
                                    <button
                                        key={chat._id}
                                        onClick={() => handleSelectChat(chat)}
                                        className={`w-full text-left px-3 py-2 rounded-md text-xs flex items-center gap-2.5 transition cursor-pointer ${
                                            isActive
                                                ? 'bg-[#F4EFEB] text-[#323232] font-semibold border border-[#DDD0C8]'
                                                : 'text-[#555555] hover:bg-[#F8F6F4] hover:text-[#323232]'
                                        }`}
                                    >
                                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#323232]' : 'text-[#555555]'}`} />
                                        <span className="truncate">{chat.title || 'Study Session'}</span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </aside>

                {/* Main Workspace */}
                <main className="flex-1 flex flex-col h-full bg-[#F8F6F4] relative overflow-hidden">
                    {/* Mobile Top Bar */}
                    <div className="md:hidden flex items-center justify-between px-4 py-2 bg-white border-b border-[#DDD0C8]">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#323232] px-2.5 py-1.5 rounded-md border border-[#DDD0C8] bg-white cursor-pointer"
                        >
                            <PanelLeftOpen className="w-3.5 h-3.5 text-[#323232]" />
                            <span>History ({chats.length})</span>
                        </button>
                        <span className="text-xs font-medium text-[#323232] truncate max-w-[180px]">
                            {chats.find(c => c._id === currentChatId)?.title || 'New Session'}
                        </span>
                    </div>

                    {/* Messages Stream */}
                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-8 px-4">
                                <div className="w-10 h-10 rounded-md bg-white border border-[#DDD0C8] flex items-center justify-center text-[#323232] mb-3">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-semibold text-[#323232] mb-1">
                                    Study Assistant Workspace
                                </h2>
                                <p className="text-[#555555] text-xs leading-relaxed mb-5">
                                    Submit questions, paste reading passages, or request conceptual walkthroughs.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2 w-full justify-center">
                                    <button 
                                        onClick={() => setInputMessage("Explain photosynthesis in simple terms.")}
                                        className="text-xs bg-white hover:bg-[#F4EFEB] text-[#323232] border border-[#DDD0C8] px-3 py-2 rounded-md transition text-left sm:text-center cursor-pointer"
                                    >
                                        Explain photosynthesis simply
                                    </button>
                                    <button 
                                        onClick={() => setInputMessage("Summarize the key differences between SQL and NoSQL.")}
                                        className="text-xs bg-white hover:bg-[#F4EFEB] text-[#323232] border border-[#DDD0C8] px-3 py-2 rounded-md transition text-left sm:text-center cursor-pointer"
                                    >
                                        SQL vs NoSQL differences
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-3xl mx-auto space-y-4">
                                {messages.map((msg, index) => {
                                    const isUser = msg.sender === 'user';
                                    return (
                                        <div 
                                            key={index} 
                                            className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                                        >
                                            <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-xs ${
                                                isUser ? 'bg-[#323232] text-[#DDD0C8]' : 'bg-white border border-[#DDD0C8] text-[#323232]'
                                            }`}>
                                                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                            </div>

                                            <div className={`max-w-[85%] sm:max-w-[78%] rounded-lg p-3 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                                                isUser 
                                                    ? 'bg-[#323232] text-[#DDD0C8]' 
                                                    : 'bg-white border border-[#DDD0C8] text-[#323232]'
                                            }`}>
                                                <div className={`text-[11px] font-semibold mb-1 ${isUser ? 'text-[#DDD0C8]/80' : 'text-[#555555]'}`}>
                                                    {isUser ? 'You' : 'Assistant'}
                                                </div>
                                                <p className="whitespace-pre-wrap break-words">
                                                    {msg.text}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}

                                {loading && (
                                    <div className="flex items-start gap-2.5">
                                        <div className="w-7 h-7 rounded-md bg-white border border-[#DDD0C8] text-[#323232] flex items-center justify-center shrink-0">
                                            <Bot className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="bg-white border border-[#DDD0C8] rounded-lg p-3 flex items-center gap-2 text-[#555555] text-xs">
                                            <Loader2 className="w-3.5 h-3.5 text-[#323232] animate-spin" />
                                            <span>Generating response...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Bottom Prompt Input */}
                    <div className="p-3 sm:p-4 bg-white border-t border-[#DDD0C8]">
                        <form 
                            onSubmit={handleSendMessage}
                            className="max-w-3xl mx-auto flex items-center gap-2"
                        >
                            <input
                                type="text"
                                placeholder="Enter your question or study topic..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                disabled={loading}
                                className="flex-1 bg-[#F8F6F4] border border-[#DDD0C8] focus:border-[#323232] rounded-md px-3 py-2 text-xs sm:text-sm text-[#323232] placeholder-[#555555]/60 outline-none transition"
                            />
                            <button 
                                type="submit" 
                                disabled={loading || !inputMessage.trim()}
                                className="p-2 rounded-md bg-[#323232] hover:bg-[#1E1E1E] disabled:opacity-40 text-[#DDD0C8] transition cursor-pointer shrink-0"
                                aria-label="Send message"
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
