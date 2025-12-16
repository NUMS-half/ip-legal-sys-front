import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import LegalDisclaimer from './components/LegalDisclaimer';
import { sendMessageToLegalBot } from './services/geminiService';
import { fetchChatHistoryList, fetchChatSessionDetails } from './services/chatHistoryService';
import { Role } from './types';
import type { Message, ChatSessionSummary } from './types';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // History State
  const [chatSessions, setChatSessions] = useState<ChatSessionSummary[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load history list on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const sessions = await fetchChatHistoryList();
        setChatSessions(sessions);
      } catch (error) {
        console.error("Failed to load history", error);
      }
    };
    loadHistory();
  }, []);

  // Theme Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Initial Welcome Message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: Role.Model,
      content: '您好！我是您的知识产权法律助手。我可以为您提供关于专利、商标、版权及商业秘密等方面的法律咨询。\n\n请问您今天遇到了什么法律问题？\n(例如："如何申请软件著作权？" 或 "收到商标侵权警告信该怎么办？")',
      timestamp: Date.now(),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartNewChat = () => {
    setMessages([
        {
          id: Date.now().toString(),
          role: Role.Model,
          content: '已开启新的会话。请问您有什么新的知识产权问题需要咨询？',
          timestamp: Date.now(),
        }
    ]);
    setCurrentSessionId(null);
    setIsSidebarOpen(false);
  };

  const handleSelectSession = async (sessionId: string) => {
    if (sessionId === currentSessionId) return;
    
    setIsLoading(true);
    setCurrentSessionId(sessionId);
    try {
      const historyMessages = await fetchChatSessionDetails(sessionId);
      setMessages(historyMessages);
    } catch (error) {
      console.error("Failed to load session details", error);
      setMessages([{ 
        id: 'error',
        role: Role.Model,
        content: "加载历史记录失败，请重试。",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
      setIsSidebarOpen(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsgText = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // 1. Add User Message
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: Role.User,
      content: userMsgText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newUserMsg]);

    // 2. Add Temporary Loading Message
    const loadingMsgId = (Date.now() + 1).toString();
    const loadingMsg: Message = {
      id: loadingMsgId,
      role: Role.Model,
      content: '',
      timestamp: Date.now(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, loadingMsg]);

    // 3. Call API (Local Mock)
    // We pass the *previous* messages plus the new one for context
    const response = await sendMessageToLegalBot(messages, userMsgText);

    // 4. Update with Real Response
    setMessages(prev => prev.map(msg => {
      if (msg.id === loadingMsgId) {
        return {
          ...msg,
          isLoading: false,
          content: response.text,
          citations: response.citations
        };
      }
      return msg;
    }));

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 relative transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        startNewChat={handleStartNewChat}
        isCollapsed={isDesktopSidebarCollapsed}
        toggleCollapse={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
        sessions={chatSessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full w-full relative transition-all">
        
        {/* Top Navigation Bar (Mobile/Desktop) */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 shadow-sm z-10 transition-colors duration-300">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden mr-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center">
              知识产权法律咨询系统 
              <span className="hidden sm:inline-block text-xs font-normal text-slate-500 dark:text-slate-400 ml-2 py-1 px-2 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">RAG Powered</span>
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button 
                onClick={toggleTheme}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                title={theme === 'light' ? "切换到深色模式" : "切换到浅色模式"}
            >
                {theme === 'light' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                )}
            </button>
            
            <button className="hidden sm:flex items-center text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                帮助
            </button>
          </div>
        </header>

        {/* Chat Area Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth bg-slate-50 dark:bg-slate-900 transition-colors duration-300" id="chat-container">
          <div className="max-w-4xl mx-auto flex flex-col pb-4">
            <LegalDisclaimer />
            
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area (Sticky Bottom) */}
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 pb-6 sm:px-8 transition-colors duration-300">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
              
              {/* Legal Database Access */}
              <button 
                className="p-3 text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-colors"
                title="法律知识库已连接"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </button>

              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="请输入您的法律问题... (Shift + Enter 换行)"
                className="flex-1 max-h-48 min-h-[56px] py-4 px-2 bg-transparent border-none focus:ring-0 resize-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                rows={1}
                disabled={isLoading}
              />

              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`p-2 m-2 rounded-lg transition-all duration-200 ${!inputValue.trim() || isLoading ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}`}
              >
                {isLoading ? (
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                )}
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2 transition-colors">
                内容由 AI 生成，可能存在错误。请核查重要信息。
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default App;