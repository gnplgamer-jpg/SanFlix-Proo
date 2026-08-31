const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (list.length > 0) {
        setMoviesList(list);
      } else {
        setMoviesList(staticMovies);
      }`;

const newStr = `    const unsubscribe = onSnapshot(q, (snapshot) => {
      let list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list = list.filter((item: any) => !item.is_deleted);
      if (list.length > 0) {
        setMoviesList(list);
      } else {
        setMoviesList(staticMovies);
      }`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/App.tsx', code);
