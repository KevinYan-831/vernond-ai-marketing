# 🚀 Quick Setup - Enable Real AI Analysis

Your app is currently using **fallback/demo analysis** because the Gemini API key isn't set yet.

---

## Why It's Not Working Yet

The edge function code is correct, but it's checking for the `GEMINI_API_KEY` environment variable:

```typescript
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

if (!geminiApiKey) {
  console.warn('GEMINI_API_KEY not set, falling back to random analysis');
  return fallbackAnalysis();  // ← This is what's happening now
}
```

Since the key isn't set, it falls back to random verdicts.

---

## Fix It Now (2 Minutes)

### Step 1: Get Gemini API Key

1. Visit: **[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)**
2. Click **"Get API key"**
3. Select **"Create API key in new project"** (or use existing)
4. Copy the key (starts with `AIza...`)

**Keep this key safe!** Don't share it publicly.

---

### Step 2: Add Key to Supabase

#### Option A: Via Dashboard (Easiest)

1. Go to your Supabase project:
   **[https://supabase.com/dashboard/project/gpjmttgqolnblfiiikra](https://supabase.com/dashboard/project/gpjmttgqolnblfiiikra)**

2. Navigate to: **Settings → Edge Functions** (left sidebar)

3. Scroll to **"Secrets"** section

4. Click **"Add new secret"** or **"New secret"**

5. Enter:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `AIza...` (paste your key)

6. Click **"Add secret"** or **"Save"**

---

#### Option B: Via CLI (If Installed)

If you have Supabase CLI installed:

```bash
# Run the helper script
./setup-gemini-key.sh

# Or manually:
supabase secrets set GEMINI_API_KEY=AIza...
```

---

### Step 3: Deploy the Function

**Via Dashboard**:
1. Go to: **[Edge Functions](https://supabase.com/dashboard/project/gpjmttgqolnblfiiikra/functions)**
2. Find `analyze-magic-trick`
3. Click **"Deploy"** or redeploy

**Via CLI** (if installed):
```bash
supabase functions deploy analyze-magic-trick
```

---

### Step 4: Test It!

1. **Refresh your app** (hard refresh: `Cmd+Shift+R` or `Ctrl+Shift+R`)

2. **Record a video**:
   - Click Start
   - Record 5-10 seconds
   - Click Stop

3. **Watch the console** (F12):

   ✅ **With API key set**:
   ```
   Converting video to base64 for Gemini...
   Video size: XX.XX KB
   Calling Gemini API with video...
   Gemini API response received
   Gemini response: { "verdict": "caught", ... }
   ```

   ❌ **Without API key**:
   ```
   GEMINI_API_KEY not set, falling back to random analysis
   ```

4. **See real AI verdict** based on actual video analysis!

---

## Troubleshooting

### Still seeing "falling back to random analysis"?

**Check:**
1. ✅ Key is set in **Supabase Dashboard** (not local `.env` file)
2. ✅ Key name is exactly: `GEMINI_API_KEY` (case-sensitive)
3. ✅ Function has been deployed/redeployed after adding key
4. ✅ Waited 30-60 seconds after deployment

**How to verify**:
```bash
# Check if function is deployed
curl https://gpjmttgqolnblfiiikra.supabase.co/functions/v1/analyze-magic-trick

# Should return: {"error": "No video file provided"}
# (This is good - it means function is running)
```

---

### "Gemini API error: 403"?

**Cause**: Invalid API key or quota exceeded

**Fix**:
1. Verify key is correct (copy/paste again)
2. Check quota at: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
3. Enable billing if needed (free tier: 15 requests/min)

---

### "Gemini API error: 400"?

**Cause**: Video too large (>20 MB)

**Fix**: Record shorter videos (5-10 seconds is optimal)

---

## How to Verify It's Working

### Browser Console (F12):

**Before (Fallback)**:
```javascript
GEMINI_API_KEY not set, falling back to random analysis
Verdict: caught  // Random, 60/40 split
```

**After (Real AI)**:
```javascript
Converting video to base64 for Gemini...
Video size: 1234.56 KB
Calling Gemini API with video...
Gemini API response received
Gemini response: {"verdict":"caught","confidence":0.85,"timestamps":["0:02.34"],"analysis":"Detected palming technique..."}
Verdict: caught  // Based on actual video analysis!
```

---

## Quick Reference

| What | Where |
|------|-------|
| **Get API Key** | [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |
| **Supabase Dashboard** | [https://supabase.com/dashboard/project/gpjmttgqolnblfiiikra](https://supabase.com/dashboard/project/gpjmttgqolnblfiiikra) |
| **Add Secret** | Dashboard → Settings → Edge Functions → Secrets |
| **Edge Functions** | Dashboard → Edge Functions |
| **Your Project** | [http://localhost:5173](http://localhost:5173) |

---

## Cost Estimate

With Gemini 1.5 Flash:

| Usage | Cost |
|-------|------|
| 1 video (10s) | ~$0.00002 |
| 100 videos | ~$0.002 |
| 1,000 videos | ~$0.02 |
| 10,000 videos | ~$0.20 |

**Extremely affordable!** Test all you want.

---

## Next Steps After Setup

Once real AI is working:

1. ✅ Test with different magic tricks
2. ✅ See how accurate Gemini's detection is
3. ✅ Check if timestamps match actual sleight of hand
4. ✅ Share with friends and get feedback!

---

## Summary

**Current state**: Fallback analysis (random verdicts)

**To enable real AI**:
1. Get Gemini key: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Add to Supabase: Dashboard → Settings → Edge Functions → Secrets
3. Deploy function (or wait for auto-deploy)
4. Test and watch console logs!

**Questions?** Check [SETUP_GEMINI_API.md](SETUP_GEMINI_API.md) for full details.

---

**Ready to enable real AI? Let's go!** 🎩✨
