const fs = require('fs');
let code = fs.readFileSync('src/components/BottomNav.tsx', 'utf-8');

code = code.replace(
  "import { Home, Compass, Film, Tv, Heart, User, Settings } from 'lucide-react';",
  "import { Home, Compass, Film, Tv, Heart, User, Settings, ShoppingBag } from 'lucide-react';"
);

const tabsOld = `  const tabs = [
    { icon: Home, label: 'Home', value: 'home' },
    { icon: Compass, label: 'Discover', value: 'discover' },
    { icon: Film, label: 'Movies', value: 'movies' },
    { icon: Tv, label: 'TV Shows', value: 'tvshows' },
    { icon: Heart, label: 'My List', value: 'mylist' },
    { icon: User, label: 'Profile', value: 'profile' },
  ];`;
  
const tabsNew = `  const tabs = [
    { icon: Home, label: 'Home', value: 'home' },
    { icon: Compass, label: 'Discover', value: 'discover' },
    { icon: Film, label: 'Explore', value: 'explore' },
    { icon: ShoppingBag, label: 'Shop', value: 'shop' },
    { icon: Heart, label: 'My List', value: 'mylist' },
    { icon: User, label: 'Profile', value: 'profile' },
  ];`;

code = code.replace(tabsOld, tabsNew);
fs.writeFileSync('src/components/BottomNav.tsx', code);
