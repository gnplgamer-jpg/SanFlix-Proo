import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Download } from 'lucide-react';
import Markdown from 'react-markdown';

interface MovieSuggestion {
  title: string;
  imageUrl?: string;
  qualities?: string[];
  type?: string;
  id?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: MovieSuggestion[];
}

export function ChatBot({ isOpen, onClose, availableMovies = [], onSelectMovie, onOpenShop }: { isOpen: boolean; onClose: () => void; availableMovies?: any[]; onSelectMovie?: (m: any) => void; onOpenShop?: () => void; }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi there! I'm **SanFlix-Pro Chat Bot** 🤖. I am your exclusive SanFlix-Pro assistant. Don't know the name of a movie? Just paste a YouTube link, Google link, poster URL, or describe the plot, and I'll help you find it in our catalog! 🍿✨"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    const newMessage: Message = { id: Date.now().toString(), role: 'user', content: userMessage };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          availableMovies: availableMovies.map(m => ({ title: m.title, imageUrl: m.poster_url || m.imageUrl, type: m.media_layout_format, id: m.id || m.firebase_id, qualities: ['720p', '1080p'] }))
        })
      });
      const data = await res.json();

      if (data.reply || data.suggestions) {
        let finalReply = data.reply || "Here are some suggestions!";
        finalReply += '\n\nवैसे भाई, क्या आपको gaming phone lene के लिए सस्ते में डायमंड्स चाहिए? हमारे [Daraz Shop](#shop) पर क्लिक करें!';
        
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: finalReply,
          suggestions: data.suggestions
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Oops! I encountered an error. Please try again. 😿"
        }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Network error! I couldn't reach the server. 😿"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-8 w-[90vw] max-w-[450px] h-[550px] max-h-[75vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-red-900/20 z-50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-900 to-rose-900 p-4 flex items-center justify-between border-b border-red-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center relative overflow-hidden">
                <Bot className="w-6 h-6 text-pink-400" />
                <Sparkles className="w-3 h-3 text-yellow-400 absolute top-1 right-1 animate-pulse" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-none">Catt Bot 😸</h3>
                <p className="text-red-200 text-xs">SanFlix-Pro AI Assistant</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-800' : 'bg-red-900/80 border border-red-500/30'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-zinc-400" /> : <Bot className="w-4 h-4 text-pink-300" />}
                  </div>
                  <div className={`flex flex-col gap-2`}>
                    <div className={`p-3 rounded-2xl ${msg.role === 'user' ? 'bg-zinc-800 text-white rounded-tr-sm' : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-sm'}`}>
                      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-snug prose-p:m-0 prose-strong:text-red-400">
                        <div className="markdown-body"><Markdown components={{
                      a: ({node, ...props}) => {
                        if (props.href === '#shop') {
                          return (
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                onClose();
                                if (onOpenShop) onOpenShop();
                              }} 
                              className="text-red-400 font-bold underline decoration-red-400/50 hover:text-red-300"
                            >
                              {props.children}
                            </button>
                          );
                        }
                        return <a {...props} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" />;
                      }
                    }}>{msg.content}</Markdown></div>
                      </div>
                    </div>
                    {/* Suggestions UI */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-3">
                        {msg.suggestions.map((sug, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            key={idx} 
                            
                           onClick={() => {
                              const cleanStr = (s) => s ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
                              const sugClean = cleanStr(sug.title);
                              let found = availableMovies.find(m => 
                                cleanStr(m.title) === sugClean || 
                                (sug.id && (m.id === sug.id || m.firebase_id === sug.id))
                              );
                              
                              if (!found) {
                                found = availableMovies.find(m => 
                                  cleanStr(m.title).includes(sugClean) || 
                                  sugClean.includes(cleanStr(m.title))
                                );
                              }
                              
                              if (found && onSelectMovie) {
                                 onSelectMovie(found);
                                 onClose();
                              } else if (onSelectMovie) {
                                 // Create a mock object so user sees something
                                 onSelectMovie({
                                   id: sug.id || 'ai-' + Date.now(),
                                   title: sug.title,
                                   poster_url: sug.imageUrl,
                                   description: "Recommended by SanFlix AI. We are currently locating streaming sources for this title.",
                                   genres: ["AI Recommendation"]
                                 });
                                 onClose();
                              }
                           }} 
 
                           className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden w-[160px] sm:w-[180px] group cursor-pointer hover:border-red-500 shadow-lg hover:shadow-red-500/20 transition-all duration-300"
                          >
                            {sug.imageUrl && (
                               <div className="w-full h-[120px] relative overflow-hidden bg-black">
                                  <img 
                                    src={sug.imageUrl} 
                                    alt={sug.title} 
                                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x450/18181b/ef4444?text=No+Poster' }} 
                                    className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-60 transition-all duration-500" 
                                    loading="lazy" 
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-50 group-hover:scale-100">
                                     <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.7)] text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                     </div>
                                  </div>
                               </div>
                            )}
                            <div className="p-3 flex flex-col gap-1.5 relative z-10 bg-zinc-900">
                               <p className="text-white text-sm font-bold truncate group-hover:text-red-400 transition-colors" title={sug.title}>{sug.title}</p>
                               {sug.qualities && sug.qualities.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {sug.qualities.map(q => (
                                       <span key={q} className="bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1 group-hover:border-red-500/30 transition-colors">
                                          <Download className="w-3 h-3 text-red-500" /> {q}
                                       </span>
                                    ))}
                                  </div>
                               )}
                            </div>
                            
                            {/* Animated highlight border */}
                            <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/10 group-hover:animate-pulse pointer-events-none" />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%] flex-row">
                  <div className="w-8 h-8 rounded-full bg-red-900/80 border border-red-500/30 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-pink-300" />
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                    <span className="text-xs text-zinc-400">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-zinc-900 border-t border-zinc-800">
            <div className="flex items-center gap-2 bg-zinc-950 rounded-full border border-zinc-800 p-1 pl-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Paste link or describe..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-zinc-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white disabled:opacity-50 disabled:hover:bg-red-600 transition-colors shrink-0"
              >
                <Send className="w-4 h-4 ml-[-2px]" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
