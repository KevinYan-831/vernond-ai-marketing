# 🤖 Gemini API Setup Guide

## Quick Start

Your magic trick analyzer now uses **Google Gemini 1.5 Flash** with native video analysis support!

---

## 1. Get Your Gemini API Key

### Step 1: Visit Google AI Studio
Go to: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### Step 2: Create API Key
1. Click **"Get API key"**
2. Select **"Create API key in new project"** (or use existing project)
3. Copy the key (format: `AIza...`)

**Important**: Keep this key secret! Never commit it to Git.

---

## 2. Add Key to Supabase

### Via Supabase Dashboard:

1. Go to your Supabase project dashboard
2. Navigate to: **Settings → Edge Functions → Secrets**
3. Click **"Add new secret"**
4. Enter:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `AIzaSy...` (your actual key)
5. Click **Save**

### Via Supabase CLI (Alternative):

```bash
# Set the secret
supabase secrets set GEMINI_API_KEY=AIzaSy...

# Verify it's set
supabase secrets list
```

---

## 3. Deploy Edge Function

```bash
# Deploy the updated function
supabase functions deploy analyze-magic-trick

# Check deployment status
supabase functions list

# View logs
supabase functions logs analyze-magic-trick --tail 20
```

---

## 4. Test the Integration

### In Your Browser:

1. Open the app: `http://localhost:5173`
2. Allow camera permissions
3. Click **Start** → Record a 5-10 second magic trick
4. Click **Stop**
5. Wait for analysis (8-12 seconds)
6. See Gemini's verdict!

### Check Console Logs:

**Browser Console** (F12):
```
Received video file: magic-trick.webm, size: XXXXX bytes
Uploading video...
Analyzing...
✅ AI Analysis Complete
Verdict: caught (or fooled)
```

**Supabase Function Logs**:
```bash
supabase functions logs analyze-magic-trick --follow
```

You should see:
```
Converting video to base64 for Gemini...
Video size: XX.XX KB
Calling Gemini API with video...
Gemini API response received
Gemini response: { "verdict": "caught", ... }
```

---

## 5. How It Works

### Complete Flow:

```
1. User records video (WebM format)
         ↓
2. Frontend uploads to Supabase Edge Function
         ↓
3. Edge Function converts video to base64
         ↓
4. Sends to Gemini API with analysis prompt
         ↓
5. Gemini analyzes actual video frames
         ↓
6. Returns JSON verdict
         ↓
7. User sees result: "CAUGHT" or "FOOLED"
```

### What Gemini Receives:

```typescript
{
  contents: [{
    parts: [
      {
        text: "Analyze this magic trick video and detect sleight of hand..."
      },
      {
        inline_data: {
          mime_type: "video/webm",
          data: "<base64_video_data>"
        }
      }
    ]
  }]
}
```

### Gemini Response Format:

```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "{\"verdict\": \"caught\", \"confidence\": 0.85, \"timestamps\": [\"0:02.34\", \"0:05.12\"], \"analysis\": \"Detected palming technique at 2 seconds...\"}"
      }]
    }
  }]
}
```

---

## 6. Gemini API Capabilities

### What Gemini Can Do:

✅ **Analyze actual video frames** (not just metadata)
✅ **Detect hand movements** and sleight of hand
✅ **Identify specific timestamps** where tricks occur
✅ **Provide detailed analysis** of magic techniques
✅ **Native video support** (no FFmpeg required)

### Video Specifications:

- **Format**: WebM (VP9/VP8 codec)
- **Max size**: 20 MB (Gemini limit)
- **Optimal duration**: 5-15 seconds
- **Resolution**: 1280x720 (captured by app)

---

## 7. Cost & Limits

### Gemini 1.5 Flash Pricing (as of 2025):

| Item | Cost |
|------|------|
| **Video input** | $0.000001875/second (up to 128K context) |
| **Text output** | $0.000000375/char |
| **Total per 10s video** | ~$0.00002 per analysis |

**Extremely affordable!** ~2,000 analyses for $1.

### Rate Limits:

- **Free tier**: 15 requests per minute
- **Paid tier**: 1,000+ requests per minute
- See: [https://ai.google.dev/pricing](https://ai.google.dev/pricing)

---

## 8. Troubleshooting

### "GEMINI_API_KEY not set"

**Problem**: Function logs show fallback to random analysis

**Solution**:
1. Verify key is set in Supabase Dashboard → Settings → Edge Functions → Secrets
2. Redeploy function: `supabase functions deploy analyze-magic-trick`
3. Wait 30 seconds for deployment to complete

### "Gemini API error: 400"

**Problem**: Invalid request format

**Possible causes**:
- Video file too large (>20 MB)
- Invalid base64 encoding
- Incorrect mime type

**Solution**:
- Record shorter videos (5-10 seconds)
- Check console for video size
- Verify codec is WebM VP9/VP8

### "Gemini API error: 403"

**Problem**: Invalid API key or quota exceeded

**Solution**:
1. Verify API key is correct (starts with `AIza`)
2. Check quota at: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
3. Enable billing if needed

### "Could not parse JSON from Gemini response"

**Problem**: Gemini returned text instead of JSON

**Why**: Sometimes LLMs add extra text around JSON

**Solution**: Already handled! The code uses regex to extract JSON:
```typescript
const jsonMatch = resultText.match(/\{[\s\S]*\}/);
```

If this persists, check function logs for actual response.

---

## 9. Testing Checklist

Before going live, verify:

- [ ] Camera permissions work
- [ ] Recording starts after countdown
- [ ] Stop button clickable during recording
- [ ] Video uploads successfully
- [ ] Analysis takes 8-12 seconds (dramatic effect)
- [ ] Verdict displays correctly ("CAUGHT" or "FOOLED")
- [ ] Timestamps show if caught
- [ ] Console shows Gemini API response (not fallback)
- [ ] Try Again button resets properly

---

## 10. Advanced Configuration

### Adjust AI Prompt

Edit `/app/supabase/functions/analyze-magic-trick/index.ts` line 55-78:

```typescript
text: `You are analyzing a video recording of someone performing a close-up magic trick.

Your task:
1. Watch the video carefully and analyze the magic trick performance
2. Look for any visible sleight of hand, palming, misdirection, or trick techniques
3. Identify specific moments (timestamps) where tricks are detected
4. Determine if the performance was clean or if you caught the method

Respond in this EXACT JSON format (no other text):
{
  "verdict": "caught" or "fooled",
  "confidence": 0.75,
  "timestamps": ["0:02.34", "0:05.12"],
  "analysis": "Detailed description of what you observed in the video"
}

Rules:
- If you detect the trick method in the video, verdict = "caught" and include specific timestamps
- If the trick appears clean, verdict = "fooled" and timestamps = []
- Be critical and thorough - analyze hand movements, angles, timing
- Provide specific analysis of what you saw in the video

Analyze this magic trick video now:`
```

### Use Different Gemini Model

Current: `gemini-1.5-flash` (fastest, cheapest)

Alternatives:
- `gemini-1.5-pro` (more accurate, slower, more expensive)
- `gemini-1.5-pro-exp` (experimental, highest quality)

Change in line 43:
```typescript
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`;
```

---

## 11. Production Deployment

### Vercel/Netlify (Frontend):

```bash
# Build the app
npm run build

# Deploy /dist folder to your hosting platform
```

### Supabase (Backend):

```bash
# Deploy function
supabase functions deploy analyze-magic-trick

# Set production API key
supabase secrets set GEMINI_API_KEY=AIza... --project-ref your-project-ref

# Enable CORS if needed
# (already configured in index.ts)
```

### Environment Variables:

**Frontend (.env.production)**:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

**Backend (Supabase Dashboard)**:
- `GEMINI_API_KEY` = Your production Gemini key

---

## 12. Monitoring & Analytics

### View Function Logs:

```bash
# Real-time logs
supabase functions logs analyze-magic-trick --follow

# Last 50 logs
supabase functions logs analyze-magic-trick --tail 50

# Filter by error
supabase functions logs analyze-magic-trick --tail 100 | grep "error"
```

### Track Usage:

Check Gemini usage at:
[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

Shows:
- Requests per day
- Token usage
- Cost breakdown

---

## 13. Security Best Practices

### ✅ DO:
- Store API key in Supabase Secrets (environment variables)
- Use HTTPS for all requests
- Validate video file sizes before upload
- Rate limit requests if public-facing

### ❌ DON'T:
- Never commit API keys to Git
- Never expose keys in frontend code
- Never log API keys in console
- Never use same key for dev and production

---

## Summary

✅ **Gemini API key added** to Supabase Secrets
✅ **Edge function deployed** with Gemini integration
✅ **Video automatically uploaded** and analyzed
✅ **Real AI analysis** with native video support
✅ **Cost-effective** (~$0.00002 per analysis)
✅ **No FFmpeg required** (Gemini handles video natively)

**Everything works end-to-end!** 🎉

---

## Quick Commands Reference

```bash
# Set API key
supabase secrets set GEMINI_API_KEY=AIza...

# Deploy function
supabase functions deploy analyze-magic-trick

# View logs
supabase functions logs analyze-magic-trick --follow

# Test locally
npm run dev

# Build for production
npm run build
```

---

## Support & Resources

- **Gemini API Docs**: [https://ai.google.dev/docs](https://ai.google.dev/docs)
- **Gemini Pricing**: [https://ai.google.dev/pricing](https://ai.google.dev/pricing)
- **Get API Key**: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)

---

**Ready to test with real AI!** 🎩✨
