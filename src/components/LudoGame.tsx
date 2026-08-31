import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Users, Bot, Trophy, Play, X, Gamepad2 } from 'lucide-react';

interface LudoGameProps {
  onBack: () => void;
  onGameEnd: () => void;
}

type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';
const COLORS: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
const COLOR_HEX = {
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#eab308',
  blue: '#3b82f6'
};

const PATH = [
  {x:6,y:13},{x:6,y:12},{x:6,y:11},{x:6,y:10},{x:6,y:9},
  {x:5,y:8},{x:4,y:8},{x:3,y:8},{x:2,y:8},{x:1,y:8},{x:0,y:8},{x:0,y:7},{x:0,y:6},
  {x:1,y:6},{x:2,y:6},{x:3,y:6},{x:4,y:6},{x:5,y:6},
  {x:6,y:5},{x:6,y:4},{x:6,y:3},{x:6,y:2},{x:6,y:1},{x:6,y:0},{x:7,y:0},{x:8,y:0},
  {x:8,y:1},{x:8,y:2},{x:8,y:3},{x:8,y:4},{x:8,y:5},
  {x:9,y:6},{x:10,y:6},{x:11,y:6},{x:12,y:6},{x:13,y:6},{x:14,y:6},{x:14,y:7},{x:14,y:8},
  {x:13,y:8},{x:12,y:8},{x:11,y:8},{x:10,y:8},{x:9,y:8},
  {x:8,y:9},{x:8,y:10},{x:8,y:11},{x:8,y:12},{x:8,y:13},{x:8,y:14},{x:7,y:14},{x:6,y:14}
];

const HOME_STRETCHES = {
  red: [{x:7,y:13},{x:7,y:12},{x:7,y:11},{x:7,y:10},{x:7,y:9}],
  green: [{x:1,y:7},{x:2,y:7},{x:3,y:7},{x:4,y:7},{x:5,y:7}],
  yellow: [{x:7,y:1},{x:7,y:2},{x:7,y:3},{x:7,y:4},{x:7,y:5}],
  blue: [{x:13,y:7},{x:12,y:7},{x:11,y:7},{x:10,y:7},{x:9,y:7}],
};

const BASES = {
  red: [{x:2.5,y:10.5},{x:3.5,y:10.5},{x:2.5,y:11.5},{x:3.5,y:11.5}],
  green: [{x:2.5,y:2.5},{x:3.5,y:2.5},{x:2.5,y:3.5},{x:3.5,y:3.5}],
  yellow: [{x:10.5,y:2.5},{x:11.5,y:2.5},{x:10.5,y:3.5},{x:11.5,y:3.5}],
  blue: [{x:10.5,y:10.5},{x:11.5,y:10.5},{x:10.5,y:11.5},{x:11.5,y:11.5}],
};

const OFFSETS = { red: 0, green: 13, yellow: 26, blue: 39 };
const SAFE_ZONES = [0, 8, 13, 21, 26, 34, 39, 47];

type GameMode = 'menu' | 'playing' | 'won';

export function LudoGame({ onBack, onGameEnd }: LudoGameProps) {
  const [mode, setMode] = useState<GameMode>('menu');
  const [aiMode, setAiMode] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);
  
  const [turn, setTurn] = useState<PlayerColor>('red');
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  
  const [positions, setPositions] = useState<Record<PlayerColor, number[]>>({
    red: [-1, -1, -1, -1],
    green: [-1, -1, -1, -1],
    yellow: [-1, -1, -1, -1],
    blue: [-1, -1, -1, -1],
  });

  const [winner, setWinner] = useState<PlayerColor | null>(null);
  const [showAd, setShowAd] = useState(false);
  const [adTimer, setAdTimer] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showAd && adTimer > 0) {
      interval = setInterval(() => setAdTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showAd, adTimer]);

  const playSound = (type: 'roll' | 'move' | 'win' | 'capture') => {
    try {
      const urls = {
        roll: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
        move: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
        win: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
        capture: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3'
      };
      const audio = new Audio(urls[type]);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch(e) {}
  };

  const startGame = (ai: boolean, count: number) => {
    setAiMode(ai);
    setPlayerCount(count);
    setPositions({
      red: [-1, -1, -1, -1],
      green: [-1, -1, -1, -1],
      yellow: [-1, -1, -1, -1],
      blue: [-1, -1, -1, -1],
    });
    setTurn('red');
    setHasRolled(false);
    setIsRolling(false);
    setWinner(null);
    setMode('playing');
  };

  const passTurn = (dice: number, gotExtraTurn: boolean) => {
    if (dice === 6 || gotExtraTurn) {
      setHasRolled(false); // get another turn
    } else {
      const activeColors = COLORS.slice(0, playerCount);
      const nextIdx = (activeColors.indexOf(turn) + 1) % playerCount;
      setTurn(activeColors[nextIdx]);
      setHasRolled(false);
    }
  };

  const isValidMove = (color: PlayerColor, index: number, dice: number, currentPositions: Record<PlayerColor, number[]>) => {
    const p = currentPositions[color][index];
    if (p === 56) return false;
    if (p === -1) return dice === 6;
    if (p + dice > 56) return false;
    return true;
  };

  const rollDice = () => {
    if (isRolling || hasRolled || winner) return;
    setIsRolling(true);
    playSound('roll');
    
    setTimeout(() => {
      const val = Math.floor(Math.random() * 6) + 1;
      setDiceValue(val);
      setIsRolling(false);
      setHasRolled(true);
      
      const validMoves = [0,1,2,3].filter(i => isValidMove(turn, i, val, positions));
      if (validMoves.length === 0) {
        setTimeout(() => passTurn(val, false), 1000);
      }
    }, 600);
  };

  const handleTokenClick = (color: PlayerColor, index: number) => {
    if (color !== turn || isRolling || !hasRolled || winner) return;
    if (!isValidMove(color, index, diceValue, positions)) return;
    
    let captured = false;
    let reachedHome = false;

    setPositions(prev => {
      const newPos = { ...prev };
      // create deep copy of array
      newPos.red = [...prev.red];
      newPos.green = [...prev.green];
      newPos.yellow = [...prev.yellow];
      newPos.blue = [...prev.blue];

      let currentP = newPos[color][index];
      
      if (currentP === -1 && diceValue === 6) {
        newPos[color][index] = 0;
      } else {
        newPos[color][index] += diceValue;
      }

      const finalP = newPos[color][index];
      if (finalP === 56) reachedHome = true;

      // Check Captures
      if (finalP >= 0 && finalP <= 50) {
        const globalFinal = (finalP + OFFSETS[color]) % 52;
        if (!SAFE_ZONES.includes(globalFinal)) {
           // check others
           COLORS.slice(0, playerCount).forEach(c => {
             if (c !== color) {
               newPos[c] = newPos[c].map(their_p => {
                 if (their_p >= 0 && their_p <= 50) {
                   const theirGlobal = (their_p + OFFSETS[c]) % 52;
                   if (theirGlobal === globalFinal) {
                     captured = true;
                     return -1;
                   }
                 }
                 return their_p;
               });
             }
           });
        }
      }

      return newPos;
    });

    if (captured) playSound('capture');
    else playSound('move');

    // Check Win
    setTimeout(() => {
      setPositions(currentPos => {
        if (currentPos[color].every(p => p === 56)) {
          setWinner(color);
          setMode('won');
          playSound('win');
          setTimeout(() => setShowAd(true), 3000);
        } else {
          passTurn(diceValue, captured || reachedHome);
        }
        return currentPos;
      });
    }, 400);
  };

  // AI Logic
  useEffect(() => {
    if (mode === 'playing' && aiMode && turn !== 'red' && !winner) {
      if (!hasRolled && !isRolling) {
        const timer = setTimeout(rollDice, 1000);
        return () => clearTimeout(timer);
      } else if (hasRolled) {
        const validTokens = [0, 1, 2, 3].filter(i => isValidMove(turn, i, diceValue, positions));
        if (validTokens.length > 0) {
          const tokenToMove = validTokens[Math.floor(Math.random() * validTokens.length)];
          const timer = setTimeout(() => handleTokenClick(turn, tokenToMove), 1000);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [turn, hasRolled, isRolling, aiMode, mode, winner, positions, diceValue]);


  const getCoordinates = (color: PlayerColor, p: number, idx: number) => {
    if (p === -1) return BASES[color][idx];
    if (p >= 0 && p <= 50) {
      const globalP = (p + OFFSETS[color]) % 52;
      return PATH[globalP];
    }
    if (p >= 51 && p <= 55) {
      // @ts-ignore
      return HOME_STRETCHES[color][p - 51];
    }
    return { x: 7, y: 7 }; // Center
  };

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col font-sans">
      <div className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 justify-between shrink-0 shadow-md">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 tracking-wide">
          Ludo AI Pro
        </h1>
        <div className="w-6" />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-black">
        {mode === 'menu' && (
          <div className="w-full max-w-sm space-y-6">
            <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800 shadow-2xl text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-purple-500/30 flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Play with Friends</h2>
              <p className="text-zinc-400 text-sm mb-6">Pass and play with family and friends on the same device.</p>
              <div className="flex gap-2 mb-4">
                {[2, 3, 4].map(num => (
                  <button 
                    key={num}
                    onClick={() => setPlayerCount(num)}
                    className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${playerCount === num ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-105' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    {num} P
                  </button>
                ))}
              </div>
              <button onClick={() => startGame(false, playerCount)} className="w-full py-4 bg-white text-black font-black rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors">
                <Play className="w-5 h-5 fill-current" /> Start Local Game
              </button>
            </motion.div>

            <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{delay:0.1}} className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800 shadow-2xl text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg shadow-red-500/30 flex items-center justify-center mb-4">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Play vs AI Bot</h2>
              <p className="text-zinc-400 text-sm mb-6">Challenge our powerful AI in a solo match.</p>
              <button onClick={() => startGame(true, 2)} className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 hover:scale-[1.02] transition-transform">
                <Play className="w-5 h-5 fill-current" /> Play vs AI
              </button>
            </motion.div>
          </div>
        )}

        {mode === 'playing' && (
          <div className="w-full max-w-lg flex flex-col items-center">
            
            {/* Header info */}
            <div className="w-full flex justify-between items-center mb-6 px-2">
               <div className="flex items-center gap-3">
                 <div className="text-left">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Current Turn</p>
                    <div className="flex items-center gap-2 bg-zinc-900 rounded-full pr-4 pl-1 py-1 border border-zinc-800 shadow-xl">
                       <div className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: COLOR_HEX[turn] }} />
                       <span className="text-white font-black text-sm capitalize">{turn} {aiMode && turn !== 'red' && '(AI)'}</span>
                    </div>
                 </div>
               </div>
               
               {/* Dice */}
               <div className="flex flex-col items-end">
                  <motion.div 
                    onClick={(!aiMode || turn === 'red') && !hasRolled ? rollDice : undefined}
                    animate={isRolling ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black shadow-2xl select-none relative
                      ${(!aiMode || turn === 'red') && !hasRolled ? 'cursor-pointer hover:scale-105 transition-transform ring-2 ring-white/20' : 'opacity-80'}
                      ${turn === 'red' ? 'bg-gradient-to-br from-red-400 to-red-600 text-white shadow-red-500/40' : 
                        turn === 'green' ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-green-500/40' : 
                        turn === 'blue' ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-blue-500/40' : 
                        'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white shadow-yellow-500/40'}`}
                  >
                    {isRolling ? '?' : diceValue}
                    {(!aiMode || turn === 'red') && !hasRolled && !isRolling && (
                       <span className="absolute -top-1 -right-1 flex h-3 w-3">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                       </span>
                    )}
                  </motion.div>
               </div>
            </div>

            {/* Board */}
            <div className="w-full aspect-square relative bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border-4 border-zinc-800">
               <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/d/d4/Ludo_board.svg" 
                 alt="Ludo Board" 
                 className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-90"
               />
               
               {/* Pawns */}
               {COLORS.slice(0, playerCount).map(color => (
                 positions[color].map((p, idx) => {
                   const coord = getCoordinates(color, p, idx);
                   const isTurn = turn === color && hasRolled && !isRolling;
                   const canMove = isTurn && isValidMove(color, idx, diceValue, positions);
                   
                   // calculate slight offset if multiple pawns on same spot
                   let offset = {x: 0, y: 0};
                   if (p !== -1 && p !== 56) {
                      offset = {
                        x: (color === 'red' || color === 'blue' ? -2 : 2) + (idx % 2 === 0 ? -1 : 1),
                        y: (color === 'red' || color === 'green' ? -2 : 2) + (idx > 1 ? -1 : 1)
                      };
                   }

                   return (
                     <div
                       key={`${color}-${idx}`}
                       className="absolute transition-all duration-500 ease-out flex items-center justify-center z-10"
                       style={{
                          width: '6.666%', height: '6.666%',
                          left: `${coord.x * (100/15)}%`,
                          top: `${coord.y * (100/15)}%`,
                          transform: `translate(${offset.x}px, ${offset.y}px)`
                       }}
                     >
                        <div 
                          onClick={() => handleTokenClick(color, idx)}
                          className={`w-[70%] h-[70%] rounded-full shadow-lg border-[2px] border-white/80 flex items-center justify-center
                            ${canMove ? 'cursor-pointer hover:scale-125 z-20 ring-2 ring-white animate-pulse' : ''}
                            ${color === 'red' ? 'bg-gradient-to-br from-red-400 to-red-600' : 
                              color === 'green' ? 'bg-gradient-to-br from-green-400 to-green-600' : 
                              color === 'blue' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 
                              'bg-gradient-to-br from-yellow-300 to-yellow-500'}
                          `}
                        >
                           <div className="w-[40%] h-[40%] rounded-full bg-white/30" />
                        </div>
                     </div>
                   );
                 })
               ))}
            </div>
            
            <p className="text-zinc-500 text-xs mt-6 text-center bg-zinc-900/50 py-2 px-4 rounded-full border border-zinc-800">
               Tap dice to roll. Tap glowing pawn to move. 6 gives another turn.
            </p>
          </div>
        )}

        {mode === 'won' && winner && (
           <motion.div 
             initial={{ scale: 0.5, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="w-full max-w-sm bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-8 border border-zinc-800 shadow-2xl text-center z-50"
           >
              <Trophy className="w-24 h-24 mx-auto text-yellow-500 mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
              <h2 className="text-4xl font-black mb-2 uppercase tracking-widest drop-shadow-md" style={{ color: COLOR_HEX[winner] }}>
                {winner} Wins!
              </h2>
              <p className="text-zinc-400 mt-4">Great game! Preparing reward...</p>
           </motion.div>
        )}
      </div>

      {/* Ad Modal */}
      <AnimatePresence>
        {showAd && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col"
          >
            <div className="w-full h-14 flex justify-between items-center px-4 bg-zinc-900 border-b border-zinc-800 shrink-0">
              <span className="text-zinc-400 text-xs font-bold px-2 py-1 bg-zinc-800 rounded">Advertisement</span>
              <div className="flex items-center gap-3">
                <span className="text-zinc-300 text-sm font-medium">
                  {adTimer > 0 ? `Reward in ${adTimer}s` : 'Reward granted'}
                </span>
                <button 
                  disabled={adTimer > 0} 
                  onClick={() => { setShowAd(false); onGameEnd(); }}
                  className={`w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-white transition-opacity ${adTimer > 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-zinc-700'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-black">
              <div className="absolute inset-0 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
              <div className="z-10 flex flex-col items-center text-center max-w-sm">
                <div className="w-28 h-28 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-1 mb-6 shadow-2xl shadow-indigo-600/40 flex items-center justify-center">
                   <div className="w-full h-full bg-black rounded-[26px] flex items-center justify-center">
                      <Gamepad2 className="w-12 h-12 text-indigo-500" />
                   </div>
                </div>
                <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Play More Games</h2>
                <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                  Discover thousands of premium games in our new Game Hub!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
