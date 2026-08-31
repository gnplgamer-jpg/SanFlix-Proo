import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

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

    const userRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(userRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCoins(data.coins || 0);
        setUnlockedContent(data.unlockedContent || {});
      } else {
        // Initialize new user with 2 coins as a welcome gift
        try {
          await setDoc(userRef, {
            coins: 2,
            unlockedContent: {}
          }, { merge: true });
          setCoins(2);
          setUnlockedContent({});
        } catch(e) {
          console.error("Error init user doc", e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addCoins = async (amount: number) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const newCoins = coins + amount;
    await updateDoc(userRef, { coins: newCoins });
  };

  const unlockMovie = async (movieId: string): Promise<boolean> => {
    if (!user || coins < 1) return false;
    
    const userRef = doc(db, 'users', user.uid);
    // 6 hours expiry
    const expiryTime = Date.now() + (6 * 60 * 60 * 1000);
    
    const newUnlocked = { ...unlockedContent, [movieId]: expiryTime };
    const newCoins = coins - 1;
    
    await updateDoc(userRef, {
      coins: newCoins,
      unlockedContent: newUnlocked
    });
    
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
