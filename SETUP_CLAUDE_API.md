# 🤖 Claude API Integration Setup

## Overview

The Magic Analyzer uses Claude's AI to analyze magic trick videos. Currently, it uses a **fallback random analysis** for demo purposes. Follow this guide to enable **real AI analysis**.

---

## Quick Start (3 Steps)

### 1. Get Your Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign in or create an account
3. Navigate to **Settings** → **API Keys**
4. Click **Create Key**
5. Copy your API key (starts with `sk-ant-...`)

💡 **Note**: Keep this key secret! Never commit it to Git.

---

### 2. Add Key to Supabase

#### Option A: Supabase Dashboard (Recommended)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Edge Functions**
4. Under **Secrets**, add:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: Your API key from step 1
5. Click **Save**

#### Option B: Supabase CLI
```bash
# If you have Supabase CLI installed
supabase secrets set ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

### 3. Deploy the Edge Function

```bash
# Deploy the analyze-magic-trick function
supabase functions deploy analyze-magic-trick

# Verify deployment
supabase functions list
```

You should see:
```
analyze-magic-trick | deployed | [timestamp]
```

---

## Testing the Integration

### Test 1: Check Function Logs
```bash
# Stream live logs
supabase functions logs analyze-magic-trick --follow
```

### Test 2: Manual API Call
```bash
# Test with a dummy video file
curl -X POST https://your-project.supabase.co/functions/v1/analyze-magic-trick \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F "video=@test-video.webm"
```

Expected response:
```json
{
  "verdict": "caught",
  "confidence": 0.85,
  "timestamps": ["0:02.34", "0:05.12"],
  "analysis": "Hand movement detected at key frame. Possible palm technique identified."
}
```

### Test 3: Full User Flow
1. Open the app: `http://localhost:5173`
2. Allow camera access
3. Click **Start** → Perform magic trick → Click **Stop**
4. Watch AI analysis animation
5. Check browser console for:
   ```
   Analysis complete!
   Verdict: caught/fooled
   ```

---

## Current Implementation

The edge function in `/app/supabase/functions/analyze-magic-trick/index.ts`:

```typescript
async function analyzeWithClaude(): Promise<AnalysisResult> {
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

  if (!anthropicApiKey) {
    console.warn('ANTHROPIC_API_KEY not set, falling back to random analysis');
    return fallbackAnalysis(); // ← You'll see this in action now
  }

  // Real Claude API integration happens here
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicApiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Analyze this magic trick video...`
      }]
    })
  });

  // Parse and return analysis
}
```

---

## Upgrading to Video Frame Analysis (Advanced)

Currently, Claude analyzes text descriptions. To analyze actual video frames:

### What You Need:
1. FFmpeg binary in edge function
2. Video frame extraction logic
3. Base64 encoding of frames
4. Claude Vision API integration

### Implementation Steps:

#### 1. Add FFmpeg to Edge Function
```typescript
// Option A: Use Deno FFmpeg wrapper
import { ffmpeg } from "https://deno.land/x/ffmpeg/mod.ts";

// Option B: Call FFmpeg binary (requires custom Docker image)
const ffmpegProcess = new Deno.Command("ffmpeg", {
  args: ["-i", videoPath, "-vf", "fps=1", "frame-%03d.png"]
});
```

#### 2. Extract Frames
```typescript
async function extractVideoFrames(videoBlob: Blob, numFrames: number = 5): Promise<string[]> {
  // Save blob to temp file
  const tempFile = await Deno.makeTempFile({ suffix: '.webm' });
  await Deno.writeFile(tempFile, new Uint8Array(await videoBlob.arrayBuffer()));

  // Extract frames with FFmpeg
  const framesDir = await Deno.makeTempDir();
  await ffmpeg([
    '-i', tempFile,
    '-vf', `select='not(mod(n,${Math.floor(30/numFrames)}))'`, // Extract evenly spaced frames
    '-vsync', 'vfr',
    '-q:v', '2',
    `${framesDir}/frame-%03d.jpg`
  ]);

  // Read and encode frames as base64
  const frames: string[] = [];
  for (let i = 1; i <= numFrames; i++) {
    const framePath = `${framesDir}/frame-${i.toString().padStart(3, '0')}.jpg`;
    const frameData = await Deno.readFile(framePath);
    const base64 = btoa(String.fromCharCode(...frameData));
    frames.push(`data:image/jpeg;base64,${base64}`);
  }

  // Cleanup
  await Deno.remove(tempFile);
  await Deno.remove(framesDir, { recursive: true });

  return frames;
}
```

#### 3. Update Claude API Call
```typescript
async function analyzeWithClaude(frames: string[]): Promise<AnalysisResult> {
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

  const content = [
    {
      type: "text",
      text: "Analyze this magic trick. Look for sleight of hand, palming, or misdirection."
    },
    ...frames.map(frame => ({
      type: "image",
      source: {
        type: "base64",
        media_type: "image/jpeg",
        data: frame.split(',')[1] // Remove data:image/jpeg;base64, prefix
      }
    }))
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicApiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: content
      }]
    })
  });

  return await response.json();
}
```

#### 4. Update Main Handler
```typescript
Deno.serve(async (req) => {
  // ... existing code ...

  const formData = await req.formData();
  const videoFile = formData.get('video') as File;

  // Extract frames from video
  const frames = await extractVideoFrames(videoFile, 5);

  // Analyze with Claude Vision
  const result = await analyzeWithClaude(frames);

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
```

---

## Cost Estimation

### Claude API Pricing (as of 2024):
- **Claude 3.5 Sonnet**: $3 per million input tokens, $15 per million output tokens
- **Images**: ~1,600 tokens per image (varies by size)

### Example Analysis:
- 5 video frames: ~8,000 input tokens
- Analysis response: ~200 output tokens
- **Cost per analysis**: ~$0.03

### Monthly Estimates:
| Users/day | Analyses/month | Cost/month |
|-----------|----------------|------------|
| 10        | 300            | $9         |
| 100       | 3,000          | $90        |
| 1,000     | 30,000         | $900       |

💡 **Tip**: Set usage limits in Anthropic Console to avoid surprises!

---

## Troubleshooting

### Error: "ANTHROPIC_API_KEY not set"
- Check Supabase secrets: Dashboard → Settings → Edge Functions → Secrets
- Verify key name is exactly `ANTHROPIC_API_KEY` (case-sensitive)
- Redeploy function after adding secret

### Error: "Invalid API key"
- Verify key starts with `sk-ant-`
- Check for extra spaces or newlines
- Generate a new key in Anthropic Console

### Error: "Rate limit exceeded"
- You've hit Anthropic's rate limit
- Wait 60 seconds and try again
- Consider upgrading your Anthropic plan

### Error: "Model not found"
- Check model name in edge function
- Current: `claude-3-5-sonnet-20241022`
- See available models: [Anthropic Models](https://docs.anthropic.com/claude/docs/models-overview)

### Still Using Fallback?
Check function logs:
```bash
supabase functions logs analyze-magic-trick --tail 50
```

Look for:
```
ANTHROPIC_API_KEY not set, falling back to random analysis
```

---

## Security Best Practices

### ✅ DO:
- Store API key in Supabase Secrets
- Use environment variables
- Rotate keys every 90 days
- Set usage limits in Anthropic Console
- Monitor API usage regularly

### ❌ DON'T:
- Commit API keys to Git
- Share keys in Slack/Discord
- Use keys in client-side code
- Leave keys in plain text files
- Reuse keys across projects

---

## Support

### Need Help?
- **Anthropic Docs**: [docs.anthropic.com](https://docs.anthropic.com)
- **Supabase Docs**: [supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)
- **Our Debugging Guide**: See `DEBUGGING.md`

### Still Stuck?
Open an issue with:
1. Function logs (`supabase functions logs`)
2. Error message
3. Browser console output
4. Steps to reproduce

---

## Next Steps

Once Claude API is working:
1. ✅ Test with real magic trick videos
2. ✅ Fine-tune analysis prompts for accuracy
3. ✅ Implement video frame extraction (optional)
4. ✅ Set up usage monitoring
5. ✅ Configure rate limiting

Happy magic analyzing! 🎩✨
