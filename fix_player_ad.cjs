const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerModal.tsx', 'utf-8');

const stateAddition = `  const [reportingData, setReportingData] = useState<{ isOpen: boolean, episodeTitle?: string, episodeIdx?: number, failedUrl: string } | null>(null);
  const [adProduct, setAdProduct] = useState<any>(null);

  useEffect(() => {
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

code = code.replace(
  "  const [reportingData, setReportingData] = useState<{ isOpen: boolean, episodeTitle?: string, episodeIdx?: number, failedUrl: string } | null>(null);",
  stateAddition
);

const adHtml = `{/* Ad Banner */}
              {adProduct && (
                <a href={adProduct.affiliateUrl} target="_blank" rel="noopener noreferrer" className="block relative rounded-2xl overflow-hidden border border-red-500/30 group my-4">
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1 shadow-md shadow-red-900/50 uppercase tracking-wider">
                    <Star className="w-3 h-3 fill-current" /> SPONSORED
                  </div>
                  <div className="flex bg-zinc-900/80 backdrop-blur-sm relative z-0">
                    <div className="w-24 h-24 shrink-0 bg-white">
                      <img src={adProduct.imageUrl || 'https://via.placeholder.com/150'} alt={adProduct.title} className="w-full h-full object-contain p-2" />
                    </div>
                    <div className="p-3 flex flex-col justify-center flex-1">
                      <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight mb-1 group-hover:text-red-400 transition-colors">{adProduct.title}</h4>
                      <div className="flex items-center gap-2 mt-auto">
                        <span className="text-xs font-semibold text-red-500 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded-md">
                          Buy Now <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/10 pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity" />
                </a>
              )}`;

const targetHtml = `              {/* Synopsis */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Synopsis</h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {movie.synopsis || "No detailed synopsis available for this title."}
                </p>
              </div>

              {/* Cast & Crew */}`;

code = code.replace(targetHtml, `              {/* Synopsis */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Synopsis</h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {movie.synopsis || "No detailed synopsis available for this title."}
                </p>
              </div>

              ${adHtml}

              {/* Cast & Crew */}`);

fs.writeFileSync('src/components/PlayerModal.tsx', code);
