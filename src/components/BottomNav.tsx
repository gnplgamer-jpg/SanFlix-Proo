import { Home, Compass, Film, Tv, Heart, User, Settings, ShoppingBag, TrendingUp, MonitorPlay } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  const tabs = [
    { icon: Home, label: 'Home', value: 'home' },
    { icon: MonitorPlay, label: 'Live TV', value: 'trending' },
    { icon: Film, label: 'Explore', value: 'explore' },
    { icon: ShoppingBag, label: 'Shop', value: 'shop' },
    { icon: Heart, label: 'My List', value: 'mylist' },
    { icon: User, label: 'Profile', value: 'profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 border-t border-zinc-800/50 backdrop-blur-lg pb-safe">
      <div className="flex items-center justify-around px-2 py-3 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onChangeTab(tab.value)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                isActive ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-red-500/20' : ''}`} />
              <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
