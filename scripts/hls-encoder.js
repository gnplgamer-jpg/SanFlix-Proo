const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const execPromise = util.promisify(exec);

const INPUT_DIR = path.join(__dirname, '../uploads/raw');
const OUTPUT_DIR = path.join(__dirname, '../uploads/hls');

// Ensure directories exist
if (!fs.existsSync(INPUT_DIR)) fs.mkdirSync(INPUT_DIR, { recursive: true });
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

console.log(`Starting HLS Encoder Watcher...`);
console.log(`Watching directory: ${INPUT_DIR}`);

// Target Bitrates & Resolutions for ABR
const PROFILES = [
  { resolution: '854x480', bitrate: '800k', maxrate: '856k', bufsize: '1200k', name: '480p' },
  { resolution: '1280x720', bitrate: '1500k', maxrate: '1605k', bufsize: '2250k', name: '720p' },
  { resolution: '1920x1080', bitrate: '3500k', maxrate: '3745k', bufsize: '5250k', name: '1080p' },
  // Ultra HDR / 4K fallback for web - keeping it H.264/HEVC compatible
  { resolution: '3840x2160', bitrate: '12000k', maxrate: '12840k', bufsize: '18000k', name: '2160p' }
];

async function processVideo(inputPath, filename) {
  const fileId = path.parse(filename).name;
  const outputDir = path.join(OUTPUT_DIR, fileId);
  
  if (fs.existsSync(outputDir)) {
    console.log(`[Skip] Already processed: ${fileId}`);
    return;
  }
  
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`[Processing] Started encoding for: ${filename}`);

  try {
    let ffmpegCmd = `ffmpeg -i "${inputPath}" -y -hide_banner `;

    // Map video and audio for each profile
    PROFILES.forEach((profile, index) => {
      ffmpegCmd += `-map 0:v:0 -map 0:a:0 `;
    });

    // Codec and settings
    // -c:v libx264 for universal compatibility, -c:a aac for audio
    // -g 48 -keyint_min 48 for 2-second keyframes (assuming 24fps)
    // -hls_time 4 sets 4-second segments
    ffmpegCmd += `-c:v libx264 -c:a aac -ar 48000 -g 48 -keyint_min 48 -sc_threshold 0 `;

    // Config for each profile
    PROFILES.forEach((profile, index) => {
      ffmpegCmd += `-b:v:${index} ${profile.bitrate} -maxrate:v:${index} ${profile.maxrate} -bufsize:v:${index} ${profile.bufsize} -s:v:${index} ${profile.resolution} -b:a:${index} 128k `;
    });

    // HLS segment options
    ffmpegCmd += `-f hls -hls_time 4 -hls_playlist_type vod -hls_flags independent_segments `;
    ffmpegCmd += `-hls_segment_type mpegts -hls_segment_filename "${outputDir}/stream_%v_data%03d.ts" `;
    ffmpegCmd += `-master_pl_name master.m3u8 `;

    // Output per stream
    const varStreamMap = PROFILES.map((p, i) => `v:${i},a:${i}`).join(' ');
    ffmpegCmd += `-var_stream_map "${varStreamMap}" `;
    ffmpegCmd += `"${outputDir}/stream_%v.m3u8"`;

    console.log(`Executing FFmpeg command... This may take a while depending on the video length and hardware.`);
    
    await execPromise(ffmpegCmd);
    
    console.log(`[Success] Finished encoding: ${filename}`);
    console.log(`Master Playlist available at: ${outputDir}/master.m3u8`);
    
    // Optional: Delete raw file after successful processing
    // fs.unlinkSync(inputPath);
    
  } catch (error) {
    console.error(`[Error] Failed to process ${filename}:`, error.message);
    // Cleanup partial output
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
}

// Watch directory for new files
fs.watch(INPUT_DIR, async (eventType, filename) => {
  if (filename && eventType === 'rename') {
    const inputPath = path.join(INPUT_DIR, filename);
    // Check if it's a file addition (and not a deletion)
    if (fs.existsSync(inputPath)) {
      const ext = path.extname(filename).toLowerCase();
      if (['.mp4', '.mkv', '.avi', '.mov', '.webm'].includes(ext)) {
         // Wait a brief moment to ensure file is completely written before processing
         setTimeout(() => {
            processVideo(inputPath, filename);
         }, 2000);
      }
    }
  }
});
