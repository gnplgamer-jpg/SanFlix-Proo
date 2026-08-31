const fs = require('fs');

let code = fs.readFileSync('src/components/ActressRail.tsx', 'utf-8');

const targetArray = `const predefinedActresses: Actress[] = [
  { name: 'Aliya Naaz', tmdbId: 3004810 },
  { name: 'Sneha Paul', tmdbId: 3062325 },
  { name: 'Ayesha Kapoor', tmdbId: 3072213 },
  { name: 'Mahi Kaur', tmdbId: 3020108 },
  { name: 'Anveshi Jain', tmdbId: 2197825 },
  { name: 'Flora Saini', tmdbId: 1618035 },
  { name: 'Priya Gamre', tmdbId: 1386701 },
  { name: 'Bharti Jha', tmdbId: 3878235 },
  { name: 'Jinnie Jaaz', tmdbId: 2884240 },
  { name: 'Hiral Radadiya', tmdbId: 3014138 },
  { name: 'Rekha Mona Sarkar', tmdbId: 3089679 },
  { name: 'Muskan Agarwal', tmdbId: 3514736 },
  { name: 'Shyna Khatri', tmdbId: 3881260 },
  { name: 'Neha Gupta', tmdbId: 3450982 },
  { name: 'Kavita Radheshyam', tmdbId: 1395562 },
];`;

const replacementArray = `const predefinedActresses: Actress[] = [
  { name: 'Aliya Naaz', tmdbId: 3004810, imageUrl: 'https://m.media-amazon.com/images/M/MV5BMjYxZjg0ZjQtMzMyYy00NzlmLThiMTItY2YwM2M0NzgyMjc0XkEyXkFqcGc@._V1_UY256_CR20,0,172,256_AL_.jpg' },
  { name: 'Sneha Paul', tmdbId: 3062325, imageUrl: 'https://image.tmdb.org/t/p/w185/9ynw91mnpUAIlHu71W70LiAPZQZ.jpg' },
  { name: 'Ayesha Kapoor', tmdbId: 3072213, imageUrl: 'https://image.tmdb.org/t/p/w185/9adzxCqez08MTCvDL97YK8XTOIc.jpg' },
  { name: 'Mahi Kaur', tmdbId: 3020108, imageUrl: 'https://m.media-amazon.com/images/M/MV5BOGYzNTFlNGMtZjc3NC00ZGE2LTljMTEtNzMxMTRmZjBmMzA2XkEyXkFqcGc@._V1_UY256_CR20,0,172,256_AL_.jpg' },
  { name: 'Anveshi Jain', tmdbId: 2197825, imageUrl: 'https://image.tmdb.org/t/p/w185/7l2h5QyFc0dloUTlsIOPoSHz1ZM.jpg' },
  { name: 'Flora Saini', tmdbId: 1618035, imageUrl: 'https://image.tmdb.org/t/p/w185/mimiUPvv1S5L7kjXD79EKnfvSDs.jpg' },
  { name: 'Priya Gamre', tmdbId: 1386701, imageUrl: 'https://image.tmdb.org/t/p/w185/9hRYLNZ9uATRRvbjeFynuIusYVJ.jpg' },
  { name: 'Bharti Jha', tmdbId: 3878235, imageUrl: 'https://m.media-amazon.com/images/M/MV5BZWFiYWFmYTktMzFhZC00OTI0LWE1YWMtYjYzMWNiMWMzODg4XkEyXkFqcGc@._V1_UY256_CR21,0,172,256_AL_.jpg' },
  { name: 'Jinnie Jaaz', tmdbId: 2884240, imageUrl: 'https://m.media-amazon.com/images/M/MV5BNWU0NTZkODYtZjgxNC00NjIzLTkyMzktNzBkYzRiNTZkMWRjXkEyXkFqcGc@._V1_UY256_CR8,0,172,256_AL_.jpg' },
  { name: 'Hiral Radadiya', tmdbId: 3014138, imageUrl: 'https://m.media-amazon.com/images/M/MV5BMGJlMmQwNTUtOTZiYi00Y2U1LTgzNjQtNTA3MDZiMzk0NDJjXkEyXkFqcGc@._V1_UX172_CR0,0,172,256_AL_.jpg' },
  { name: 'Rekha Mona Sarkar', tmdbId: 3089679, imageUrl: 'https://image.tmdb.org/t/p/w185/8aQIsJiJXpC1vgu2M01DflknCYB.jpg' },
  { name: 'Muskan Agarwal', tmdbId: 3514736, imageUrl: 'https://image.tmdb.org/t/p/w185/uCt9jLIa6hLpnmeW22Pj5yT3HXy.jpg' },
  { name: 'Shyna Khatri', tmdbId: 3881260, imageUrl: 'https://image.tmdb.org/t/p/w185/a2hnnIqbzgoBhQcqBffw72idX6O.jpg' },
  { name: 'Neha Gupta', tmdbId: 3450982, imageUrl: 'https://image.tmdb.org/t/p/w185/7xQSKykWYrzXGwVPZ8UqdxhdPt9.jpg' },
  { name: 'Kavita Radheshyam', tmdbId: 1395562, imageUrl: 'https://image.tmdb.org/t/p/w185/yain5ELFgRfH8S5pezHMt5FzZDA.jpg' },
];`;

code = code.replace(targetArray, replacementArray);

const targetUseEffect = `  useEffect(() => {
    // Fetch profile paths for those with tmdbId
    const fetchImages = async () => {
      const updated = await Promise.all(
        actresses.map(async (actress) => {
          if (actress.tmdbId && !actress.imageUrl) {
            try {
              const res = await fetch(\`/api/tmdb/person/\${actress.tmdbId}\`);
              const data = await res.json();
              if (data.profile_path) {
                return { ...actress, imageUrl: \`https://image.tmdb.org/t/p/w185\${data.profile_path}\` };
              }
            } catch (e) {
              console.error("Failed to fetch image for", actress.name);
            }
          }
          return actress;
        })
      );
      setActresses(updated);
    };
    
    fetchImages();
  }, []);`;

code = code.replace(targetUseEffect, "");

// Remove the unused useEffect from React import since we removed its usage
code = code.replace("import React, { useState, useEffect, useRef }", "import React, { useState, useRef }");

fs.writeFileSync('src/components/ActressRail.tsx', code);
