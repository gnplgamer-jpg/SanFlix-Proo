const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf-8');

// Update props
const targetProps = "export function ChatBot({ isOpen, onClose, availableMovies = [] }: { isOpen: boolean; onClose: () => void; availableMovies?: any[] }) {";
const newProps = "export function ChatBot({ isOpen, onClose, availableMovies = [], onSelectMovie }: { isOpen: boolean; onClose: () => void; availableMovies?: any[]; onSelectMovie?: (m: any) => void }) {";
code = code.replace(targetProps, newProps);

// Update click handler
const targetClick = `onClick={() => alert("Movie details selected: " + sug.title + " (Play feature not direct)")}`;
const newClick = `onClick={() => {
                              const found = availableMovies.find(m => m.title.toLowerCase().trim() === sug.title.toLowerCase().trim() || (sug.id && (m.id === sug.id || m.firebase_id === sug.id)));
                              if (found && onSelectMovie) {
                                 onSelectMovie(found);
                                 onClose();
                              } else {
                                 // Alert or just log if not found
                                 console.log("Not in local DB:", sug.title);
                              }
                           }}`;
code = code.replace(targetClick, newClick);

fs.writeFileSync('src/components/ChatBot.tsx', code);
