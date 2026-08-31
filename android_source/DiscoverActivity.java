package com.chanelentertainment.sanflixpro;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DiscoverActivity extends AppCompatActivity {

    // UI Components
    private LinearLayout rootLayout;
    private EditText etSearch;
    private LinearLayout chipsContainer;
    private LinearLayout historyContainer;
    private RecyclerView resultsRecyclerView;

    // Data handling
    private DatabaseReference contentRef;
    private List<Map<String, Object>> masterDataset = new ArrayList<>();
    private List<Map<String, Object>> filteredDataset = new ArrayList<>();
    private ResultsAdapter adapter;
    private SharedPreferences sharedPrefs;
    
    // State
    private String activeChipTag = "";
    private boolean isAdultMode = false; // Toggled internally based on user's access mode
    private final String[] normalTags = {"#Trending", "#Hollywood", "#Bollywood", "#SouthIndian", "#Action", "#WebSeries"};
    private final String[] adultTags = {"#ULLU", "#KOOKU", "#PRIMESHOTS", "#CHULLTV", "#DESIFLIX", "#HotWebSeries", "#MmsViral"};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Initialize State & Firebase
        sharedPrefs = getSharedPreferences("SanFlix_DiscoverPrefs", Context.MODE_PRIVATE);
        contentRef = FirebaseDatabase.getInstance().getReference("SanFlix_Content");
        isAdultMode = getIntent().getBooleanExtra("adult_mode", false);

        // Build UI Programmatically
        buildUI();
        setContentView(rootLayout);

        // Setup Events and Data
        setupSearchEngine();
        renderChips();
        loadHistoryEngine();
        fetchFirebaseDataset();
    }

    private void buildUI() {
        // Root Canvas
        rootLayout = new LinearLayout(this);
        rootLayout.setOrientation(LinearLayout.VERTICAL);
        rootLayout.setBackgroundColor(Color.parseColor("#0F141F")); // Ultra-premium deep cinematic dark space
        rootLayout.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        rootLayout.setPadding(dpToPx(16), dpToPx(32), dpToPx(16), dpToPx(16));

        // Header Title
        TextView tvHeader = new TextView(this);
        tvHeader.setText("Discover");
        tvHeader.setTextColor(Color.WHITE);
        tvHeader.setTextSize(TypedValue.COMPLEX_UNIT_SP, 24);
        tvHeader.setTypeface(null, Typeface.BOLD);
        tvHeader.setPadding(0, 0, 0, dpToPx(16));
        rootLayout.addView(tvHeader);

        // Search Bar Frame
        LinearLayout searchFrame = new LinearLayout(this);
        searchFrame.setOrientation(LinearLayout.HORIZONTAL);
        searchFrame.setLayoutParams(new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        
        GradientDrawable searchBg = new GradientDrawable();
        searchBg.setColor(Color.parseColor("#1E293B"));
        searchBg.setCornerRadius(dpToPx(12));
        searchBg.setStroke(1, Color.parseColor("#334155"));

        LinearLayout innerSearch = new LinearLayout(this);
        innerSearch.setOrientation(LinearLayout.HORIZONTAL);
        innerSearch.setBackground(searchBg);
        innerSearch.setGravity(Gravity.CENTER_VERTICAL);
        innerSearch.setPadding(dpToPx(12), dpToPx(8), dpToPx(12), dpToPx(8));
        LinearLayout.LayoutParams innerParams = new LinearLayout.LayoutParams(
                0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
        innerSearch.setLayoutParams(innerParams);

        // Optional: Search Icon placeholder (using pure text emoji for zero dependency rendering)
        TextView tvSearchIcon = new TextView(this);
        tvSearchIcon.setText("🔍");
        tvSearchIcon.setTextSize(16);
        innerSearch.addView(tvSearchIcon);

        etSearch = new EditText(this);
        etSearch.setHint("Search our vast library...");
        etSearch.setHintTextColor(Color.parseColor("#64748B"));
        etSearch.setTextColor(Color.WHITE);
        etSearch.setBackgroundColor(Color.TRANSPARENT);
        etSearch.setSingleLine(true);
        etSearch.setPadding(dpToPx(8), 0, 0, 0);
        etSearch.setLayoutParams(new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        innerSearch.addView(etSearch);

        searchFrame.addView(innerSearch);

        // Filter Button
        TextView btnFilter = new TextView(this);
        btnFilter.setText("⚙");
        btnFilter.setTextSize(20);
        btnFilter.setTextColor(Color.WHITE);
        btnFilter.setGravity(Gravity.CENTER);
        GradientDrawable filterBg = new GradientDrawable();
        filterBg.setColor(Color.parseColor("#1E293B"));
        filterBg.setCornerRadius(dpToPx(12));
        btnFilter.setBackground(filterBg);
        LinearLayout.LayoutParams filterParams = new LinearLayout.LayoutParams(
                dpToPx(48), dpToPx(48));
        filterParams.setMargins(dpToPx(8), 0, 0, 0);
        btnFilter.setLayoutParams(filterParams);
        searchFrame.addView(btnFilter);

        rootLayout.addView(searchFrame);

        // Horizontal Chips Scroll
        HorizontalScrollView hScroll = new HorizontalScrollView(this);
        hScroll.setHorizontalScrollBarEnabled(false);
        LinearLayout.LayoutParams scrollParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        scrollParams.setMargins(0, dpToPx(16), 0, dpToPx(16));
        hScroll.setLayoutParams(scrollParams);
        
        chipsContainer = new LinearLayout(this);
        chipsContainer.setOrientation(LinearLayout.HORIZONTAL);
        hScroll.addView(chipsContainer);
        rootLayout.addView(hScroll);

        // History Container
        historyContainer = new LinearLayout(this);
        historyContainer.setOrientation(LinearLayout.VERTICAL);
        historyContainer.setLayoutParams(new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        rootLayout.addView(historyContainer);

        // Results Grid
        resultsRecyclerView = new RecyclerView(this);
        resultsRecyclerView.setLayoutParams(new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        resultsRecyclerView.setLayoutManager(new GridLayoutManager(this, 3));
        adapter = new ResultsAdapter();
        resultsRecyclerView.setAdapter(adapter);
        resultsRecyclerView.setVisibility(View.GONE);
        rootLayout.addView(resultsRecyclerView);
    }

    private void setupSearchEngine() {
        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                applyFilters();
            }

            @Override
            public void afterTextChanged(Editable s) {
                // Save to history automatically on certain thresholds or explicit actions if preferred.
                // For this programmatic approach, we will save when the query is longer than 3 chars and user pauses.
                // Normally handled in a submit listener, but we will attach an Enter key listener for commit.
            }
        });

        etSearch.setOnEditorActionListener((v, actionId, event) -> {
            String query = etSearch.getText().toString().trim();
            if (!query.isEmpty()) {
                saveToHistory(query);
            }
            return false;
        });
    }

    private void renderChips() {
        chipsContainer.removeAllViews();
        String[] tags = isAdultMode ? adultTags : normalTags;

        for (final String tag : tags) {
            final TextView chip = new TextView(this);
            chip.setText(tag);
            chip.setTypeface(null, Typeface.BOLD);
            chip.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
            chip.setPadding(dpToPx(16), dpToPx(8), dpToPx(16), dpToPx(8));
            
            LinearLayout.LayoutParams chipParams = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            chipParams.setMargins(0, 0, dpToPx(8), 0);
            chip.setLayoutParams(chipParams);

            boolean isActive = tag.equalsIgnoreCase(activeChipTag);
            
            GradientDrawable chipBg = new GradientDrawable();
            chipBg.setCornerRadius(dpToPx(20));
            chipBg.setColor(isActive ? Color.parseColor("#E50914") : Color.parseColor("#1E293B"));
            chip.setBackground(chipBg);
            chip.setTextColor(isActive ? Color.WHITE : Color.parseColor("#94A3B8"));

            chip.setOnClickListener(v -> {
                if (isActive) {
                    activeChipTag = ""; // Toggle off
                } else {
                    activeChipTag = tag;
                }
                renderChips(); // Re-render for color update
                applyFilters(); // Trigger layout dataset update
            });

            chipsContainer.addView(chip);
        }
    }

    private void fetchFirebaseDataset() {
        contentRef.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                masterDataset.clear();
                for (DataSnapshot ds : snapshot.getChildren()) {
                    Object val = ds.getValue();
                    if (val instanceof Map) {
                        try {
                            Map<String, Object> map = (Map<String, Object>) val;
                            // Ensure the map structure is ready for consumption
                            masterDataset.add(map);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
                applyFilters();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Toast.makeText(DiscoverActivity.this, "Dataset query failed", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void applyFilters() {
        String query = etSearch.getText().toString().toLowerCase().trim();
        filteredDataset.clear();

        if (query.isEmpty() && activeChipTag.isEmpty()) {
            // Show history, hide grid
            historyContainer.setVisibility(View.VISIBLE);
            resultsRecyclerView.setVisibility(View.GONE);
            loadHistoryEngine(); // Refresh history
            return;
        }

        // Show grid, hide history
        historyContainer.setVisibility(View.GONE);
        resultsRecyclerView.setVisibility(View.VISIBLE);

        String cleanTag = activeChipTag.replace("#", "").toLowerCase();

        for (Map<String, Object> item : masterDataset) {
            String title = extractStringSafely(item, "title").toLowerCase();
            String catRail = extractStringSafely(item, "mapped_category_rail").toLowerCase();
            String adGateRaw = String.valueOf(item.get("ad_gate"));
            boolean isContentAdGated = adGateRaw.equals("true");

            // Filter out 18+ content if the user isn't in adult mode
            if (isContentAdGated && !isAdultMode) {
                continue;
            }

            boolean matchesQuery = title.contains(query) || catRail.contains(query);
            boolean matchesTag = activeChipTag.isEmpty() || catRail.contains(cleanTag) || title.contains(cleanTag);

            if (matchesQuery && matchesTag) {
                filteredDataset.add(item);
            }
        }
        
        adapter.notifyDataSetChanged();
    }

    // --- History Caching Logic ---
    private void saveToHistory(String query) {
        String historyRaw = sharedPrefs.getString("search_history", "");
        List<String> historyList = new ArrayList<>(Arrays.asList(historyRaw.split(",")));
        
        // Remove empty artifacts and prevent duplicates
        historyList.remove("");
        if (historyList.contains(query)) {
            historyList.remove(query);
        }
        historyList.add(0, query); // Add exactly to the top
        
        // Limit to 10 latest
        if (historyList.size() > 10) {
            historyList = historyList.subList(0, 10);
        }

        sharedPrefs.edit().putString("search_history", TextUtils.join(",", historyList)).apply();
        loadHistoryEngine();
    }

    private void deleteHistoryItem(String query) {
        String historyRaw = sharedPrefs.getString("search_history", "");
        List<String> historyList = new ArrayList<>(Arrays.asList(historyRaw.split(",")));
        historyList.remove(query);
        sharedPrefs.edit().putString("search_history", TextUtils.join(",", historyList)).apply();
        loadHistoryEngine();
    }

    private void loadHistoryEngine() {
        historyContainer.removeAllViews();
        
        // Header
        TextView historyHeader = new TextView(this);
        historyHeader.setText("Search History");
        historyHeader.setTextColor(Color.WHITE);
        historyHeader.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        historyHeader.setTypeface(null, Typeface.BOLD);
        historyHeader.setPadding(0, 0, 0, dpToPx(16));
        historyContainer.addView(historyHeader);

        String historyRaw = sharedPrefs.getString("search_history", "");
        if (historyRaw.trim().isEmpty()) {
            TextView emptyView = new TextView(this);
            emptyView.setText("No recent searches");
            emptyView.setTextColor(Color.parseColor("#64748B"));
            emptyView.setTextSize(14);
            historyContainer.addView(emptyView);
            return;
        }

        String[] historyItems = historyRaw.split(",");
        for (final String item : historyItems) {
            if (item.trim().isEmpty()) continue;

            LinearLayout row = new LinearLayout(this);
            row.setOrientation(LinearLayout.HORIZONTAL);
            row.setGravity(Gravity.CENTER_VERTICAL);
            row.setPadding(0, dpToPx(12), 0, dpToPx(12));
            row.setClickable(true);
            
            TextView icClock = new TextView(this);
            icClock.setText("🕒"); // Simple native representation
            icClock.setTextSize(14);
            icClock.setPadding(0,0, dpToPx(12), 0);
            row.addView(icClock);

            TextView tvItem = new TextView(this);
            tvItem.setText(item);
            tvItem.setTextColor(Color.parseColor("#CBD5E1")); // Zinc-300 equivalent
            tvItem.setTextSize(14);
            LinearLayout.LayoutParams itemParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
            tvItem.setLayoutParams(itemParams);
            row.addView(tvItem);

            TextView btnDelete = new TextView(this);
            btnDelete.setText("🗑"); // Simple native trash representation
            btnDelete.setTextSize(16);
            btnDelete.setPadding(dpToPx(16), 0, 0, 0);
            
            btnDelete.setOnClickListener(v -> deleteHistoryItem(item));
            row.setOnClickListener(v -> {
                etSearch.setText(item);
                etSearch.setSelection(item.length());
            });

            row.addView(btnDelete);
            historyContainer.addView(row);
        }
    }

    // --- High-Fidelity Interactive Results Grid Adapter ---
    private class ResultsAdapter extends RecyclerView.Adapter<ResultsAdapter.ViewHolder> {

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            // Programmatic CardView construction
            CardView card = new CardView(DiscoverActivity.this);
            card.setCardBackgroundColor(Color.parseColor("#1E293B"));
            card.setRadius(dpToPx(12));
            card.setCardElevation(dpToPx(4));
            
            // Layout params with margins
            GridLayoutManager.LayoutParams cardParams = new GridLayoutManager.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(160));
            cardParams.setMargins(dpToPx(4), dpToPx(4), dpToPx(4), dpToPx(12));
            card.setLayoutParams(cardParams);

            RelativeLayout rlCardRoot = new RelativeLayout(DiscoverActivity.this);
            rlCardRoot.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

            // Image Layer
            ImageView ivPoster = new ImageView(DiscoverActivity.this);
            ivPoster.setId(View.generateViewId());
            ivPoster.setScaleType(ImageView.ScaleType.CENTER_CROP);
            ivPoster.setLayoutParams(new RelativeLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
            rlCardRoot.addView(ivPoster);

            // Floating Badge UI Layer (Top Right Overlay)
            TextView tvBadge = new TextView(DiscoverActivity.this);
            tvBadge.setId(View.generateViewId());
            RelativeLayout.LayoutParams badgeParams = new RelativeLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            badgeParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
            badgeParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
            badgeParams.setMargins(dpToPx(4), dpToPx(4), dpToPx(4), 0);
            tvBadge.setLayoutParams(badgeParams);
            tvBadge.setPadding(dpToPx(6), dpToPx(2), dpToPx(6), dpToPx(2));
            tvBadge.setTextSize(TypedValue.COMPLEX_UNIT_SP, 9);
            tvBadge.setTypeface(null, Typeface.BOLD);
            rlCardRoot.addView(tvBadge);

            // Metadata Footer Layer (Gradient Mask Fade)
            FrameLayout footerContainer = new FrameLayout(DiscoverActivity.this);
            RelativeLayout.LayoutParams footerParams = new RelativeLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            footerParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
            footerContainer.setLayoutParams(footerParams);
            
            GradientDrawable fadeBg = new GradientDrawable(
                    GradientDrawable.Orientation.BOTTOM_TOP,
                    new int[]{Color.parseColor("#E6000000"), Color.TRANSPARENT});
            footerContainer.setBackground(fadeBg);
            footerContainer.setPadding(dpToPx(8), dpToPx(16), dpToPx(8), dpToPx(8));

            LinearLayout footerColumn = new LinearLayout(DiscoverActivity.this);
            footerColumn.setOrientation(LinearLayout.VERTICAL);
            
            TextView tvTitleRaw = new TextView(DiscoverActivity.this);
            tvTitleRaw.setId(View.generateViewId());
            tvTitleRaw.setTextColor(Color.WHITE);
            tvTitleRaw.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
            tvTitleRaw.setTypeface(null, Typeface.BOLD);
            tvTitleRaw.setMaxLines(1);
            tvTitleRaw.setEllipsize(TextUtils.TruncateAt.END);
            
            TextView tvRatingRaw = new TextView(DiscoverActivity.this);
            tvRatingRaw.setId(View.generateViewId());
            tvRatingRaw.setTextColor(Color.parseColor("#FBBF24")); // Neon Yellow
            tvRatingRaw.setTextSize(TypedValue.COMPLEX_UNIT_SP, 10);
            tvRatingRaw.setTypeface(null, Typeface.BOLD);

            footerColumn.addView(tvTitleRaw);
            footerColumn.addView(tvRatingRaw);
            footerContainer.addView(footerColumn);

            rlCardRoot.addView(footerContainer);
            card.addView(rlCardRoot);

            return new ViewHolder(card, ivPoster, tvBadge, tvTitleRaw, tvRatingRaw);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            Map<String, Object> item = filteredDataset.get(position);
            
            String titleStr = extractStringSafely(item, "title");
            String ratingStr = extractStringSafely(item, "rating");
            String posterStr = extractStringSafely(item, "poster_url");
            String adGateRaw = String.valueOf(item.get("ad_gate"));
            boolean isAdGated = adGateRaw.equals("true");

            holder.tvTitle.setText(titleStr);
            holder.tvRating.setText(ratingStr.isEmpty() ? "⭐ N/A" : "⭐ " + ratingStr);

            // Badge styling
            GradientDrawable badgeBg = new GradientDrawable();
            badgeBg.setCornerRadius(dpToPx(4));
            if (isAdGated) {
                holder.tvBadge.setText("🔒 VIP");
                holder.tvBadge.setTextColor(Color.WHITE);
                badgeBg.setColor(Color.parseColor("#B3E50914")); // Alpha Red
            } else {
                holder.tvBadge.setText("⚡ HD");
                holder.tvBadge.setTextColor(Color.parseColor("#1E293B"));
                badgeBg.setColor(Color.parseColor("#B3FBBF24")); // Alpha Yellow
            }
            holder.tvBadge.setBackground(badgeBg);

            // Mock Image Loading Execution (Compatible seamlessly with Sketchware/Glide)
            // In raw Java without build.gradle Glide dependency, we set a temporary layout color.
            // Glide.with(holder.itemView.getContext()).load(posterStr).into(holder.ivPoster);
            holder.ivPoster.setBackgroundColor(Color.parseColor("#334155"));

            // Binding Action Redirection
            holder.itemView.setOnClickListener(v -> {
                saveToHistory(etSearch.getText().toString().trim());

                Intent intent = new Intent(DiscoverActivity.this, StreamActivity.class);
                intent.putExtra("id", extractStringSafely(item, "id"));
                intent.putExtra("title", titleStr);
                intent.putExtra("mapped_category_rail", extractStringSafely(item, "mapped_category_rail"));
                intent.putExtra("trailer_id", extractStringSafely(item, "trailer_id"));
                intent.putExtra("streaming_link_1", extractStringSafely(item, "streaming_link_1"));
                intent.putExtra("streaming_link_2", extractStringSafely(item, "streaming_link_2"));
                intent.putExtra("streaming_link_3", extractStringSafely(item, "streaming_link_3"));
                intent.putExtra("ad_gate", isAdGated);
                startActivity(intent);
            });
        }

        @Override
        public int getItemCount() {
            return filteredDataset.size();
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            ImageView ivPoster;
            TextView tvBadge;
            TextView tvTitle;
            TextView tvRating;

            public ViewHolder(@NonNull View itemView, ImageView poster, TextView badge, TextView title, TextView rating) {
                super(itemView);
                ivPoster = poster;
                tvBadge = badge;
                tvTitle = title;
                tvRating = rating;
            }
        }
    }

    // --- Helpers ---
    private int dpToPx(int dp) {
        return Math.round(dp * getResources().getDisplayMetrics().density);
    }
    
    private String extractStringSafely(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return val != null ? val.toString() : "";
    }
}
