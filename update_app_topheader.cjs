const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetProps = `            <TopHeader
              onSearch={setSearchQuery}
              isSearchActive={isSearchActive}
              setIsSearchActive={setIsSearchActive}
              searchQuery={searchQuery}
              isLightMode={isLightMode}
              setIsLightMode={setIsLightMode}
              onSearchFocus={setIsSearchFocused}
              onSearchSubmit={handleSearchCommit}
              onCartClick={() => setActiveTab('cart')}
            />`;

const newProps = `            <TopHeader
              onSearch={setSearchQuery}
              isSearchActive={isSearchActive}
              setIsSearchActive={setIsSearchActive}
              searchQuery={searchQuery}
              isLightMode={isLightMode}
              setIsLightMode={setIsLightMode}
              onSearchFocus={setIsSearchFocused}
              onSearchSubmit={handleSearchCommit}
              onCartClick={() => setActiveTab('cart')}
              hasContinueWatching={continueWatchingIds.length > 0}
              onResumeLatest={() => {
                if (continueWatchingIds.length > 0) {
                  const latestMovie = filteredContent.find(m => m.firebase_id === continueWatchingIds[0]) || allContent.find(m => m.firebase_id === continueWatchingIds[0]);
                  if (latestMovie) handleSelectMovie(latestMovie);
                }
              }}
            />`;

code = code.replace(targetProps, newProps);

fs.writeFileSync('src/App.tsx', code);
