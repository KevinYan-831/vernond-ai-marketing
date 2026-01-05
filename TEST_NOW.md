# 🧪 Test Your App Right Now

## Current Status

✅ Supabase URL: `myqwvtrpvrxtwypcwxpg.supabase.co`
✅ Function name: `supabase-functions-analyze-magic-trick`
✅ Function is deployed and responding
✅ Dev server restarted with new config
✅ Enhanced logging added

---

## How to Test

### 1. Hard Refresh Your Browser

**Important**: The dev server was restarted with new configuration.

- Mac: `Cmd + Shift + R`
- Windows/Linux: `Ctrl + Shift + R`

### 2. Open Browser Console

Press `F12` or:
- Mac: `Cmd + Option + I`
- Windows/Linux: `Ctrl + Shift + I`

Click the **Console** tab

### 3. Record a Video

1. Allow camera permissions (if prompted)
2. Click **Start**
3. Wait for countdown (3-2-1)
4. Record for 5-10 seconds
5. Click **Stop**

### 4. Watch the Console

You should see this sequence:

```javascript
// Recording phase
Recording started, state: recording
Data chunk received: XXXX bytes
Data chunk received: XXXX bytes
...
Recording stopped, chunks: XX
Created blob: XXXXX bytes

// Upload phase
Starting upload and analysis...
Upload progress complete

// Analysis phase
Starting AI analysis...
Preparing video for upload, size: XXXXX bytes
Calling Supabase function: supabase-functions-analyze-magic-trick
Supabase function returned. Data: {...} Error: null
```

---

## What to Look For

### ✅ Success (Real AI Working)

If you see in the console:
```javascript
Supabase function returned. Data: {
  verdict: "caught" (or "fooled"),
  confidence: 0.85,
  timestamps: ["0:02.34"],
  analysis: "Detailed analysis text..."
} Error: null
```

**This means**:
- ✅ Video uploaded successfully
- ✅ Gemini API analyzed the video
- ✅ Real AI is working!

### ⚠️ Fallback Mode (API Key Not Set)

If the verdict is generic ("Hand movement detected at key frame"), it means:
- Video uploaded successfully
- But `GEMINI_API_KEY` is not set in Supabase
- App is using fallback random analysis

**To fix**: Set `GEMINI_API_KEY` in Supabase Dashboard:
- Go to: https://supabase.com/dashboard/project/myqwvtrpvrxtwypcwxpg/settings/functions
- Add secret: `GEMINI_API_KEY` = your key

### ❌ Error

If you see:
```javascript
Supabase function returned. Data: null Error: {...}
```

**Check the error message** and see below.

---

## Common Errors & Fixes

### Error: "Failed to send a request to the Edge Function"

**Cause**: Network issue or wrong URL

**Check**:
1. You hard refreshed the browser?
2. Internet connection is working?
3. URL in console shows: `myqwvtrpvrxtwypcwxpg.supabase.co`

### Error: "Body can not be decoded as form data"

**Cause**: This is normal when testing without a video

**Fix**: Ignore - this only happens when testing the endpoint directly without video

### Error: "No video file provided"

**Cause**: Video didn't upload properly

**Check**:
1. Blob was created? Look for: `Created blob: XXXXX bytes`
2. Blob size is >0?
3. Recording stopped properly?

### Error: "GEMINI_API_KEY not set"

**This appears in Supabase function logs**, not browser console.

**Fix**: Set the API key in Supabase Dashboard (see above)

---

## Verify Edge Function Logs

You can also check the Supabase function logs to see what's happening server-side:

### Via Dashboard:
1. Go to: https://supabase.com/dashboard/project/myqwvtrpvrxtwypcwxpg/functions
2. Click on `supabase-functions-analyze-magic-trick`
3. Click **Logs** tab
4. Look for recent entries

### Via CLI (if installed):
```bash
supabase functions logs supabase-functions-analyze-magic-trick --tail 20
```

**What to look for**:
```
Received video file: magic-trick.webm, size: XXXXX bytes
Converting video to base64 for Gemini...
Video size: XX.XX KB
Calling Gemini API with video...  ← Good! Real AI
Gemini API response received
```

OR:

```
Received video file: magic-trick.webm, size: XXXXX bytes
GEMINI_API_KEY not set, falling back to random analysis  ← Need to set key
```

---

## Next Steps

### If Everything Works (Real AI):
🎉 **Congratulations!** You're done!

Test with different magic tricks:
- Card tricks
- Coin tricks
- Disappearing acts
- Sleight of hand

See if you can fool Gemini! 😄

### If Using Fallback Mode:
Set the `GEMINI_API_KEY`:

1. Get key: https://aistudio.google.com/app/apikey
2. Add to Supabase: https://supabase.com/dashboard/project/myqwvtrpvrxtwypcwxpg/settings/functions
3. Test again (no need to restart server)

---

## Quick Checklist

Before testing, verify:

- [ ] Browser hard refreshed (`Cmd+Shift+R` or `Ctrl+Shift+R`)
- [ ] Console is open (F12)
- [ ] Camera permissions granted
- [ ] Recording works (see "Data chunk received" messages)
- [ ] Stop button works (see "Recording stopped")

During test, watch for:

- [ ] "Starting upload and analysis..." appears
- [ ] "Calling Supabase function..." appears
- [ ] "Supabase function returned. Data: {...}" appears
- [ ] Verdict displays on screen

---

## Expected Timeline

From clicking **Stop** to seeing verdict:

```
0s  - Recording stops, blob created
1s  - Upload progress animation
2s  - Analysis starts
10s - API call completes
11s - Verdict displays
```

Total: ~11 seconds (includes 8-12s artificial delay for drama)

---

## Debugging Tips

### Enable Network Tab

In browser console:
1. Click **Network** tab
2. Record a video
3. Look for request to: `supabase-functions-analyze-magic-trick`
4. Click on it → **Response** tab
5. See the actual response from Gemini

### Check Response

The response should look like:
```json
{
  "verdict": "caught",
  "confidence": 0.85,
  "timestamps": ["0:02.34", "0:05.12"],
  "analysis": "Detected palming technique at 2 seconds..."
}
```

---

## Still Having Issues?

1. **Check** [FINAL_SETUP.md](FINAL_SETUP.md) for configuration
2. **Check** [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
3. **Share** the console errors with me

---

**Ready to test?** Open http://localhost:5173 and give it a try! 🎩✨
