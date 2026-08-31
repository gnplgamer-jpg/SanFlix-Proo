package com.chanelentertainment.sanflixpro;

import android.app.Dialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;

import com.google.android.material.bottomsheet.BottomSheetDialog;

import java.util.Arrays;
import java.util.List;

public class StreamActivity extends AppCompatActivity {

    private String id, title, mappedCategoryRail, trailerId;
    private String streamingLink1, streamingLink2, streamingLink3;
    private boolean adGate;

    private final List<String> adultProviders = Arrays.asList("ULLU", "KOOKU", "PRIMESHOTS", "CHULLTV", "HOTX VIP", "DESIFLIX", "Hot web series", "Mms viral video", "Short Films");

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Normally setContentView would be called here

        extractIntentData();
        showProgrammaticBottomSheet();
    }

    private void extractIntentData() {
        Intent i = getIntent();
        id = i.getStringExtra("id");
        title = i.getStringExtra("title");
        mappedCategoryRail = i.getStringExtra("mapped_category_rail");
        trailerId = i.getStringExtra("trailer_id");
        streamingLink1 = i.getStringExtra("streaming_link_1");
        streamingLink2 = i.getStringExtra("streaming_link_2");
        streamingLink3 = i.getStringExtra("streaming_link_3");
        adGate = i.getBooleanExtra("ad_gate", false);
    }

    private void showProgrammaticBottomSheet() {
        BottomSheetDialog dialog = new BottomSheetDialog(this);
        
        // Creating dynamic layout programmatically
        LinearLayout rootLayout = new LinearLayout(this);
        rootLayout.setOrientation(LinearLayout.VERTICAL);
        rootLayout.setBackgroundColor(Color.parseColor("#0F141F")); // Ultra-premium deep cinematic dark space
        rootLayout.setPadding(48, 48, 48, 48);

        TextView tvTitle = new TextView(this);
        tvTitle.setText(title != null ? title : "Stream Options");
        tvTitle.setTextColor(Color.WHITE);
        tvTitle.setTextSize(20);
        tvTitle.setPadding(0, 0, 0, 32);
        rootLayout.addView(tvTitle);

        String badge = adGate ? " 🔒 " : " ⚡ ";

        Button btn1 = createStyledButton("SERVER 1: Watch Now (Mobile Video Player)" + badge);
        btn1.setOnClickListener(v -> handleActionButton(streamingLink1, dialog));

        Button btn2 = createStyledButton("SERVER 2: Download Offline (High Speed)" + badge);
        btn2.setOnClickListener(v -> handleActionButton(streamingLink2, dialog));

        Button btn3 = createStyledButton("SERVER 3: Alternate Mirror (Web Embed)" + badge);
        btn3.setOnClickListener(v -> handleActionButton(streamingLink3, dialog));

        rootLayout.addView(btn1);
        addMargin(btn1);
        rootLayout.addView(btn2);
        addMargin(btn2);
        rootLayout.addView(btn3);

        dialog.setContentView(rootLayout);
        dialog.show();
    }

    private void handleActionButton(String targetLink, BottomSheetDialog parentDialog) {
        if (targetLink == null || targetLink.isEmpty()) {
            Toast.makeText(this, "Link not available", Toast.LENGTH_SHORT).show();
            return;
        }

        if (adGate) {
            parentDialog.dismiss();
            showVerificationGate(targetLink);
        } else {
            parentDialog.dismiss();
            triggerAdValidationPipeline(targetLink);
        }
    }

    private void showVerificationGate(final String targetUrl) {
        final Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        
        CardView cardView = new CardView(this);
        cardView.setCardBackgroundColor(Color.parseColor("#1E293B")); // Sleek Dark Slate
        cardView.setRadius(dpToPx(16));
        cardView.setUseCompatPadding(true);

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(dpToPx(24), dpToPx(32), dpToPx(24), dpToPx(24));

        TextView txtHeader = new TextView(this);
        txtHeader.setText("Unlock Streaming / Download Link");
        txtHeader.setTextColor(Color.WHITE);
        txtHeader.setTextSize(18);
        txtHeader.setTypeface(null, android.graphics.Typeface.BOLD);
        layout.addView(txtHeader);

        TextView txtBody = new TextView(this);
        txtBody.setText("Click 'Watch Ad' to unlock the direct streaming or high speed download link.");
        txtBody.setTextColor(Color.parseColor("#94A3B8"));
        txtBody.setTextSize(14);
        txtBody.setPadding(0, dpToPx(16), 0, dpToPx(24));
        layout.addView(txtBody);

        Button btnWatchAd = new Button(this);
        btnWatchAd.setText("WATCH AD TO UNLOCK");
        btnWatchAd.setBackgroundColor(Color.parseColor("#E50914"));
        btnWatchAd.setTextColor(Color.WHITE);
        btnWatchAd.setOnClickListener(v -> {
            dialog.dismiss();
            triggerAdValidationPipeline(targetUrl);
        });
        layout.addView(btnWatchAd);

        LinearLayout horizontalBtns = new LinearLayout(this);
        horizontalBtns.setOrientation(LinearLayout.HORIZONTAL);
        horizontalBtns.setPadding(0, dpToPx(16), 0, 0);

        Button btnTrailer = new Button(this);
        btnTrailer.setText("PLAY TRAILER");
        btnTrailer.setBackgroundColor(Color.TRANSPARENT);
        btnTrailer.setTextColor(Color.parseColor("#94A3B8"));
        btnTrailer.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
        btnTrailer.setOnClickListener(v -> {
            if (trailerId != null && !trailerId.isEmpty()) {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.youtube.com/watch?v=" + trailerId));
                startActivity(intent);
            } else {
                Toast.makeText(StreamActivity.this, "No trailer available", Toast.LENGTH_SHORT).show();
            }
        });

        Button btnCancel = new Button(this);
        btnCancel.setText("CANCEL WATCH AD");
        btnCancel.setBackgroundColor(Color.TRANSPARENT);
        btnCancel.setTextColor(Color.parseColor("#94A3B8"));
        btnCancel.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
        btnCancel.setOnClickListener(v -> dialog.dismiss());

        horizontalBtns.addView(btnTrailer);
        horizontalBtns.addView(btnCancel);
        layout.addView(horizontalBtns);

        cardView.addView(layout);
        dialog.setContentView(cardView);
        int width = (int)(getResources().getDisplayMetrics().widthPixels * 0.90);
        dialog.getWindow().setLayout(width, ViewGroup.LayoutParams.WRAP_CONTENT);
        dialog.show();
    }

    private void triggerAdValidationPipeline(final String targetUrl) {
        // PLUG MONETIZATION BLOCKS HERE LATER USING SKETCHWARE PRO
        
        Uri uri = Uri.parse(targetUrl);
        
        if (mappedCategoryRail != null && adultProviders.contains(mappedCategoryRail.trim().toUpperCase())) {
            // Track A (18+ Hub Mode Chrome Redirection Environment)
            try {
                Intent chromeIntent = new Intent(Intent.ACTION_VIEW, uri);
                chromeIntent.setPackage("com.android.chrome");
                startActivity(chromeIntent);
            } catch (ActivityNotFoundException e) {
                // Fallback if Chrome absent
                Intent defaultIntent = new Intent(Intent.ACTION_VIEW, uri);
                startActivity(defaultIntent);
            }
        } else {
            // Track B (Normal Mode Global Media App Chooser Environment)
            Intent chooserIntent = new Intent(Intent.ACTION_VIEW);
            chooserIntent.setDataAndType(uri, "video/*");
            Intent chooser = Intent.createChooser(chooserIntent, "Select Video Player");
            startActivity(chooser);
        }
    }

    private Button createStyledButton(String text) {
        Button btn = new Button(this);
        btn.setText(text);
        btn.setTextColor(Color.WHITE);
        btn.setBackgroundColor(Color.parseColor("#1F2937"));
        btn.setPadding(dpToPx(16), dpToPx(16), dpToPx(16), dpToPx(16));
        btn.setAllCaps(false);
        return btn;
    }

    private void addMargin(View view) {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, 
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.setMargins(0, 0, 0, dpToPx(12));
        view.setLayoutParams(params);
    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round((float) dp * density);
    }
}
