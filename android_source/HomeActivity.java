package com.chanelentertainment.sanflixpro;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
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
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.widget.ViewPager2;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class HomeActivity extends AppCompatActivity {

    private LinearLayout rootLayout;
    private LinearLayout filterChipsContainer;
    
    // Complex Layout containers
    private ScrollView mainScrollView;
    private LinearLayout homeContentContainer;
    private ViewPager2 sliderViewPager;
    
    private LinearLayout adultSectionRoot;
    private LinearLayout adultChipsContainer;
    private RecyclerView adultRailRecycler;

    private RecyclerView networkRailRecycler;
    private RecyclerView southRailRecycler;
    private RecyclerView romanceActionRailRecycler;
    private RecyclerView crimeSciFiRailRecycler;

    // Filtered layout container
    private RecyclerView filteredGridRecycler;

    private DatabaseReference contentRef;
    private SharedPreferences sharedPrefs;
    private boolean isAdultHubEnabled = false;

    private String activeGlobalFilter = "All Content";
    private String activeAdultFilter = "All Adult Content";

    private final String[] globalCategories = {"All Content", "Recently Loaded", "Movies", "TV Shows", "Action", "Romance", "Horror", "Comedy", "Sci-Fi", "Drama", "Animation", "Crime", "Old is Gold"};
    private final String[] adultCategories = {"All Adult Content", "PRIMESHOTS", "CHULLTV", "HOTX VIP", "DESIFLIX", "Hot web series", "Short Film", "Mms viral video"};

    // Data lists
    private List<Map<String, Object>> masterDataset = new ArrayList<>();
    private List<Map<String, Object>> highlightList = new ArrayList<>();
    private List<Map<String, Object>> adultDataset = new ArrayList<>();
    private List<Map<String, Object>> southDataset = new ArrayList<>();
    private List<Map<String, Object>> romanceActionDataset = new ArrayList<>();
    private List<Map<String, Object>> crimeSciFiDataset = new ArrayList<>();
    private List<Map<String, Object>> filteredDataset = new ArrayList<>();

    // Adapters
    private SliderAdapter sliderAdapter;
    private RailAdapter adultAdapter;
    private RailAdapter southAdapter;
    private RailAdapter romanceActionAdapter;
    private RailAdapter crimeSciFiAdapter;
    private FilteredGridAdapter gridAdapter;

    private Handler sliderHandler = new Handler(Looper.getMainLooper());
    private Runnable sliderRunnable;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        sharedPrefs = getSharedPreferences("SanFlix_Prefs", Context.MODE_PRIVATE);
        isAdultHubEnabled = sharedPrefs.getBoolean("is_adult_hub_enabled", false);
        contentRef = FirebaseDatabase.getInstance().getReference("SanFlix_Content");

        buildUI();
        setContentView(rootLayout);

        setupGlobalChips();
        if (isAdultHubEnabled) {
            setupAdultChips();
        }
        
        fetchDatabase();
    }

    private void buildUI() {
        rootLayout = new LinearLayout(this);
        rootLayout.setOrientation(LinearLayout.VERTICAL);
        rootLayout.setBackgroundColor(Color.parseColor("#0F141F")); // Cinematic Dark Space
        rootLayout.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        // Global Categories Rail
        HorizontalScrollView hScrollFilters = new HorizontalScrollView(this);
        hScrollFilters.setHorizontalScrollBarEnabled(false);
        hScrollFilters.setPadding(dpToPx(8), dpToPx(16), dpToPx(8), dpToPx(8));
        filterChipsContainer = new LinearLayout(this);
        filterChipsContainer.setOrientation(LinearLayout.HORIZONTAL);
        hScrollFilters.addView(filterChipsContainer);
        rootLayout.addView(hScrollFilters);

        // Filtered Grid Container (Hidden by default)
        filteredGridRecycler = new RecyclerView(this);
        filteredGridRecycler.setLayoutManager(new GridLayoutManager(this, 3));
        gridAdapter = new FilteredGridAdapter();
        filteredGridRecycler.setAdapter(gridAdapter);
        filteredGridRecycler.setVisibility(View.GONE);
        LinearLayout.LayoutParams gridParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        gridParams.setMargins(dpToPx(8), 0, dpToPx(8), 0);
        filteredGridRecycler.setLayoutParams(gridParams);
        rootLayout.addView(filteredGridRecycler);

        // Main Home Scroll View (Visible by default)
        mainScrollView = new ScrollView(this);
        mainScrollView.setLayoutParams(new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        mainScrollView.setVerticalScrollBarEnabled(false);

        homeContentContainer = new LinearLayout(this);
        homeContentContainer.setOrientation(LinearLayout.VERTICAL);
        homeContentContainer.setPadding(0, 0, 0, dpToPx(32));

        // 1. Slider Banner
        sliderViewPager = new ViewPager2(this);
        sliderViewPager.setLayoutParams(new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(220)));
        sliderAdapter = new SliderAdapter();
        sliderViewPager.setAdapter(sliderAdapter);
        homeContentContainer.addView(sliderViewPager);

        // 2. Network Channels Rail (Static Brand Items)
        addSectionTitle("📺 Popular Network Channels", homeContentContainer);
        networkRailRecycler = createHorizontalRecycler();
        NetworkRailAdapter networkAdapter = new NetworkRailAdapter();
        networkRailRecycler.setAdapter(networkAdapter);
        homeContentContainer.addView(networkRailRecycler);

        // 3. User Gated 18+ Premium Hub
        if (isAdultHubEnabled) {
            adultSectionRoot = new LinearLayout(this);
            adultSectionRoot.setOrientation(LinearLayout.VERTICAL);
            adultSectionRoot.setPadding(0, dpToPx(24), 0, dpToPx(8));
            
            addSectionTitle("🔞 18+ Premium Hub", adultSectionRoot);
            
            HorizontalScrollView hScrollAdult = new HorizontalScrollView(this);
            hScrollAdult.setHorizontalScrollBarEnabled(false);
            hScrollAdult.setPadding(dpToPx(16), 0, dpToPx(16), dpToPx(12));
            adultChipsContainer = new LinearLayout(this);
            adultChipsContainer.setOrientation(LinearLayout.HORIZONTAL);
            hScrollAdult.addView(adultChipsContainer);
            adultSectionRoot.addView(hScrollAdult);

            adultRailRecycler = createHorizontalRecycler();
            adultAdapter = new RailAdapter(adultDataset);
            adultRailRecycler.setAdapter(adultAdapter);
            adultSectionRoot.addView(adultRailRecycler);

            homeContentContainer.addView(adultSectionRoot);
        }

        // 4. Multi-Industry Rails
        addSectionTitle("🌴 South Indian & Tollywood Hits", homeContentContainer);
        southRailRecycler = createHorizontalRecycler();
        southAdapter = new RailAdapter(southDataset);
        southRailRecycler.setAdapter(southAdapter);
        homeContentContainer.addView(southRailRecycler);

        addSectionTitle("🎭 Romance & Action Matrix", homeContentContainer);
        romanceActionRailRecycler = createHorizontalRecycler();
        romanceActionAdapter = new RailAdapter(romanceActionDataset);
        romanceActionRailRecycler.setAdapter(romanceActionAdapter);
        homeContentContainer.addView(romanceActionRailRecycler);

        addSectionTitle("🕵️ Crime Thrillers & Sci-Fi", homeContentContainer);
        crimeSciFiRailRecycler = createHorizontalRecycler();
        crimeSciFiAdapter = new RailAdapter(crimeSciFiDataset);
        crimeSciFiRailRecycler.setAdapter(crimeSciFiAdapter);
        homeContentContainer.addView(crimeSciFiRailRecycler);

        mainScrollView.addView(homeContentContainer);
        rootLayout.addView(mainScrollView);
    }

    private void addSectionTitle(String title, LinearLayout parent) {
        TextView tv = new TextView(this);
        tv.setText(title);
        tv.setTextColor(Color.WHITE);
        tv.setTypeface(null, Typeface.BOLD);
        tv.setTextSize(16);
        tv.setPadding(dpToPx(16), dpToPx(24), dpToPx(16), dpToPx(8));
        parent.addView(tv);
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

    private void setupGlobalChips() {
        filterChipsContainer.removeAllViews();
        for (final String cat : globalCategories) {
            final TextView chip = new TextView(this);
            chip.setText(cat);
            chip.setTypeface(null, Typeface.BOLD);
            chip.setTextSize(12);
            chip.setPadding(dpToPx(16), dpToPx(8), dpToPx(16), dpToPx(8));
            
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            params.setMargins(dpToPx(8), 0, dpToPx(8), 0);
            chip.setLayoutParams(params);

            boolean isActive = cat.equalsIgnoreCase(activeGlobalFilter);
            GradientDrawable bg = new GradientDrawable();
            bg.setCornerRadius(dpToPx(20));
            bg.setColor(isActive ? Color.parseColor("#E50914") : Color.parseColor("#1E293B"));
            chip.setBackground(bg);
            chip.setTextColor(isActive ? Color.WHITE : Color.parseColor("#94A3B8"));

            chip.setOnClickListener(v -> {
                activeGlobalFilter = cat;
                setupGlobalChips();
                handleGlobalFilterChange();
            });

            filterChipsContainer.addView(chip);
        }
    }

    private void setupAdultChips() {
        if (adultChipsContainer == null) return;
        adultChipsContainer.removeAllViews();
        for (final String cat : adultCategories) {
            final TextView chip = new TextView(this);
            chip.setText(cat);
            chip.setTypeface(null, Typeface.BOLD);
            chip.setTextSize(11);
            chip.setPadding(dpToPx(12), dpToPx(6), dpToPx(12), dpToPx(6));
            
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            params.setMargins(0, 0, dpToPx(8), 0);
            chip.setLayoutParams(params);

            boolean isActive = cat.equalsIgnoreCase(activeAdultFilter);
            GradientDrawable bg = new GradientDrawable();
            bg.setCornerRadius(dpToPx(16));
            bg.setColor(isActive ? Color.parseColor("#BE185D") : Color.parseColor("#1E293B")); // Subtle pink/red for premium
            chip.setBackground(bg);
            chip.setTextColor(isActive ? Color.WHITE : Color.parseColor("#94A3B8"));

            chip.setOnClickListener(v -> {
                activeAdultFilter = cat;
                setupAdultChips();
                categorizeData(); 
            });

            adultChipsContainer.addView(chip);
        }
    }

    private void handleGlobalFilterChange() {
        if ("All Content".equalsIgnoreCase(activeGlobalFilter)) {
            mainScrollView.setVisibility(View.VISIBLE);
            filteredGridRecycler.setVisibility(View.GONE);
            startSliderLoop();
        } else {
            mainScrollView.setVisibility(View.GONE);
            filteredGridRecycler.setVisibility(View.VISIBLE);
            stopSliderLoop();
            
            filteredDataset.clear();
            String query = activeGlobalFilter.toLowerCase();
            
            for (Map<String, Object> item : masterDataset) {
                String title = extractSafeString(item, "title").toLowerCase();
                String category = extractSafeString(item, "mapped_category_rail").toLowerCase();
                
                // Allow specific matches
                if (category.contains(query) || title.contains(query)) {
                    filteredDataset.add(item);
                    continue;
                }
                
                // Movies / TV Shows broad matching
                if ("movies".equals(query) && "movie".equals(extractSafeString(item, "media_layout_format").toLowerCase())) {
                    filteredDataset.add(item);
                } else if ("tv shows".equals(query) && extractSafeString(item, "media_layout_format").toLowerCase().contains("show")) {
                    filteredDataset.add(item);
                }
            }
            gridAdapter.notifyDataSetChanged();
        }
    }

    private void fetchDatabase() {
        contentRef.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                masterDataset.clear();
                for (DataSnapshot ds : snapshot.getChildren()) {
                    Object val = ds.getValue();
                    if (val instanceof Map) {
                        try {
                            Map<String, Object> item = (Map<String, Object>) val;
                            // Ensure ID exists
                            if (!item.containsKey("id")) item.put("id", ds.getKey());
                            masterDataset.add(item);
                        } catch (Exception ignored) {}
                    }
                }
                categorizeData();
                handleGlobalFilterChange();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Toast.makeText(HomeActivity.this, "Dataset query failed", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void categorizeData() {
        highlightList.clear();
        southDataset.clear();
        romanceActionDataset.clear();
        crimeSciFiDataset.clear();
        adultDataset.clear();

        for (Map<String, Object> item : masterDataset) {
            String category = extractSafeString(item, "mapped_category_rail").toLowerCase();
            String adGateRaw = String.valueOf(item.get("ad_gate"));
            boolean isAdGated = adGateRaw.equals("true");
            
            // Slider highlights
            String isHighlightRaw = String.valueOf(item.get("is_highlighted"));
            if (isHighlightRaw.equals("true") && (!isAdGated || isAdultHubEnabled)) {
                highlightList.add(item);
            }

            // Adult logic separation
            if (isAdGated) {
                if (isAdultHubEnabled) {
                    if ("All Adult Content".equalsIgnoreCase(activeAdultFilter)) {
                        adultDataset.add(item);
                    } else if (category.contains(activeAdultFilter.toLowerCase())) {
                        adultDataset.add(item);
                    }
                }
                continue; // Do not add ad_gated to normal rails
            }

            // South Indian & Tollywood
            if (category.contains("south indian") || category.contains("tollywood")) {
                southDataset.add(item);
            }
            
            // Romance & Action
            if (category.contains("romance") || category.contains("romantic") || category.contains("action")) {
                romanceActionDataset.add(item);
            }
            
            // Crime & Sci-Fi
            if (category.contains("crime") || category.contains("sci-fi") || category.contains("scifi")) {
                crimeSciFiDataset.add(item);
            }
        }

        sliderAdapter.notifyDataSetChanged();
        if (southAdapter != null) southAdapter.notifyDataSetChanged();
        if (romanceActionAdapter != null) romanceActionAdapter.notifyDataSetChanged();
        if (crimeSciFiAdapter != null) crimeSciFiAdapter.notifyDataSetChanged();
        if (adultAdapter != null) adultAdapter.notifyDataSetChanged();
        
        startSliderLoop();
    }

    // --- SLIDER ENGINE ---
    private void startSliderLoop() {
        stopSliderLoop();
        if (highlightList.isEmpty()) return;
        sliderRunnable = new Runnable() {
            @Override
            public void run() {
                if (sliderViewPager.getAdapter() != null && highlightList.size() > 1) {
                    int next = (sliderViewPager.getCurrentItem() + 1) % highlightList.size();
                    sliderViewPager.setCurrentItem(next, true);
                }
                sliderHandler.postDelayed(this, 3000);
            }
        };
        sliderHandler.postDelayed(sliderRunnable, 3000);
    }

    private void stopSliderLoop() {
        if (sliderRunnable != null) {
            sliderHandler.removeCallbacks(sliderRunnable);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        stopSliderLoop();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if ("All Content".equalsIgnoreCase(activeGlobalFilter)) {
            startSliderLoop();
        }
    }

    private void navigateToStream(Map<String, Object> item) {
        String adGateRaw = String.valueOf(item.get("ad_gate"));
        boolean isAdGated = adGateRaw.equals("true");

        Intent intent = new Intent(HomeActivity.this, StreamActivity.class);
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

    private class SliderAdapter extends RecyclerView.Adapter<SliderAdapter.SliderViewHolder> {
        @NonNull
        @Override
        public SliderViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            FrameLayout layout = new FrameLayout(HomeActivity.this);
            layout.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

            ImageView ivBackdrop = new ImageView(HomeActivity.this);
            ivBackdrop.setId(View.generateViewId());
            ivBackdrop.setScaleType(ImageView.ScaleType.CENTER_CROP);
            ivBackdrop.setLayoutParams(new FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
            layout.addView(ivBackdrop);

            FrameLayout gradientOverlay = new FrameLayout(HomeActivity.this);
            GradientDrawable gd = new GradientDrawable(
                    GradientDrawable.Orientation.BOTTOM_TOP,
                    new int[]{Color.parseColor("#E60F141F"), Color.TRANSPARENT});
            gradientOverlay.setBackground(gd);
            gradientOverlay.setLayoutParams(new FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
            layout.addView(gradientOverlay);

            LinearLayout textContainer = new LinearLayout(HomeActivity.this);
            textContainer.setOrientation(LinearLayout.VERTICAL);
            FrameLayout.LayoutParams textParams = new FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            textParams.gravity = Gravity.BOTTOM;
            textParams.setMargins(dpToPx(16), 0, dpToPx(16), dpToPx(16));
            textContainer.setLayoutParams(textParams);

            TextView tvTitle = new TextView(HomeActivity.this);
            tvTitle.setId(View.generateViewId());
            tvTitle.setTextColor(Color.WHITE);
            tvTitle.setTextSize(16);
            tvTitle.setTypeface(null, Typeface.BOLD);
            tvTitle.setMaxLines(2);
            tvTitle.setEllipsize(TextUtils.TruncateAt.END);
            
            TextView btnPlay = new TextView(HomeActivity.this);
            btnPlay.setId(View.generateViewId());
            btnPlay.setText("▶ PLAY NOW");
            btnPlay.setTextColor(Color.WHITE);
            btnPlay.setTextSize(12);
            btnPlay.setTypeface(null, Typeface.BOLD);
            btnPlay.setBackgroundColor(Color.parseColor("#E50914"));
            btnPlay.setPadding(dpToPx(24), dpToPx(8), dpToPx(24), dpToPx(8));
            LinearLayout.LayoutParams btnParams = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            btnParams.setMargins(0, dpToPx(8), 0, 0);
            btnPlay.setLayoutParams(btnParams);

            textContainer.addView(tvTitle);
            textContainer.addView(btnPlay);
            layout.addView(textContainer);

            return new SliderViewHolder(layout, ivBackdrop, tvTitle, btnPlay);
        }

        @Override
        public void onBindViewHolder(@NonNull SliderViewHolder holder, int position) {
            Map<String, Object> item = highlightList.get(position);
            holder.tvTitle.setText(extractSafeString(item, "title"));
            
            // Native placeholder background simulation. In standard dev, use Glide.
            holder.ivBackdrop.setBackgroundColor(Color.parseColor("#27272A"));
            
            holder.btnPlay.setOnClickListener(v -> navigateToStream(item));
        }

        @Override
        public int getItemCount() {
            return highlightList.size();
        }

        class SliderViewHolder extends RecyclerView.ViewHolder {
            ImageView ivBackdrop; TextView tvTitle; TextView btnPlay;
            public SliderViewHolder(@NonNull View itemView, ImageView iv, TextView tv, TextView btn) {
                super(itemView);
                this.ivBackdrop = iv;
                this.tvTitle = tv;
                this.btnPlay = btn;
            }
        }
    }

    private class RailAdapter extends RecyclerView.Adapter<RailAdapter.RailViewHolder> {
        private List<Map<String, Object>> dataset;

        public RailAdapter(List<Map<String, Object>> ds) {
            this.dataset = ds;
        }

        @NonNull
        @Override
        public RailViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            CardView card = new CardView(HomeActivity.this);
            card.setCardBackgroundColor(Color.parseColor("#1E293B"));
            card.setRadius(dpToPx(12));
            card.setCardElevation(dpToPx(4));
            
            RecyclerView.LayoutParams cardParams = new RecyclerView.LayoutParams(
                    dpToPx(110), dpToPx(160));
            cardParams.setMargins(dpToPx(4), dpToPx(4), dpToPx(4), dpToPx(8));
            card.setLayoutParams(cardParams);

            RelativeLayout rlCardRoot = new RelativeLayout(HomeActivity.this);
            RelativeLayout.LayoutParams rootParams = new RelativeLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
            rlCardRoot.setLayoutParams(rootParams);

            ImageView ivPoster = new ImageView(HomeActivity.this);
            ivPoster.setScaleType(ImageView.ScaleType.CENTER_CROP);
            ivPoster.setLayoutParams(rootParams);
            rlCardRoot.addView(ivPoster);

            FrameLayout footerContainer = new FrameLayout(HomeActivity.this);
            RelativeLayout.LayoutParams footerParams = new RelativeLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            footerParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
            footerContainer.setLayoutParams(footerParams);
            GradientDrawable fadeBg = new GradientDrawable(
                    GradientDrawable.Orientation.BOTTOM_TOP,
                    new int[]{Color.parseColor("#CC000000"), Color.TRANSPARENT});
            footerContainer.setBackground(fadeBg);
            footerContainer.setPadding(dpToPx(8), dpToPx(24), dpToPx(8), dpToPx(8));

            TextView tvTitle = new TextView(HomeActivity.this);
            tvTitle.setTextColor(Color.WHITE);
            tvTitle.setTextSize(10);
            tvTitle.setTypeface(null, Typeface.BOLD);
            tvTitle.setMaxLines(1);
            tvTitle.setEllipsize(TextUtils.TruncateAt.END);
            footerContainer.addView(tvTitle);

            rlCardRoot.addView(footerContainer);
            card.addView(rlCardRoot);

            return new RailViewHolder(card, ivPoster, tvTitle);
        }

        @Override
        public void onBindViewHolder(@NonNull RailViewHolder holder, int position) {
            Map<String, Object> item = dataset.get(position);
            holder.tvTitle.setText(extractSafeString(item, "title"));
            holder.ivPoster.setBackgroundColor(Color.parseColor("#334155"));
            
            holder.itemView.setOnClickListener(v -> navigateToStream(item));
        }

        @Override public int getItemCount() { return dataset.size(); }

        class RailViewHolder extends RecyclerView.ViewHolder {
            ImageView ivPoster; TextView tvTitle;
            public RailViewHolder(@NonNull View itemView, ImageView iv, TextView tv) {
                super(itemView);
                this.ivPoster = iv; this.tvTitle = tv;
            }
        }
    }

    // Identical structural UI as Discover Grid for active filters
    private class FilteredGridAdapter extends RecyclerView.Adapter<FilteredGridAdapter.GridViewHolder> {
        @NonNull
        @Override
        public GridViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            CardView card = new CardView(HomeActivity.this);
            card.setCardBackgroundColor(Color.parseColor("#1E293B"));
            card.setRadius(dpToPx(12));
            
            GridLayoutManager.LayoutParams cardParams = new GridLayoutManager.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(160));
            cardParams.setMargins(dpToPx(4), dpToPx(4), dpToPx(4), dpToPx(12));
            card.setLayoutParams(cardParams);

            RelativeLayout rlCardRoot = new RelativeLayout(HomeActivity.this);
            rlCardRoot.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

            ImageView ivPoster = new ImageView(HomeActivity.this);
            ivPoster.setScaleType(ImageView.ScaleType.CENTER_CROP);
            ivPoster.setLayoutParams(new RelativeLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
            rlCardRoot.addView(ivPoster);

            FrameLayout footerContainer = new FrameLayout(HomeActivity.this);
            RelativeLayout.LayoutParams footerParams = new RelativeLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            footerParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
            footerContainer.setLayoutParams(footerParams);
            GradientDrawable fadeBg = new GradientDrawable(
                    GradientDrawable.Orientation.BOTTOM_TOP,
                    new int[]{Color.parseColor("#E6000000"), Color.TRANSPARENT});
            footerContainer.setBackground(fadeBg);
            footerContainer.setPadding(dpToPx(8), dpToPx(16), dpToPx(8), dpToPx(8));

            TextView tvTitle = new TextView(HomeActivity.this);
            tvTitle.setTextColor(Color.WHITE);
            tvTitle.setTextSize(10);
            tvTitle.setTypeface(null, Typeface.BOLD);
            tvTitle.setMaxLines(1);
            tvTitle.setEllipsize(TextUtils.TruncateAt.END);
            footerContainer.addView(tvTitle);

            rlCardRoot.addView(footerContainer);
            card.addView(rlCardRoot);

            return new GridViewHolder(card, ivPoster, tvTitle);
        }

        @Override
        public void onBindViewHolder(@NonNull GridViewHolder holder, int position) {
            Map<String, Object> item = filteredDataset.get(position);
            holder.tvTitle.setText(extractSafeString(item, "title"));
            holder.ivPoster.setBackgroundColor(Color.parseColor("#334155"));
            holder.itemView.setOnClickListener(v -> navigateToStream(item));
        }

        @Override public int getItemCount() { return filteredDataset.size(); }

        class GridViewHolder extends RecyclerView.ViewHolder {
            ImageView ivPoster; TextView tvTitle;
            public GridViewHolder(@NonNull View itemView, ImageView iv, TextView tv) {
                super(itemView);
                this.ivPoster = iv; this.tvTitle = tv;
            }
        }
    }

    private class NetworkRailAdapter extends RecyclerView.Adapter<NetworkRailAdapter.NetworkViewHolder> {
        private String[] networks = {"Netflix", "Prime Video", "AltBalaji", "Disney+", "Hulu"};
        
        @NonNull
        @Override
        public NetworkViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            CardView card = new CardView(HomeActivity.this);
            card.setCardBackgroundColor(Color.parseColor("#18181B"));
            card.setRadius(dpToPx(8));
            RecyclerView.LayoutParams params = new RecyclerView.LayoutParams(
                    dpToPx(130), dpToPx(70));
            params.setMargins(dpToPx(4), dpToPx(4), dpToPx(4), dpToPx(4));
            card.setLayoutParams(params);

            TextView tv = new TextView(HomeActivity.this);
            tv.setTextColor(Color.WHITE);
            tv.setTextSize(14);
            tv.setTypeface(null, Typeface.BOLD);
            tv.setGravity(Gravity.CENTER);
            card.addView(tv);

            return new NetworkViewHolder(card, tv);
        }

        @Override
        public void onBindViewHolder(@NonNull NetworkViewHolder holder, int position) {
            holder.tvName.setText(networks[position]);
            holder.itemView.setOnClickListener(v -> {
                activeGlobalFilter = networks[position];
                setupGlobalChips();
                handleGlobalFilterChange();
            });
        }
        @Override public int getItemCount() { return networks.length; }

        class NetworkViewHolder extends RecyclerView.ViewHolder {
            TextView tvName;
            public NetworkViewHolder(@NonNull View itemView, TextView tv) {
                super(itemView); this.tvName = tv;
            }
        }
    }

    // --- Helpers ---
    private String extractSafeString(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? String.valueOf(v) : "";
    }

    private int dpToPx(int dp) {
        return Math.round(dp * getResources().getDisplayMetrics().density);
    }
}
