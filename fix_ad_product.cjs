const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerModal.tsx', 'utf-8');

const targetStr = `  useEffect(() => {
    const fetchAd = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, 'products'), limit(1)));
        if (!querySnapshot.empty) {
          setAdProduct({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
        }
      } catch (e) {
        console.error("Error fetching ad product:", e);
      }
    };
    fetchAd();
  }, []);`;

const newStr = `  useEffect(() => {
    let adInterval: any;
    const fetchAd = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (!querySnapshot.empty) {
          const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Set initial random product
          setAdProduct(products[Math.floor(Math.random() * products.length)]);
          
          if (products.length > 1) {
            adInterval = setInterval(() => {
              setAdProduct(products[Math.floor(Math.random() * products.length)]);
            }, 5000);
          }
        }
      } catch (e) {
        console.error("Error fetching ad product:", e);
      }
    };
    fetchAd();

    return () => {
      if (adInterval) clearInterval(adInterval);
    };
  }, []);`;

code = code.replace(targetStr, newStr);

// Also remove limit from imports if it's unused
// actually no need, leave limit imported from firebase

fs.writeFileSync('src/components/PlayerModal.tsx', code);
