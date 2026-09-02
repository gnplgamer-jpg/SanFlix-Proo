const fs = require('fs');

// Patch BottomNav
let bottomNav = fs.readFileSync('src/components/BottomNav.tsx', 'utf8');
bottomNav = bottomNav.replace("import { Home, Compass, Film, Tv, Heart, User, Settings, ShoppingBag, TrendingUp } from 'lucide-react';", "import { Home, Compass, Film, Tv, Heart, User, Settings, ShoppingBag, TrendingUp, MonitorPlay } from 'lucide-react';");
bottomNav = bottomNav.replace("{ icon: TrendingUp, label: 'Trending', value: 'trending' },", "{ icon: MonitorPlay, label: 'Live TV', value: 'trending' },");
fs.writeFileSync('src/components/BottomNav.tsx', bottomNav);

// Patch TrendingVideos.tsx (we can keep the component name as is to avoid breaking imports)
let trending = fs.readFileSync('src/components/TrendingVideos.tsx', 'utf8');
trending = trending.replace("HOT & TRENDING ON SANFLIX", "LIVE TV CHANNELS");
trending = trending.replace("Global Trending Trailers", "Global Live Events & Trailers");
trending = trending.replace("Loading global trending content...", "Loading live TV channels...");
trending = trending.replace("No trending videos found.", "No live channels found.");
fs.writeFileSync('src/components/TrendingVideos.tsx', trending);

console.log("Patched to Live TV");
