import React from 'react';
import { Gamepad2, Users, Bot, Wifi, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface GamesHubProps {
  onSelectGame: (gameId: string) => void;
}

export function GamesHub({ onSelectGame }: GamesHubProps) {
  const games = [
    {
      id: 'ludo',
      name: 'Ludo AI Pro',
      description: 'Premium Ludo with AI bots and local multiplayer.',
      image: 'https://images.unsplash.com/photo-1611029238634-0a9f8f2638f8?auto=format&fit=crop&q=80&w=800',
      tags: ['Online', 'Offline', 'AI Mode']
    }
  ];

  return (
    <div className="pt-8 pb-32 px-4 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Gamepad2 className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">Game Hub</h2>
      </div>
      
      <p className="text-zinc-400 mb-8 font-medium">Play premium games online or offline. New games added regularly!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {games.map(game => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectGame(game.id)}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden cursor-pointer group shadow-2xl relative"
          >
            <div className="h-48 w-full relative">
              <img src={game.image} alt={game.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
              <div className="absolute top-3 right-3 bg-red-600 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1">
                 <Play className="w-3 h-3 fill-current" /> PLAY
              </div>
            </div>
            
            <div className="p-6 relative">
              <h3 className="text-2xl font-black text-white mb-2">{game.name}</h3>
              <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{game.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {game.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-lg border border-zinc-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
