# 🔧 Debugging Guide - Magic Analyzer

## Quick Diagnosis

### Test Camera & Recording

Open the test page to verify basic functionality:
```
http://localhost:5173/test-recording.html
```

This standalone page will help identify if the issue is:
- ❌ Camera permissions
- ❌ Codec support
- ❌ MediaRecorder API issues
- ✅ React component logic

---

## Common Issues & Solutions

### 1. Camera Shows "Unable to access camera"

#### Check Browser Console
Open DevTools (F12) → Console tab and look for:
- "Requesting camera access..."
- "Camera access granted..."
- "Video playing successfully"

#### Solution Steps:
1. **Check HTTPS**: Camera requires HTTPS (localhost is OK)
   ```bash
   # Ensure running on localhost, not 127.0.0.1
   ```

2. **Grant Permissions**: Click the camera icon in address bar
   - Chrome: Click lock icon → Site settings → Camera → Allow
   - Firefox: Click shield icon → Permissions → Camera → Allow
   - Safari: Safari menu → Settings → Websites → Camera → Allow

3. **Reset Stream**: Click "Try Again" button in the error message

4. **Refresh Page**: Hard refresh with `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

5. **Check Other Apps**: Close other apps using the camera (Zoom, Skype, etc.)

#### Still Not Working?
```javascript
// Test in browser console:
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => console.log('✅ Camera works!', stream))
  .catch(err => console.error('❌ Camera error:', err));
```

---

### 2. Recording Doesn't Start After Countdown

#### Console Logs to Check:
```
Starting recording with stream: MediaStream {...}
MediaRecorder created successfully
Using VP9 codec (or VP8/WebM)
Recording started, state: recording
```

#### If Missing Logs:
1. **Stream not ready**: Wait 2-3 seconds after camera loads
2. **Check streamRef**: Should see stream object in logs
3. **Codec issues**: Browser may not support WebM

#### Test Codec Support:
```javascript
// Run in console:
console.log('VP9:', MediaRecorder.isTypeSupported('video/webm;codecs=vp9'));
console.log('VP8:', MediaRecorder.isTypeSupported('video/webm;codecs=vp8'));
console.log('WebM:', MediaRecorder.isTypeSupported('video/webm'));
```

---

### 3. Stop Button Not Clickable

#### Expected Behavior:
- **Idle**: Start = enabled, Stop = disabled
- **Countdown**: Start = disabled, Stop = disabled
- **Recording**: Start = disabled, Stop = enabled
- **Uploading**: Start = disabled, Stop = disabled

#### Debug State:
Open React DevTools → Components → MagicAnalyzer → Look for:
- `appState`: should be "recording"
- `isRecording`: should be `true`
- `countdown`: should be `null`

#### Check Console:
Should see:
```
Recording started, state: recording
```

If you see this but Stop button still disabled, it's a React state sync issue.

#### Quick Fix:
```bash
# Kill dev server and restart
ps aux | grep vite | awk '{print $2}' | xargs kill
npm run dev
```

---

### 4. AI Analysis Not Working

#### Check Supabase Function:
```bash
# Check if function exists
ls supabase/functions/analyze-magic-trick/

# Check environment variable (if using real AI)
# In Supabase Dashboard → Settings → Edge Functions
# Look for: ANTHROPIC_API_KEY
```

#### Test Function Locally:
```bash
# If you have Supabase CLI installed:
supabase functions serve analyze-magic-trick

# Test with curl:
curl -X POST http://localhost:54321/functions/v1/analyze-magic-trick \
  -H "Content-Type: multipart/form-data" \
  -F "video=@test-video.webm"
```

#### Console Logs During Analysis:
```
Upload/Analysis phase started
Analyzing...
Verdict received: caught/fooled
```

#### Common Issues:
- **CORS Error**: Check `corsHeaders` in edge function
- **500 Error**: Function crashed, check Supabase logs
- **Timeout**: Video too large (>10MB), analysis takes >30s

---

### 5. Verdict Not Appearing

#### Check Network Tab:
1. Open DevTools → Network
2. Look for request to `analyze-magic-trick`
3. Check:
   - Status: Should be 200
   - Response: Should contain `{ verdict, confidence, timestamps, analysis }`

#### If Request Fails:
```typescript
// Check browser console for:
"Analysis error: ..."
"Upload/Analysis failed: ..."
```

#### Fallback Analysis:
The app uses fallback random analysis if Supabase fails. You should ALWAYS get a verdict.

---

## Developer Console Commands

### Check Camera Status
```javascript
// In browser console:
const video = document.querySelector('video');
console.log('Video srcObject:', video?.srcObject);
console.log('Video tracks:', video?.srcObject?.getTracks());
```

### Check Recording State
```javascript
// Get React component internals (if React DevTools installed)
$r.state // or check hooks
```

### Force Verdict (Testing)
```javascript
// Manually trigger verdict in console:
// (Not recommended, but useful for UI testing)
```

---

## Performance Debugging

### Video Recording Performance
```javascript
// Check chunk sizes in console:
// Should see: "Data chunk received: XXXX bytes" every 100ms
```

### Analysis Duration
Normal: 8-12 seconds (includes artificial delay for UX)
- 1s: Upload
- 8-12s: AI "thinking" animation
- Instant: Verdict display

If taking >20 seconds:
- Network issue
- Supabase function timeout
- Large video file (>50MB)

---

## Browser Compatibility

### Tested & Working:
- ✅ Chrome 90+ (Desktop & Mobile)
- ✅ Firefox 88+ (Desktop & Mobile)
- ✅ Safari 14+ (Desktop & iOS)
- ✅ Edge 90+

### Known Issues:
- ❌ Safari < 14: getUserMedia issues
- ⚠️ Firefox on Linux: VP9 codec may not be supported (falls back to VP8)
- ⚠️ iOS Safari: Requires user gesture to start recording

---

## Network Debugging

### Check Supabase Connection:
```javascript
// Test in console:
fetch('https://your-project.supabase.co/rest/v1/', {
  headers: { 'apikey': 'your-anon-key' }
})
.then(r => console.log('✅ Supabase connected:', r.status))
.catch(e => console.error('❌ Supabase error:', e));
```

### Check Function Endpoint:
```javascript
// Replace with your actual Supabase URL
const supabaseUrl = 'https://your-project.supabase.co';
fetch(`${supabaseUrl}/functions/v1/analyze-magic-trick`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => console.log('Function status:', r.status))
.catch(e => console.error('Function error:', e));
```

---

## Emergency Fixes

### Nuclear Option (Reset Everything):
```bash
# Stop dev server
ps aux | grep vite | awk '{print $2}' | xargs kill

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear browser cache
# Chrome: Cmd+Shift+Delete → Clear all

# Restart dev server
npm run dev

# Open in incognito/private window
# Grant camera permissions again
```

### Skip Supabase (Local Testing):
Edit `src/components/pages/magic-analyzer.tsx`:
```typescript
// Line ~143: Comment out Supabase call
// const { data, error } = await supabase.functions.invoke(...);

// Replace with:
const data = {
  verdict: Math.random() > 0.5 ? 'caught' : 'fooled',
  confidence: 0.8,
  timestamps: ['0:02.34'],
  analysis: 'Test verdict'
};
const error = null;
```

---

## Getting Help

### Information to Provide:
1. Browser & Version (check in About)
2. Operating System
3. Console errors (screenshot)
4. Network tab (screenshot of failed request)
5. Steps to reproduce

### Where to Report:
- GitHub Issues: `/issues`
- Dev Team: `@your-team`

---

## Success Checklist

Before reporting a bug, verify:
- [ ] Camera permission granted
- [ ] Using HTTPS or localhost
- [ ] No other app using camera
- [ ] Browser supports MediaRecorder API
- [ ] Console shows "Recording started"
- [ ] Stop button becomes enabled during recording
- [ ] Network request to Supabase succeeds
- [ ] Verdict displays after analysis

If all checked and still broken → It's a real bug! 🐛
