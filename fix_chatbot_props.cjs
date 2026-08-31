const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf-8');

// Update props
const targetProps = "export function ChatBot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {";
const newProps = "export function ChatBot({ isOpen, onClose, availableMovies = [] }: { isOpen: boolean; onClose: () => void; availableMovies?: any[] }) {";
code = code.replace(targetProps, newProps);

// Update fetch call
const targetFetch = `      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });`;
const newFetch = `      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          availableMovies: availableMovies.map(m => ({ title: m.title, imageUrl: m.poster, qualities: m.quality, type: m.type }))
        })
      });`;
code = code.replace(targetFetch, newFetch);

// Update image tag to include onError and object-contain if fallback
const targetImg = `<img src={sug.imageUrl} alt={sug.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />`;
const newImg = `<img src={sug.imageUrl} alt={sug.title} onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x450/18181b/ef4444?text=No+Poster' }} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />`;
code = code.replace(targetImg, newImg);

fs.writeFileSync('src/components/ChatBot.tsx', code);
