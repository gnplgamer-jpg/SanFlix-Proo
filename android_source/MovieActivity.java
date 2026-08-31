package com.chanelentertainment.sanflixpro;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

public class MovieActivity extends AppCompatActivity {

    private LinearLayout rootLayout;
    private LinearLayout filterChipsContainer;
    
    // Core Containers
    private ScrollView mainScrollView;
    private LinearLayout contentContainer;
    
    // Highlighted / Featured Section
    private RecyclerView featuredRecycler;
    
    // Default Mode Rails
    private LinearLayout defaultRailsContainer;
    private RecyclerView bollywoodRail;
    private RecyclerView hollywoodRail;
    private RecyclerView southTollywoodRail;
    private RecyclerView globalRail;

    // Filtered Grid Mode
    private RecyclerView filteredGridRecycler;

    private DatabaseReference contentRef;

    private String activeFilter = "🎥 All Movies";

    private final String[] movieFilters = {
            "🎥 All Movies", "🔥 Trending", "🎬 Bollywood", "🇺🇸 Hollywood", 
            "🌴 South Indian", "🏹 Tollywood", "🌍 Global Cinema", "💥 Action", 
            "💖 Romance", "🕵️ Crime", "👻 Horror", "🚀 Sci-Fi"
    };

    // Data lists
    private List<Map<String, Object>> masterMoviesList = new ArrayList<>();
    private List<Map<String, Object>> featuredList = new ArrayList<>();
    private List<Map<String, Object>> bollywoodList = new ArrayList<>();
    private List<Map<String, Object>> hollywoodList = new ArrayList<>();
    private List<Map<String, Object>> southTollywoodList = new ArrayList<>();
    private List<Map<String, Object>> globalList = new ArrayList<>();
    private List<Map<String, Object>> filteredGridData = new ArrayList<>();

    // Adapters
    private FeaturedAdapter featuredAdapter;
    private RailAdapter bollywoodAdapter;
    private RailAdapter hollywoodAdapter;
    private RailAdapter southTollywoodAdapter;
    private RailAdapter globalAdapter;
    private GridAdapter gridAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        contentRef = FirebaseDatabase.getInstance().getReference("SanFlix_Content");

        buildUI();
        setContentView(rootLayout);

        setupFilterChips();
        fetchMovies();
    }

    private void buildUI() {
        rootLayout = new LinearLayout(this);
        rootLayout.setOrientation(LinearLayout.VERTICAL);
        rootLayout.setBackgroundColor(Color.parseColor("#0F141F")); 
        rootLayout.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        // Toolbar
        Toolbar toolbar = new Toolbar(this);
        toolbar.setBackgroundColor(Color.parseColor("#0A0E17"));
        toolbar.setTitleTextColor(Color.WHITE);
        toolbar.setTitle("Movies Hub");
        rootLayout.addView(toolbar);

        // Chips Rail
        HorizontalScrollView hScrollFilters = new HorizontalScrollView(this);
        hScrollFilters.setHorizontalScrollBarEnabled(false);
        hScrollFilters.setPadding(dpToPx(8), dpToPx(16), dpToPx(8), dpToPx(12));
        filterChipsContainer = new LinearLayout(this);
        filterChipsContainer.setOrientation(LinearLayout.HORIZONTAL);
        hScrollFilters.addView(filterChipsContainer);
        rootLayout.addView(hScrollFilters);

        // Main Scrollable Area for Featured + Conditional Content
        mainScrollView = new ScrollView(this);
        mainScrollView.setLayoutParams(new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        mainScrollView.setVerticalScrollBarEnabled(false);

        contentContainer = new LinearLayout(this);
        contentContainer.setOrientation(LinearLayout.VERTICAL);
        contentContainer.setPadding(0, 0, 0, dpToPx(32));
        mainScrollView.addView(contentContainer);
        rootLayout.addView(mainScrollView);

        // 1. Featured Spotlight
        addSectionTitle("Featured Showcases", contentContainer);
        featuredRecycler = new RecyclerView(this);
        featuredRecycler.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        featuredRecycler.setPadding(dpToPx(12), 0, dpToPx(12), dpToPx(16));
        featuredRecycler.setClipToPadding(false);
        featuredAdapter = new FeaturedAdapter();
        featuredRecycler.setAdapter(featuredAdapter);
        contentContainer.addView(featuredRecycler);

        // 2. Conditional Container for Default Rails
        defaultRailsContainer = new LinearLayout(this);
        defaultRailsContainer.setOrientation(LinearLayout.VERTICAL);
        contentContainer.addView(defaultRailsContainer);

        // Populate Default Rails
        addSectionTitle("Latest Bollywood Hits", defaultRailsContainer);
        bollywoodRail = createHorizontalRecycler();
        bollywoodAdapter = new RailAdapter(bollywoodList);
        bollywoodRail.setAdapter(bollywoodAdapter);
        defaultRailsContainer.addView(bollywoodRail);

        addSectionTitle("Hollywood Premiere", defaultRailsContainer);
        hollywoodRail = createHorizontalRecycler();
        hollywoodAdapter = new RailAdapter(hollywoodList);
        hollywoodRail.setAdapter(hollywoodAdapter);
        defaultRailsContainer.addView(hollywoodRail);

        addSectionTitle("South Indian & Tollywood Action", defaultRailsContainer);
        southTollywoodRail = createHorizontalRecycler();
        southTollywoodAdapter = new RailAdapter(southTollywoodList);
        southTollywoodRail.setAdapter(southTollywoodAdapter);
        defaultRailsContainer.addView(southTollywoodRail);

        addSectionTitle("Global Language Cinema", defaultRailsContainer);
        globalRail = createHorizontalRecycler();
        globalAdapter = new RailAdapter(globalList);
        globalRail.setAdapter(globalAdapter);
        defaultRailsContainer.addView(globalRail);

        // 3. Filtered Grid Matrix
        filteredGridRecycler = new RecyclerView(this);
        filteredGridRecycler.setLayoutManager(new GridLayoutManager(this, 3));
        filteredGridRecycler.setPadding(dpToPx(8), 0, dpToPx(8), dpToPx(32));
        filteredGridRecycler.setClipToPadding(false);
        gridAdapter = new GridAdapter();
        filteredGridRecycler.setAdapter(gridAdapter);
        filteredGridRecycler.setVisibility(View.GONE); // Hidden by default
        contentContainer.addView(filteredGridRecycler);
    }

    private RecyclerView createHorizontalRecycler() {
        RecyclerView rv = new RecyclerView(this);
        rv.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        rv.setPadding(dpToPx(12), 0, dpToPx(12), 0);
        rv.setClipToPadding(false);
        rv.setLayoutParams(new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        return rv;
    }

    private void addSectionTitle(String title, LinearLayout parent) {
        TextView tv = new TextView(this);
        tv.setText(title);
        tv.setTextColor(Color.WHITE);
        tv.setTypeface(null, Typeface.BOLD);
        tv.setTextSize(18);
        tv.setPadding(dpToPx(16), dpToPx(24), dpToPx(16), dpToPx(12));
        parent.addView(tv);
    }

    private void setupFilterChips() {
        filterChipsContainer.removeAllViews();
        for (final String cat : movieFilters) {
            final TextView chip = new TextView(this);
            chip.setText(cat);
            chip.setTypeface(null, Typeface.BOLD);
            chip.setTextSize(13);
            chip.setPadding(dpToPx(16), dpToPx(8), dpToPx(16), dpToPx(8));
            
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            params.setMargins(0, 0, dpToPx(10), 0);
            chip.setLayoutParams(params);

            boolean isActive = cat.equalsIgnoreCase(activeFilter);
            
            GradientDrawable bg = new GradientDrawable();
            bg.setCornerRadius(dpToPx(20));
            if (isActive) {
                bg.setColors(new int[]{Color.parseColor("#E50914"), Color.parseColor("#800000")});
                bg.setOrientation(GradientDrawable.Orientation.TL_BR);
                chip.setTextColor(Color.WHITE);
            } else {
                bg.setColor(Color.parseColor("#1E293B"));
                chip.setTextColor(Color.parseColor("#94A3B8"));
            }
            chip.setBackground(bg);

            chip.setOnClickListener(v -> {
                activeFilter = cat;
                setupFilterChips();
                handleFilterChange();
            });

            filterChipsContainer.addView(chip);
        }
    }

    private void handleFilterChange() {
        if ("🎥 All Movies".equalsIgnoreCase(activeFilter)) {
            defaultRailsContainer.setVisibility(View.VISIBLE);
            filteredGridRecycler.setVisibility(View.GONE);
        } else {
            defaultRailsContainer.setVisibility(View.GONE);
            filteredGridRecycler.setVisibility(View.VISIBLE);
            
            filteredGridData.clear();
            String query = activeFilter.toLowerCase().replaceAll("[^a-z ]", "").trim();
            
            for (Map<String, Object> item : masterMoviesList) {
                String title = extractSafeString(item, "title").toLowerCase();
                String category = extractSafeString(item, "mapped_category_rail").toLowerCase();
                
                if ("trending".equals(query) && "true".equals(String.valueOf(item.get("is_highlighted")).toLowerCase())) {
                     filteredGridData.add(item);
                } else if (category.contains(query) || title.contains(query)) {
                     filteredGridData.add(item);
                } else if (query.contains("south") && category.contains("tollywood")) {
                     filteredGridData.add(item);
                } else if (query.contains("global") && category.contains("global")) {
                     filteredGridData.add(item);
                }
            }
            gridAdapter.notifyDataSetChanged();
        }
    }

    private void fetchMovies() {
        contentRef.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                masterMoviesList.clear();
                for (DataSnapshot ds : snapshot.getChildren()) {
                    Object val = ds.getValue();
                    if (val instanceof Map) {
                        try {
                            Map<String, Object> item = (Map<String, Object>) val;
                            String format = extractSafeString(item, "media_layout_format").toLowerCase();
                            
                            // Only target Movie layouts
                            if (format.contains("movie")) {
                                if (!item.containsKey("id")) item.put("id", ds.getKey());
                                masterMoviesList.add(item);
                            }
                        } catch (Exception ignored) {}
                    }
                }
                
                // Sort by release date descending (heuristic sort if String)
                Collections.sort(masterMoviesList, new Comparator<Map<String, Object>>() {
                    @Override
                    public int compare(Map<String, Object> o1, Map<String, Object> o2) {
                        String d1 = extractSafeString(o1, "release_date");
                        String d2 = extractSafeString(o2, "release_date");
                        if (d1.isEmpty() && d2.isEmpty()) return 0;
                        if (d1.isEmpty()) return 1;
                        if (d2.isEmpty()) return -1;
                        return d2.compareTo(d1); // Descending simple string compare assuming YYYY-MM-DD
                    }
                });

                categorizeMoviesData();
                handleFilterChange();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Toast.makeText(MovieActivity.this, "Failed to fetch movies", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void categorizeMoviesData() {
        featuredList.clear();
        bollywoodList.clear();
        hollywoodList.clear();
        southTollywoodList.clear();
        globalList.clear();

        for (Map<String, Object> item : masterMoviesList) {
            String category = extractSafeString(item, "mapped_category_rail").toLowerCase();
            String isHighlightRaw = String.valueOf(item.get("is_highlighted"));
            
            if (isHighlightRaw.equals("true")) {
                featuredList.add(item);
            }

            if (category.contains("bollywood")) {
                bollywoodList.add(item);
            } else if (category.contains("hollywood")) {
                hollywoodList.add(item);
            } else if (category.contains("south indian") || category.contains("tollywood")) {
                southTollywoodList.add(item);
            } else if (category.contains("global")) {
                globalList.add(item);
            }
        }

        featuredAdapter.notifyDataSetChanged();
        bollywoodAdapter.notifyDataSetChanged();
        hollywoodAdapter.notifyDataSetChanged();
        southTollywoodAdapter.notifyDataSetChanged();
        globalAdapter.notifyDataSetChanged();
    }

    private void navigateToStream(Map<String, Object> item) {
        String adGateRaw = String.valueOf(item.get("ad_gate"));
        boolean isAdGated = adGateRaw.equals("true");

        Intent intent = new Intent(MovieActivity.this, StreamActivity.class);
        intent.putExtra("id", extractSafeString(item, "id"));
        intent.putExtra("title", extractSafeString(item, "title"));
        intent.putExtra("mapped_category_rail", extractSafeString(item, "mapped_category_rail"));
        intent.putExtra("trailer_id", extractSafeString(item, "trailer_id"));
        intent.putExtra("streaming_link_1", extractSafeString(item, "streaming_link_1"));
        intent.putExtra("streaming_link_2", extractSafeString(item, "streaming_link_2"));
        intent.putExtra("streaming_link_3", extractSafeString(item, "streaming_link_3"));
        intent.putExtra("ad_gate", isAdGated);
        startActivity(intent);
    }

    // --- RECYCLER ADAPTERS ---

    private class FeaturedAdapter extends RecyclerView.Adapter<FeaturedAdapter.FeatureViewHolder> {
        @NonNull
        @Override
        public FeatureViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            CardView card = new CardView(MovieActivity.this);
            card.setCardBackgroundColor(Color.parseColor("#18181B"));
            card.setRadius(dpToPx(16));
            card.setCardElevation(dpToPx(8));
            
            // 16:9 Aspect Ratio Approx
            int width = getResources().getDisplayMetrics().widthPixels - dpToPx(64);
            RecyclerView.LayoutParams cardParams = new RecyclerView.LayoutParams(
                    width, (int)(width * 9.0/16.0));
            cardParams.setMargins(dpToPx(4), dpToPx(8), dpToPx(12), dpToPx(8));
            card.setLayoutParams(cardParams);

            RelativeLayout root = new RelativeLayout(MovieActivity.this);
            root.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

            ImageView ivBackdrop = new ImageView(MovieActivity.this);
            ivBackdrop.setScaleType(ImageView.ScaleType.CENTER_CROP);
            ivBackdrop.setLayoutParams(new RelativeLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
            root.addView(ivBackdrop);

            // Glassmorphism overlay
            FrameLayout overlay = new FrameLayout(MovieActivity.this);
            RelativeLayout.LayoutParams overlayParams = new RelativeLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            overlayParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
            overlay.setLayoutParams(overlayParams);
            GradientDrawable gd = new GradientDrawable(
                    GradientDrawable.Orientation.BOTTOM_TOP,
                    new int[]{Color.parseColor("#E6000000"), Color.parseColor("#80000000"), Color.TRANSPARENT});
            overlay.setBackground(gd);
            overlay.setPadding(dpToPx(16), dpToPx(32), dpToPx(16), dpToPx(16));

            LinearLayout infoBox = new LinearLayout(MovieActivity.this);
            infoBox.setOrientation(LinearLayout.VERTICAL);

            TextView tvTitle = new TextView(MovieActivity.this);
            tvTitle.setTextColor(Color.WHITE);
            tvTitle.setTextSize(18);
            tvTitle.setTypeface(null, Typeface.BOLD);
            tvTitle.setMaxLines(1);
            tvTitle.setEllipsize(TextUtils.TruncateAt.END);

            TextView tvRating = new TextView(MovieActivity.this);
            tvRating.setTextColor(Color.parseColor("#FACC15")); // Yellow
            tvRating.setTextSize(12);
            tvRating.setTypeface(null, Typeface.BOLD);
            tvRating.setPadding(0, dpToPx(4), 0, 0);

            infoBox.addView(tvTitle);
            infoBox.addView(tvRating);
            overlay.addView(infoBox);

            root.addView(overlay);
            card.addView(root);

            return new FeatureViewHolder(card, ivBackdrop, tvTitle, tvRating);
        }

        @Override
        public void onBindViewHolder(@NonNull FeatureViewHolder holder, int position) {
            Map<String, Object> item = featuredList.get(position);
            holder.tvTitle.setText(extractSafeString(item, "title"));
            String rating = extractSafeString(item, "rating");
            holder.tvRating.setText(rating.isEmpty() ? "⭐ N/A" : "⭐ IMDB " + rating);
            
            holder.ivBackdrop.setBackgroundColor(Color.parseColor("#27272A"));
            holder.itemView.setOnClickListener(v -> navigateToStream(item));
        }

        @Override public int getItemCount() { return featuredList.size(); }

        class FeatureViewHolder extends RecyclerView.ViewHolder {
            ImageView ivBackdrop; TextView tvTitle; TextView tvRating;
            public FeatureViewHolder(@NonNull View itemView, ImageView iv, TextView tvT, TextView tvR) {
                super(itemView);
                this.ivBackdrop = iv; this.tvTitle = tvT; this.tvRating = tvR;
            }
        }
    }

    private class GridAdapter extends RecyclerView.Adapter<GridAdapter.GridViewHolder> {
        @NonNull
        @Override
        public GridViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            return new GridViewHolder(createPremiumMovieCard());
        }

        @Override
        public void onBindViewHolder(@NonNull GridViewHolder holder, int position) {
            Map<String, Object> item = filteredGridData.get(position);
            holder.bind(item);
        }
        @Override public int getItemCount() { return filteredGridData.size(); }

        class GridViewHolder extends RecyclerView.ViewHolder {
            ImageView ivPoster; TextView tvTitle; TextView topBadge; TextView bottomBadge;
            public GridViewHolder(@NonNull View itemView) {
                super(itemView);
                ViewGroup root = (ViewGroup) ((CardView) itemView).getChildAt(0);
                this.ivPoster = (ImageView) root.getChildAt(0);
                ViewGroup badgeContainer = (ViewGroup) root.getChildAt(1);
                this.topBadge = (TextView) badgeContainer.getChildAt(0);
                ViewGroup footer = (ViewGroup) root.getChildAt(2);
                this.bottomBadge = (TextView) ((ViewGroup)footer.getChildAt(0)).getChildAt(1);
                this.tvTitle = (TextView) ((ViewGroup)footer.getChildAt(0)).getChildAt(0);
            }
            public void bind(Map<String, Object> item) {
                tvTitle.setText(extractSafeString(item, "title"));
                ivPoster.setBackgroundColor(Color.parseColor("#334155")); // Placeholder Shimmer Mock
                
                String adGateRaw = String.valueOf(item.get("ad_gate"));
                boolean isAdGated = adGateRaw.equals("true");
                
                if (isAdGated) {
                    topBadge.setText("🔒 VIP");
                    topBadge.setBackgroundColor(Color.parseColor("#DC2626"));
                } else {
                    topBadge.setText("⚡ HD");
                    topBadge.setBackgroundColor(Color.parseColor("#16A34A"));
                }

                String r = extractSafeString(item, "rating");
                bottomBadge.setText(r.isEmpty() ? "⭐" : "⭐ " + r);

                itemView.setOnClickListener(v -> navigateToStream(item));
            }
        }
    }

    private class RailAdapter extends RecyclerView.Adapter<GridAdapter.GridViewHolder> {
        private List<Map<String, Object>> dataset;
        public RailAdapter(List<Map<String, Object>> ds) { this.dataset = ds; }

        @NonNull
        @Override
        public GridAdapter.GridViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View card = createPremiumMovieCard();
            RecyclerView.LayoutParams params = new RecyclerView.LayoutParams(
                    dpToPx(110), dpToPx(160));
            params.setMargins(dpToPx(4), dpToPx(4), dpToPx(4), dpToPx(8));
            card.setLayoutParams(params);
            return new GridAdapter().new GridViewHolder(card); // Reusing GridViewHolder logic structure
        }

        @Override
        public void onBindViewHolder(@NonNull GridAdapter.GridViewHolder holder, int position) {
            holder.bind(dataset.get(position));
        }
        @Override public int getItemCount() { return dataset.size(); }
    }

    // Builder for the shared Card View style
    private View createPremiumMovieCard() {
        CardView card = new CardView(this);
        card.setCardBackgroundColor(Color.parseColor("#1E293B"));
        card.setRadius(dpToPx(15));
        card.setCardElevation(dpToPx(4));
        
        GridLayoutManager.LayoutParams cardParams = new GridLayoutManager.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(170));
        cardParams.setMargins(dpToPx(4), dpToPx(4), dpToPx(4), dpToPx(12));
        card.setLayoutParams(cardParams);

        RelativeLayout rlCardRoot = new RelativeLayout(this);
        rlCardRoot.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        // Poster
        ImageView ivPoster = new ImageView(this);
        ivPoster.setScaleType(ImageView.ScaleType.CENTER_CROP);
        ivPoster.setLayoutParams(new RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        rlCardRoot.addView(ivPoster);

        // Top Badges Container
        RelativeLayout topBadges = new RelativeLayout(this);
        topBadges.setLayoutParams(new RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        topBadges.setPadding(dpToPx(6), dpToPx(6), dpToPx(6), dpToPx(6));

        TextView rightBadge = new TextView(this);
        rightBadge.setTextColor(Color.WHITE);
        rightBadge.setTextSize(9);
        rightBadge.setTypeface(null, Typeface.BOLD);
        rightBadge.setPadding(dpToPx(6), dpToPx(2), dpToPx(6), dpToPx(2));
        GradientDrawable badgeBg = new GradientDrawable();
        badgeBg.setCornerRadius(dpToPx(4));
        rightBadge.setBackground(badgeBg);
        
        RelativeLayout.LayoutParams rightBadgeParams = new RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        rightBadgeParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
        rightBadge.setLayoutParams(rightBadgeParams);
        
        topBadges.addView(rightBadge);
        rlCardRoot.addView(topBadges);

        // Footer Fade Overlay
        FrameLayout footerContainer = new FrameLayout(this);
        RelativeLayout.LayoutParams footerParams = new RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        footerParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        footerContainer.setLayoutParams(footerParams);
        
        GradientDrawable fadeBg = new GradientDrawable(
                GradientDrawable.Orientation.BOTTOM_TOP,
                new int[]{Color.parseColor("#F2000000"), Color.parseColor("#99000000"), Color.TRANSPARENT});
        footerContainer.setBackground(fadeBg);
        footerContainer.setPadding(dpToPx(8), dpToPx(24), dpToPx(8), dpToPx(8));

        LinearLayout footerViews = new LinearLayout(this);
        footerViews.setOrientation(LinearLayout.VERTICAL);

        TextView tvTitle = new TextView(this);
        tvTitle.setTextColor(Color.WHITE);
        tvTitle.setTextSize(12);
        tvTitle.setTypeface(null, Typeface.BOLD);
        tvTitle.setMaxLines(1);
        tvTitle.setEllipsize(TextUtils.TruncateAt.END);
        
        TextView tvRating = new TextView(this);
        tvRating.setTextColor(Color.parseColor("#FACC15"));
        tvRating.setTextSize(9);
        tvRating.setTypeface(null, Typeface.BOLD);
        tvRating.setPadding(0, dpToPx(2), 0, 0);

        footerViews.addView(tvTitle);
        footerViews.addView(tvRating);
        footerContainer.addView(footerViews);

        rlCardRoot.addView(footerContainer);
        card.addView(rlCardRoot);

        return card;
    }

    private String extractSafeString(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? String.valueOf(v) : "";
    }

    private int dpToPx(int dp) {
        return Math.round(TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, dp, getResources().getDisplayMetrics()));
    }
}
