const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

const targetStr = `          // @ts-ignore
          const mediaInfo = new chrome.cast.media.MediaInfo(url, 'video/mp4');
          // @ts-ignore
          mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
          mediaInfo.metadata.title = title;
          // @ts-ignore
          const request = new chrome.cast.media.LoadRequest(mediaInfo);`;

const newStr = `          // @ts-ignore
          const contentType = url.includes('.m3u8') ? 'application/x-mpegurl' : 'video/mp4';
          // @ts-ignore
          const mediaInfo = new chrome.cast.media.MediaInfo(url, contentType);
          // @ts-ignore
          mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
          mediaInfo.metadata.title = title;
          // @ts-ignore
          const request = new chrome.cast.media.LoadRequest(mediaInfo);`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
