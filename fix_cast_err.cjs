const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

const targetStr = `      } catch (err: any) {
        if (err !== 'cancel' && err !== 'session_error') {
           console.error("Cast error:", err);
        }`;

const newStr = `      } catch (err: any) {
        if (err !== 'cancel' && err !== 'session_error' && err?.code !== 'cancel') {
           console.error("Cast error:", err?.description || err?.message || err);
        }`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
