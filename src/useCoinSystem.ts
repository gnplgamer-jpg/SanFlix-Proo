import { useState, useEffect } from 'react';

export function useCoinSystem(user: any) {
  const [coins, setCoins] = useState<number>(0);
  const [unlockedContent, setUnlockedContent] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCoins(0);
      setUnlockedContent({});
      setLoading(false);
      return;
    }

    // Load from LocalStorage
    try {
      const savedData = localStorage.getItem(`sanflix_data_${user.uid}`);
      if (savedData) {
        const data = JSON.parse(savedData);
        setCoins(data.coins || 0);
        setUnlockedContent(data.unlockedContent || {});
      } else {
        // Welcome gift for new local user
        const initialData = { coins: 2, unlockedContent: {} };
        localStorage.setItem(`sanflix_data_${user.uid}`, JSON.stringify(initialData));
        setCoins(2);
        setUnlockedContent({});
      }
    } catch (e) {
      console.error("Local storage error", e);
    }
    
    setLoading(false);
  }, [user]);

  const saveToLocal = (newCoins: number, newUnlocked: Record<string, number>) => {
    if (!user) return;
    try {
      localStorage.setItem(`sanflix_data_${user.uid}`, JSON.stringify({
        coins: newCoins,
        unlockedContent: newUnlocked
      }));
    } catch(e) {
      console.error("Save error", e);
    }
  }

  const addCoins = async (amount: number) => {
    if (!user) return;
    const newCoins = coins + amount;
    setCoins(newCoins);
    saveToLocal(newCoins, unlockedContent);
  };

  const unlockMovie = async (movieId: string): Promise<boolean> => {
    if (!user || coins < 1) return false;
    
    // 6 hours expiry
    const expiryTime = Date.now() + (6 * 60 * 60 * 1000);
    const newUnlocked = { ...unlockedContent, [movieId]: expiryTime };
    const newCoins = coins - 1;
    
    setCoins(newCoins);
    setUnlockedContent(newUnlocked);
    saveToLocal(newCoins, newUnlocked);
    
    return true;
  };

  const isUnlocked = (movieId: string): boolean => {
    const expiry = unlockedContent[movieId];
    if (!expiry) return false;
    return Date.now() < expiry;
  };

  return {
    coins,
    unlockedContent,
    loading,
    addCoins,
    unlockMovie,
    isUnlocked
  };
}
