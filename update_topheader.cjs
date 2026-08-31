const fs = require('fs');
let code = fs.readFileSync('src/components/TopHeader.tsx', 'utf-8');

const importTarget = `import { Search, Zap, PlayCircle, X, Sun, Moon, Mic, Check, Diamond, ShoppingCart, Gift } from 'lucide-react';`;
const importReplace = `import { Search, Zap, PlayCircle, X, Sun, Moon, Mic, Check, Diamond, ShoppingCart, Gift, MessageSquarePlus } from 'lucide-react';`;
code = code.replace(importTarget, importReplace);

const propsTarget = `  onSearchFocus?: (focused: boolean) => void;
}`;
const propsReplace = `  onSearchFocus?: (focused: boolean) => void;
  onRequestClick?: () => void;
}`;
code = code.replace(propsTarget, propsReplace);

const argsTarget = `  onSearchFocus
}: TopHeaderProps) {`;
const argsReplace = `  onSearchFocus,
  onRequestClick
}: TopHeaderProps) {`;
code = code.replace(argsTarget, argsReplace);

const btnTarget = `                            {/* Shopping Cart */}
              <button 
                 onClick={onCartClick}`;
const btnReplace = `                            {/* Request Button */}
              <button 
                 onClick={onRequestClick}
                 className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 hover:scale-105 transition-transform"
                 title="Request Content"
              >
                <MessageSquarePlus className="w-4 h-4" />
              </button>

              {/* Shopping Cart */}
              <button 
                 onClick={onCartClick}`;
code = code.replace(btnTarget, btnReplace);

fs.writeFileSync('src/components/TopHeader.tsx', code);
console.log("Updated TopHeader");
