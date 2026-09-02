const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetAnchor = `      cats = Array.from(new Set(cats.filter(Boolean)));
      return { ...m, mapped_category_rail: cats.join(', ') };
    });

    
    return result;
  }, [searchQuery, filteredContent, selectedCategory]);`;

const replacement = `      cats = Array.from(new Set(cats.filter(Boolean)));
      return { ...m, mapped_category_rail: cats.join(', ') };
    });

    if (selectedLanguage && selectedLanguage !== 'All Languages') {
       const lang = selectedLanguage.toLowerCase();
       list = list.filter(m => {
         const inLang = safeLower(m.language).includes(lang);
         const inUrls = Array.isArray(m.language_urls) && m.language_urls.some((l) => safeLower(l.language).includes(lang));
         const inCat = safeLower(m.mapped_category_rail).includes(lang);
         return inLang || inUrls || inCat;
       });
    }

    return list;
  }, [isAdultEnabled, isPHubEnabled, moviesList, selectedLanguage]);

  const urlHandledRef = React.useRef(false);
  React.useEffect(() => {
    if (filteredContent.length > 0 && !urlHandledRef.current) {
      urlHandledRef.current = true;
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get('id');
      if (id) {
        const movieToOpen = filteredContent.find(m => m.id === id || m.firebase_id === id);
        if (movieToOpen) {
          handleSelectMovie(movieToOpen);
        }
      }
    }
  }, [filteredContent]);

  const highlightedMovies = React.useMemo(() => {
    const list = filteredContent.filter(m => m.is_highlighted);
    if (list.length > 0) return list;
    return [...filteredContent]
      .filter(m => safeLower(m.media_layout_format).includes('movie'))
      .sort((a, b) => (parseFloat(b.rating || '0') - parseFloat(a.rating || '0')))
      .slice(0, 5);
  }, [filteredContent]);

  const recentlyAdded = React.useMemo(() => [...filteredContent].slice(0, 15), [filteredContent]);
  const forYouMovies = React.useMemo(() => {
    return filteredContent.filter(m => m.is_highlighted || (parseFloat(m.rating as string) >= 8.0)).sort(() => Math.random() - 0.5).slice(0, 15);
  }, [filteredContent]);

  const trailerContent = React.useMemo(() => filteredContent.filter(m => String(m.trailer_id || '').trim() !== ''), [filteredContent]);
  const upcomingMovies = React.useMemo(() => {
    return filteredContent.filter(m => {
       return m.mapped_category_rail && String(m.mapped_category_rail).toLowerCase().includes('upcoming');
    }).sort((a, b) => {
      const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
      const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
      return dateA - dateB;
    });
  }, [filteredContent]);

  const sanFlixProContent = React.useMemo(() => {
    return filteredContent.filter(m => m.is_sanflix_pro);
  }, [filteredContent]);

  const phubLiveContent = React.useMemo(() => {
    return filteredContent.filter(m => m.is_phub_live);
  }, [filteredContent]);

  const phubContent = React.useMemo(() => {
    return filteredContent.filter(m => !m.is_phub_live && m.mapped_category_rail && String(m.mapped_category_rail).includes('Porn Hub'));
  }, [filteredContent]);

  const standardContent = React.useMemo(() => {
    return filteredContent.filter(m => !m.is_sanflix_pro && !m.ad_gate && !(m.mapped_category_rail && String(m.mapped_category_rail).includes('Porn Hub')));
  }, [filteredContent]);

  const oldIsGoldMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('old is gold')), [standardContent]);
  const actionMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('action')), [standardContent]);
  const horrorMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('horror')), [standardContent]);
  const crimeMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('crime')), [standardContent]);
  const romanticMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('romant') || safeLower(m.mapped_category_rail).includes('romance')), [standardContent]);
  const comedyMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('comed')), [standardContent]);
  const dramaMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('drama')), [standardContent]);
  const adventureMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('adventure')), [standardContent]);
  const bhojpuriMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('bhojpuri')), [standardContent]);
  const sadContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('sad')), [standardContent]);
  const wweContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('wwe')), [standardContent]);
  const warContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('war')), [standardContent]);
  const tvShowsHub = React.useMemo(() => standardContent.filter(m => safeLower(m.media_layout_format).includes('show') || safeLower(m.mapped_category_rail).includes('show')), [standardContent]);
  const serialsNetwork = React.useMemo(() => standardContent.filter(m => safeLower(m.media_layout_format).includes('series') || safeLower(m.mapped_category_rail).includes('serial')), [standardContent]);
  const indianTvSerials = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('serial') || safeLower(m.mapped_category_rail).includes('indian tv')), [standardContent]);
  const animeContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('anime') || safeLower(m.mapped_category_rail).includes('animation')), [standardContent]);
  const sciFiMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('sci-fi') || safeLower(m.mapped_category_rail).includes('scifi')), [standardContent]);
  const animationShows = React.useMemo(() => standardContent.filter(m => (safeLower(m.mapped_category_rail).includes('anime') || safeLower(m.mapped_category_rail).includes('animation')) && (safeLower(m.media_layout_format).includes('show') || safeLower(m.media_layout_format).includes('series'))), [standardContent]);
  const netflixContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('netflix')), [standardContent]);
  const primeContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('prime')), [standardContent]);
  const altBalajiContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('altbalaji')), [standardContent]);
  const sonyLivContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('sonyliv')), [standardContent]);
  const mxPlayerContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('mx player')), [standardContent]);

  const sortByRating = (arr: any[]) => arr.sort((a, b) => (parseFloat(b.rating || '0') - parseFloat(a.rating || '0')));
  const popularMovies = React.useMemo(() => sortByRating(standardContent.filter(m => safeLower(m.media_layout_format).includes('movie'))).slice(0, 20), [standardContent]);
  const topGlobalMovies = React.useMemo(() => sortByRating(standardContent.filter(m => safeLower(m.media_layout_format).includes('movie'))).slice(0, 10), [standardContent]);

  const continueWatchingList = React.useMemo(() => {
    return continueWatchingIds
      .map(id => filteredContent.find(m => m.id === id || m.firebase_id === id))
      .filter(Boolean);
  }, [continueWatchingIds, filteredContent]);

  const myListContent = React.useMemo(() => {
    return myListIds
      .map(id => filteredContent.find(m => m.id === id || m.firebase_id === id))
      .filter(Boolean);
  }, [myListIds, filteredContent]);

  const categoriesList = React.useMemo(() => {
    const cats = new Set<string>();
    filteredContent.forEach(m => {
       if (m.mapped_category_rail) {
         String(m.mapped_category_rail).split(',').forEach(c => cats.add(c.trim()));
       }
    });
    const dynamicCats = Array.from(cats).filter(c => c && !defaultStaticCategories.includes(c));
    return [...defaultStaticCategories, ...dynamicCats, 'Actress: Sunny Leone', 'Actress: Mia Khalifa', 'Actress: Dani Daniels', 'Actress: Kendra Lust', 'Actress: Angela White'];
  }, [filteredContent, isAdultEnabled, isPHubEnabled]);

  const searchResults = React.useMemo(() => {
    let result = filteredContent;
    
    if (searchQuery.trim()) {
      const queryStr = searchQuery.toLowerCase();
      result = result.filter(
        (m) => safeLower(m.title).includes(queryStr) || safeLower(m.mapped_category_rail).includes(queryStr) || safeLower(m.cast_crew).includes(queryStr)
      );
    }
    
    if (selectedCategory && selectedCategory !== 'All') {
       if (selectedCategory === 'Premium') {
          result = result.filter(m => m.is_sanflix_pro);
       } else if (selectedCategory === 'Recent') {
          result = result.sort((a,b) => (new Date(b.release_date||0).getTime() - new Date(a.release_date||0).getTime()));
       } else if (selectedCategory.startsWith('Actress: ')) {
          const actressName = safeLower(selectedCategory.replace('Actress: ', '').trim());
          result = result.filter(m => safeLower(m.cast_crew).includes(actressName) || safeLower(m.title).includes(actressName));
       } else {
          const catKeyword = safeLower(selectedCategory).replace(' vip', '');
          result = result.filter(m => 
            safeLower(m.mapped_category_rail) === safeLower(selectedCategory) ||
            safeLower(m.mapped_category_rail).includes(catKeyword) ||
            safeLower(m.title).includes(catKeyword) ||
            safeLower(m.synopsis).includes(catKeyword) ||
            safeLower(m.cast_crew).includes(catKeyword)
          );
       }
    }
    
    return result;
  }, [searchQuery, filteredContent, selectedCategory]);`;

code = code.replace(targetAnchor, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('Restored the missing lines!');
