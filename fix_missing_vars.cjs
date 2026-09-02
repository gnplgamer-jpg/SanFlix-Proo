const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const anchor = "const [searchHistory, setSearchHistory] = useState<string[]>([]);";
const newStates = `const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);`;
code = code.replace(anchor, newStates);

const variablesAnchor = `const continueWatchingList = React.useMemo(() => {`;
const newVariables = `const networks = [
    { label: "NETFLIX", bgClass: "bg-red-600", textClass: "text-white" },
    { label: "PRIME VIDEO", bgClass: "bg-blue-600", textClass: "text-white" },
    { label: "ALTBALAJI", bgClass: "bg-orange-600", textClass: "text-white" },
    { label: "SONYLIV", bgClass: "bg-yellow-500", textClass: "text-black" },
    { label: "MX PLAYER", bgClass: "bg-blue-800", textClass: "text-white" }
  ];

  const currentSpotlight = highlightedMovies[currentSlideIndex] || null;
  const continueWatchingMovies = React.useMemo(() => continueWatchingIds.map(id => filteredContent.find(m => m.id === id || m.firebase_id === id)).filter(Boolean), [continueWatchingIds, filteredContent]);
  const myListMovies = React.useMemo(() => myListIds.map(id => filteredContent.find(m => m.id === id || m.firebase_id === id)).filter(Boolean), [myListIds, filteredContent]);
  const recommendedForYou = React.useMemo(() => filteredContent.filter(m => m.is_highlighted || (parseFloat(m.rating || '0') >= 8.0)).sort(() => Math.random() - 0.5).slice(0, 15), [filteredContent]);
  const comingSoonMovies = React.useMemo(() => filteredContent.filter(m => m.mapped_category_rail && String(m.mapped_category_rail).toLowerCase().includes('upcoming')).sort((a,b) => (new Date(a.release_date||0).getTime() - new Date(b.release_date||0).getTime())), [filteredContent]);

  const topAction = React.useMemo(() => sortByRating(actionMovies).slice(0, 10), [actionMovies]);
  const topHorror = React.useMemo(() => sortByRating(horrorMovies).slice(0, 10), [horrorMovies]);
  const topCrime = React.useMemo(() => sortByRating(crimeMovies).slice(0, 10), [crimeMovies]);
  const topRomantic = React.useMemo(() => sortByRating(romanticMovies).slice(0, 10), [romanticMovies]);
  const topComedy = React.useMemo(() => sortByRating(comedyMovies).slice(0, 10), [comedyMovies]);
  const topSerials = React.useMemo(() => sortByRating(indianTvSerials).slice(0, 10), [indianTvSerials]);
  const topShows = React.useMemo(() => sortByRating(tvShowsHub).slice(0, 10), [tvShowsHub]);

  const continueWatchingList = React.useMemo(() => {`;

code = code.replace(variablesAnchor, newVariables);
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed missing variables');
