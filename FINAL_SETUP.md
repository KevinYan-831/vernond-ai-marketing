# ✅ Final Setup Steps

## Good News!

Your edge function is **already deployed** and working! 🎉

**Function URL**: `https://myqwvtrpvrxtwypcwxpg.supabase.co/functions/v1/supabase-functions-analyze-magic-trick`

---

## What I Just Fixed

1. ✅ Updated `.env` with correct Supabase URL: `myqwvtrpvrxtwypcwxpg.supabase.co`
2. ✅ Updated frontend to call correct function name: `supabase-functions-analyze-magic-trick`
3. ✅ Verified endpoint is live and responding

---

## Last Step: Set Gemini API Key

Your function is deployed but needs the `GEMINI_API_KEY` to enable real AI analysis.

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to: **[https://supabase.com/dashboard/project/myqwvtrpvrxtwypcwxpg](https://supabase.com/dashboard/project/myqwvtrpvrxtwypcwxpg)**

2. Navigate to: **Settings → Edge Functions → Secrets** (left sidebar)

3. Click **"Add new secret"** or **"New secret"**

4. Enter:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Get from [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
     - Click "Get API key"
     - Copy the key (starts with `AIza...`)
     - Paste it here

5. Click **"Save"** or **"Add secret"**

### Option 2: Via CLI

```bash
# Get your key from: https://aistudio.google.com/app/apikey
supabase secrets set GEMINI_API_KEY=AIza... --project-ref myqwvtrpvrxtwypcwxpg
```

---

## Test Your App

### 1. Hard Refresh Your Browser

The dev server is running at: **http://localhost:5173**

Hard refresh to load new config:
- **Mac**: `Cmd + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + R`

### 2. Record a Magic Trick

1. Allow camera permissions
2. Click **Start**
3. Record 5-10 seconds
4. Click **Stop**

### 3. Check Console (F12)

**With GEMINI_API_KEY set** ✅:
```
Received video file: magic-trick.webm, size: XXXXX bytes
Converting video to base64 for Gemini...
Video size: XX.XX KB
Calling Gemini API with video...
Gemini API response received
Gemini response: {"verdict":"caught",...}
```

**Without GEMINI_API_KEY** ⚠️:
```
GEMINI_API_KEY not set, falling back to random analysis
```

If you see the second message, the API key isn't set yet. Follow the steps above.

---

## Verify It's Working

### Real AI Analysis Signs:

1. **Console shows**: `"Calling Gemini API with video..."`
2. **Analysis varies** based on actual video content
3. **Timestamps are specific** (e.g., `0:02.34`, `0:05.12`)
4. **Analysis text** describes what Gemini saw in your video

### Fallback Analysis Signs:

1. **Console shows**: `"GEMINI_API_KEY not set, falling back..."`
2. **Results are random** (60% caught, 40% fooled)
3. **Generic messages** like "Hand movement detected at key frame"

---

## Current Configuration

```
Project: myqwvtrpvrxtwypcwxpg
Function: supabase-functions-analyze-magic-trick
URL: https://myqwvtrpvrxtwypcwxpg.supabase.co
Status: ✅ Deployed and running

Frontend: http://localhost:5173
Status: ✅ Running with correct config

API Key: ⚠️ Needs to be set (if not already done)
```

---

## Troubleshooting

### Still seeing "falling back to random analysis"?

1. **Check API key is set**:
   - Dashboard → Settings → Edge Functions → Secrets
   - Should see: `GEMINI_API_KEY` = `•••••••••••••`

2. **Verify key name** (case-sensitive):
   - Must be exactly: `GEMINI_API_KEY`
   - Not: `gemini_api_key` or `Gemini_API_Key`

3. **Wait 30 seconds** after adding the key:
   - Supabase needs time to propagate secrets
   - Try recording again

4. **Check function logs**:
   ```bash
   supabase functions logs supabase-functions-analyze-magic-trick --tail 20
   ```

### "Failed to analyze video" error?

This is normal if:
- Video is too large (>20 MB)
- Invalid video format
- Network timeout

**Fix**: Record shorter videos (5-10 seconds)

---

## Cost

With Gemini 1.5 Flash:

| Videos | Cost |
|--------|------|
| 10 | ~$0.0002 |
| 100 | ~$0.002 |
| 1,000 | ~$0.02 |

**Extremely affordable** for testing! 🎉

---

## Summary

✅ Edge function deployed and working
✅ Frontend configured with correct URL and function name
✅ Dev server running
⏳ **Final step**: Set `GEMINI_API_KEY` in Supabase Dashboard

Once you set the API key, **real AI analysis will work immediately**! 🚀

---

## Quick Links

- **Get Gemini Key**: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- **Supabase Dashboard**: [supabase.com/dashboard/project/myqwvtrpvrxtwypcwxpg](https://supabase.com/dashboard/project/myqwvtrpvrxtwypcwxpg)
- **Your App**: [localhost:5173](http://localhost:5173)

---

**You're almost there!** Just add the API key and you're done! 🎩✨
