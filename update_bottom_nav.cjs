const fs = require('fs');
let code = fs.readFileSync('src/components/BottomNav.tsx', 'utf-8');

const importStr = `import { Home, Compass, Film, Tv, Heart, User, Settings, ShoppingBag } from 'lucide-react';`;
const newImportStr = `import { Home, Compass, Film, Tv, Heart, User, Settings, ShoppingBag, TrendingUp } from 'lucide-react';`;

code = code.replace(importStr, newImportStr);

const tabsStr = `  const tabs = [
    { icon: Home, label: 'Home', value: 'home' },
    { icon: Compass, label: 'Discover', value: 'discover' },
    { icon: Film, label: 'Explore', value: 'explore' },
    { icon: ShoppingBag, label: 'Shop', value: 'shop' },
    { icon: Heart, label: 'My List', value: 'mylist' },
    { icon: User, label: 'Profile', value: 'profile' },
  ];`;

const newTabsStr = `  const tabs = [
    { icon: Home, label: 'Home', value: 'home' },
    { icon: TrendingUp, label: 'Trending', value: 'trending' },
    { icon: Film, label: 'Explore', value: 'explore' },
    { icon: ShoppingBag, label: 'Shop', value: 'shop' },
    { icon: Heart, label: 'My List', value: 'mylist' },
    { icon: User, label: 'Profile', value: 'profile' },
  ];`;

code = code.replace(tabsStr, newTabsStr);

fs.writeFileSync('src/components/BottomNav.tsx', code);
