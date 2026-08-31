package com.chanelentertainment.sanflixpro;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;
import android.widget.ArrayAdapter;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SwitchCompat;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import java.util.HashMap;
import java.util.Map;

public class AdminActivity extends AppCompatActivity {

    private EditText etTmdbId, etTitle, etSynopsis, etCastCrew, etPosterUrl, etBackdropUrl, etRating;
    private EditText etReleaseDate, etSeasonCount, etEpsCount, etStreaming1, etStreaming2, etStreaming3, etTrailerId;
    private Spinner spinnerLayout, spinnerCategory;
    private SwitchCompat switchAdGate, switchHighlighted;
    private Button btnScourTMDb, btnInjectPackage;

    private DatabaseReference contentRef;

    private final String[] standardCategories = {"Bollywood", "Hollywood", "South Indian", "Tollywood", "Global Movies"};
    private final String[] adultCategories = {"ULLU", "KOOKU", "PRIMESHOTS", "CHULLTV", "HOTX VIP", "DESIFLIX", "Hot web series", "Mms viral video", "Short Films"};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin); // Placeholder for local XML layout

        contentRef = FirebaseDatabase.getInstance().getReference("SanFlix_Content");

        initViews();
        setupListeners();
        updateCategorySpinner(false);
    }

    private void initViews() {
        etTmdbId = findViewById(R.id.et_tmdb_id);
        etTitle = findViewById(R.id.et_title);
        etSynopsis = findViewById(R.id.et_synopsis);
        etCastCrew = findViewById(R.id.et_cast_crew);
        etPosterUrl = findViewById(R.id.et_poster_url);
        etBackdropUrl = findViewById(R.id.et_backdrop_url);
        etRating = findViewById(R.id.et_rating);
        etReleaseDate = findViewById(R.id.et_release_date);
        etSeasonCount = findViewById(R.id.et_season_count);
        etEpsCount = findViewById(R.id.et_eps_count);
        etStreaming1 = findViewById(R.id.et_streaming_link_1);
        etStreaming2 = findViewById(R.id.et_streaming_link_2);
        etStreaming3 = findViewById(R.id.et_streaming_link_3);
        etTrailerId = findViewById(R.id.et_trailer_id);
        
        spinnerLayout = findViewById(R.id.spinner_layout_format);
        spinnerCategory = findViewById(R.id.spinner_category_rail);
        
        switchAdGate = findViewById(R.id.switch_ad_gate);
        switchHighlighted = findViewById(R.id.switch_highlighted);
        
        btnScourTMDb = findViewById(R.id.btn_scour_tmdb);
        btnInjectPackage = findViewById(R.id.btn_inject_package);
    }

    private void setupListeners() {
        switchAdGate.setOnCheckedChangeListener((buttonView, isChecked) -> {
            updateCategorySpinner(isChecked);
        });

        btnScourTMDb.setOnClickListener(v -> {
            String tmdbId = etTmdbId.getText().toString().trim();
            if (!TextUtils.isEmpty(tmdbId)) {
                scourCatalogTMDbApi(tmdbId);
            } else {
                Toast.makeText(this, "TMDb ID is empty. Manual mode active.", Toast.LENGTH_SHORT).show();
            }
        });

        btnInjectPackage.setOnClickListener(v -> submitContent());
    }

    private void updateCategorySpinner(boolean isAdult) {
        String[] categories = isAdult ? adultCategories : standardCategories;
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, categories);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerCategory.setAdapter(adapter);
    }

    private void scourCatalogTMDbApi(String id) {
        // Mock API Simulation Function
        // In reality, use Retrofit or HttpURLConnection to fetch from TMDb
        Toast.makeText(this, "Simulating TMDb fetch for ID: " + id, Toast.LENGTH_SHORT).show();
        etTitle.setText("Simulated Title from TMDb");
        etSynopsis.setText("Simulated Synopsis");
        etCastCrew.setText("Actor A, Actor B");
        etPosterUrl.setText("https://image.tmdb.org/.../poster.jpg");
        etBackdropUrl.setText("https://image.tmdb.org/.../backdrop.jpg");
        etRating.setText("8.5");
        etTrailerId.setText("d9MyW72ELq0");
    }

    private void submitContent() {
        String title = etTitle.getText().toString().trim();
        String streaming1 = etStreaming1.getText().toString().trim();

        if (TextUtils.isEmpty(title) || TextUtils.isEmpty(streaming1)) {
            Toast.makeText(this, "Title and Primary Streaming Link (1) are mandatory!", Toast.LENGTH_SHORT).show();
            return;
        }

        String key = contentRef.push().getKey();
        if (key == null) return;

        Map<String, Object> data = new HashMap<>();
        data.put("id", key);
        data.put("tmdb_id", etTmdbId.getText().toString());
        data.put("title", title);
        data.put("synopsis", etSynopsis.getText().toString());
        data.put("cast_crew", etCastCrew.getText().toString());
        data.put("poster_url", etPosterUrl.getText().toString());
        data.put("backdrop_url", etBackdropUrl.getText().toString());
        data.put("rating", etRating.getText().toString());
        
        data.put("media_layout_format", spinnerLayout.getSelectedItem().toString());
        data.put("mapped_category_rail", spinnerCategory.getSelectedItem().toString());
        
        data.put("release_date", etReleaseDate.getText().toString());
        
        int seasonCount = 0;
        try { seasonCount = Integer.parseInt(etSeasonCount.getText().toString()); } catch (Exception ignored) {}
        int epsCount = 0;
        try { epsCount = Integer.parseInt(etEpsCount.getText().toString()); } catch (Exception ignored) {}
        
        data.put("season_count", seasonCount);
        data.put("eps_count", epsCount);
        
        data.put("streaming_link_1", streaming1);
        data.put("streaming_link_2", etStreaming2.getText().toString());
        data.put("streaming_link_3", etStreaming3.getText().toString());
        data.put("trailer_id", etTrailerId.getText().toString());
        
        data.put("is_highlighted", switchHighlighted.isChecked());
        data.put("ad_gate", switchAdGate.isChecked());

        contentRef.child(key).setValue(data).addOnCompleteListener(task -> {
            if (task.isSuccessful()) {
                Toast.makeText(AdminActivity.this, "Package Injected Successfully", Toast.LENGTH_SHORT).show();
                finish(); // Assuming returning to previous screen
            } else {
                Toast.makeText(AdminActivity.this, "Failed to upload package", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
