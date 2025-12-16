import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// Fix: Use 'import type' for interfaces explicitly to avoid runtime errors in some bundlers
import { Role } from '../types';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.User;
  
  // State to hold the text currently displayed (for typewriter effect)
  const [displayedContent, setDisplayedContent] = useState('');
  
  // Ref to store the typing interval ID so we can clear it
  const typingIntervalRef = useRef<number | null>(null);

  // Effect to handle the typewriter animation
  useEffect(() => {
    // If it's a user message, show it immediately without animation
    if (isUser) {
      setDisplayedContent(message.content);
      return;
    }

    // If loading, clear content
    if (message.isLoading) {
      setDisplayedContent('');
      return;
    }

    // Logic for Model messages
    const fullContent = message.content;
    
    // If content is already fully displayed (e.g. from a previous render), do nothing
    if (displayedContent === fullContent) return;

    // Optimization: If the message is "old" (e.g., loaded from history > 10s ago), 
    // show it immediately to avoid re-typing heavily on reload.
    // However, for this demo, we'll allow re-typing to showcase the effect 
    // or if the timestamp is very recent.
    const isRecent = (Date.now() - message.timestamp) < 10000; 
    
    // If not recent, just snap to full content
    if (!isRecent && fullContent.length > 0) {
        setDisplayedContent(fullContent);
        return;
    }

    // Start Typewriter Effect
    // Clear any existing interval
    if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
    }

    // Set a fast interval for typing
    typingIntervalRef.current = window.setInterval(() => {
      setDisplayedContent((prev) => {
        // Calculate next index
        // If prev is empty but fullContent is large, we start from 0
        // We ensure we don't exceed full content length
        const currentLength = prev.length;
        const nextIndex = currentLength + 3; // Type 3 chars at a time for good speed
        
        if (nextIndex >= fullContent.length) {
          // Finished typing
          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
          return fullContent;
        }
        return fullContent.substring(0, nextIndex);
      });
    }, 15); // 15ms per chunk

    // Cleanup on unmount or when dependencies change
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [message.content, message.isLoading, message.role, isUser]); 
  // Dependency note: we include message.content so if it updates (e.g. from loading->text), it triggers.


  // Custom components for ReactMarkdown to style elements with Tailwind
  const markdownComponents = {
    // Override paragraph to have proper spacing
    p: ({children}: any) => <p className="mb-2 last:mb-0 leading-relaxed dark:text-slate-100">{children}</p>,
    
    // List styling
    ul: ({children}: any) => <ul className="list-disc list-outside ml-4 mb-2 space-y-1 dark:text-slate-200">{children}</ul>,
    ol: ({children}: any) => <ol className="list-decimal list-outside ml-4 mb-2 space-y-1 dark:text-slate-200">{children}</ol>,
    li: ({children}: any) => <li className="pl-1">{children}</li>,
    
    // Headings
    h1: ({children}: any) => <h1 className="text-lg font-bold mb-2 mt-4 text-slate-900 dark:text-white border-b dark:border-slate-700 pb-1">{children}</h1>,
    h2: ({children}: any) => <h2 className="text-base font-bold mb-2 mt-3 text-slate-800 dark:text-slate-100">{children}</h2>,
    h3: ({children}: any) => <h3 className="text-sm font-bold mb-1 mt-2 text-slate-800 dark:text-slate-200">{children}</h3>,
    
    // Code blocks
    code: ({node, inline, className, children, ...props}: any) => {
        return !inline ? (
            <div className="relative group">
                <pre className="bg-slate-800 dark:bg-slate-950 text-slate-50 p-3 rounded-lg overflow-x-auto mb-3 text-xs md:text-sm shadow-inner border dark:border-slate-700">
                    <code className={className} {...props}>
                        {children}
                    </code>
                </pre>
            </div>
        ) : (
            <code className="font-mono text-xs bg-slate-100 dark:bg-slate-700 text-pink-600 dark:text-pink-400 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-600" {...props}>
                {children}
            </code>
        )
    },

    // Blockquotes
    blockquote: ({children}: any) => <blockquote className="border-l-4 border-blue-300 pl-4 italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 py-2 my-2 rounded-r">{children}</blockquote>,
    
    // Links
    a: ({href, children}: any) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all">{children}</a>,
    
    // Tables
    table: ({children}: any) => <div className="overflow-x-auto mb-3"><table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 border border-slate-200 dark:border-slate-700">{children}</table></div>,
    thead: ({children}: any) => <thead className="bg-slate-50 dark:bg-slate-800">{children}</thead>,
    tbody: ({children}: any) => <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">{children}</tbody>,
    tr: ({children}: any) => <tr>{children}</tr>,
    th: ({children}: any) => <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{children}</th>,
    td: ({children}: any) => <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{children}</td>,
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] lg:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white shadow-sm mx-2 ${isUser ? 'bg-blue-600' : 'bg-slate-700 dark:bg-slate-600'}`}>
            {isUser ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
            )}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col flex-1 min-w-0`}>
            <div className={`relative px-5 py-4 rounded-2xl shadow-sm text-sm leading-relaxed overflow-hidden transition-colors duration-300 ${
            isUser 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none'
            }`}>
            {message.isLoading ? (
                <div className="flex space-x-2 h-5 items-center">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            ) : isUser ? (
                // User message is usually plain text, but we can render simple newlines
                <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
                // Model message with Markdown and Typewriter
                <div className="markdown-body">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                    >
                        {displayedContent}
                    </ReactMarkdown>
                    {/* Blinking cursor effect while typing */}
                    {displayedContent !== message.content && (
                        <span className="inline-block w-1.5 h-4 bg-slate-400 ml-1 animate-pulse align-middle"></span>
                    )}
                </div>
            )}
            </div>

            {/* RAG/Search Citations */}
            {!isUser && message.citations && message.citations.length > 0 && !message.isLoading && (
                <div className="mt-2 ml-1 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-xs animate-fade-in transition-colors duration-300">
                    <p className="font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        参考资料 (基于检索增强生成 - RAG):
                    </p>
                    <ul className="space-y-1">
                        {message.citations.map((cite, idx) => (
                            <li key={idx}>
                                <a 
                                    href={cite.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-start"
                                >
                                    <span className="mr-1">[{idx + 1}]</span>
                                    <span className="truncate text-slate-600 dark:text-slate-300">{cite.title}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {/* Timestamp */}
            <span className={`text-xs text-slate-400 dark:text-slate-500 mt-1 mx-1 ${isUser ? 'text-right' : 'text-left'}`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;