const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

const componentStart = "export function LiveTvScreen({ user, onRequirePremium }: LiveTvScreenProps) {";
const stateToAdd = `\n  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);\n  const touchTimer = useRef<NodeJS.Timeout | null>(null);\n`;

if (!code.includes("setHoveredChannel")) {
    console.log("Something is wrong, let's just do a normal insert.");
}

code = code.replace(componentStart, componentStart + stateToAdd);
fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('Fixed hoveredChannel state');
