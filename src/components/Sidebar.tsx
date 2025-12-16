import React from 'react';
import type { ChatSessionSummary } from '../types';

interface SidebarProps {
  isOpen: boolean; // Mobile state
  toggleSidebar: () => void; // Mobile toggle
  startNewChat: () => void;
  isCollapsed: boolean; // Desktop state
  toggleCollapse: () => void; // Desktop toggle
  sessions: ChatSessionSummary[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
}

// Helper to format relative time
const formatRelativeTime = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (hours < 1) return '刚刚';
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return new Date(timestamp).toLocaleDateString();
};

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  toggleSidebar, 
  startNewChat,
  isCollapsed,
  toggleCollapse,
  sessions,
  currentSessionId,
  onSelectSession
}) => {
  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 z-20 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 bg-slate-900 text-white transform transition-all duration-300 ease-in-out 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:static lg:inset-auto flex flex-col
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          dark:bg-slate-950 border-r dark:border-slate-800
        `}
      >
        {/* Header */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-slate-700 dark:border-slate-800 h-16`}>
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="bg-blue-600 p-1.5 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg tracking-wide whitespace-nowrap opacity-100 transition-opacity duration-300">
                IP Guardian
              </span>
            )}
          </div>
          
          {/* Mobile Close Button */}
          <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

           {/* Desktop Collapse Button */}
           <button 
             onClick={toggleCollapse} 
             className={`hidden lg:block text-slate-400 hover:text-white transition-transform duration-300 ${isCollapsed ? 'absolute top-1/2 -translate-y-1/2 right-[-12px] bg-slate-800 rounded-full p-1 border border-slate-600 z-50 shadow-sm' : ''}`}
             title={isCollapsed ? "展开侧边栏" : "收起侧边栏"}
           >
             {isCollapsed ? (
                // Right Arrow when collapsed (Expand)
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
             ) : (
                // Left Arrow when expanded (Collapse)
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
             )}
           </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button 
            onClick={() => {
                startNewChat();
                if (window.innerWidth < 1024) toggleSidebar();
            }}
            className={`
              bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg flex items-center transition-colors shadow-lg shadow-blue-900/20
              ${isCollapsed ? 'justify-center p-2.5 w-full' : 'w-full py-2.5 px-4 justify-center'}
            `}
            title="新建咨询"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            {!isCollapsed && <span className="ml-2 whitespace-nowrap">新建咨询</span>}
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 overflow-x-hidden">
          {!isCollapsed && (
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 whitespace-nowrap">最近咨询</p>
          )}
          
          <div className="space-y-1">
            {sessions.map((session) => (
              <button 
                key={session.id}
                onClick={() => {
                  onSelectSession(session.id);
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`w-full text-left rounded-lg transition-colors group flex items-center
                  ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'}
                  ${currentSessionId === session.id ? 'bg-slate-800 border border-slate-700' : 'hover:bg-slate-800 border border-transparent'}
                `}
                title={isCollapsed ? session.title : undefined}
              >
                {isCollapsed ? (
                   <div className={`w-2 h-2 rounded-full ${currentSessionId === session.id ? 'bg-blue-500' : 'bg-slate-500 group-hover:bg-blue-400'}`}></div>
                ) : (
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${currentSessionId === session.id ? 'text-blue-400' : 'text-slate-200 group-hover:text-white'}`}>
                      {session.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatRelativeTime(session.updatedAt)}</p>
                  </div>
                )}
              </button>
            ))}
            
            {sessions.length === 0 && !isCollapsed && (
              <div className="text-center text-slate-600 text-sm py-4">
                暂无历史记录
              </div>
            )}
          </div>
        </div>

        {/* User / Settings */}
        <div className="p-4 border-t border-slate-700 dark:border-slate-800 bg-slate-900 dark:bg-slate-950">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold flex-shrink-0 text-white shadow-inner">
                    U
                </div>
                {!isCollapsed && (
                  <div className="ml-3 min-w-0">
                      <p className="text-sm font-medium text-white truncate">Guest User</p>
                      <p className="text-xs text-slate-400 truncate">halfnums@gmail.com</p>
                  </div>
                )}
            </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;