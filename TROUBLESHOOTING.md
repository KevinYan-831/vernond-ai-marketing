# 🔧 Troubleshooting: Edge Function Not Found

## Current Issue

You're seeing this error:
```
POST https://gpjmttgqolnblfiiikra.supabase.co/functions/v1/analyze-magic-trick
net::ERR_NAME_NOT_RESOLVED
```

This means the edge function hasn't been deployed to Supabase yet.

---

## Solution: Deploy the Edge Function

### Step 1: Check Your Supabase Project

1. Go to: **[https://supabase.com/dashboard](https://supabase.com/dashboard)**
2. Log in with your account
3. Find your project (should show `vnixswtxvuqtytnegqos` in the URL)

### Step 2: Deploy the Edge Function

You have **two options**:

#### Option A: Deploy via Supabase Dashboard (Easiest)

1. In your Supabase Dashboard, go to **Edge Functions** (left sidebar)
2. Click **"New Function"** or **"Deploy Function"**
3. You'll need to upload your function code

**OR** use the Supabase CLI (recommended):

#### Option B: Deploy via Supabase CLI

**Install Supabase CLI** (if not installed):
```bash
npm install -g supabase
```

**Login to Supabase**:
```bash
supabase login
```

**Link your project**:
```bash
supabase link --project-ref vnixswtxvuqtytnegqos
```

**Deploy the function**:
```bash
supabase functions deploy analyze-magic-trick
```

---

### Step 3: Set the Gemini API Key

After deploying, you need to set the environment variable:

**Via Dashboard**:
1. Go to: **Settings → Edge Functions → Secrets**
2. Add new secret:
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key (get from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))

**Via CLI**:
```bash
supabase secrets set GEMINI_API_KEY=AIza...
```

---

### Step 4: Verify Deployment

**Test the endpoint**:
```bash
curl -X POST "https://vnixswtxvuqtytnegqos.supabase.co/functions/v1/analyze-magic-trick" \
  -H "Content-Type: application/json"
```

**Expected response** (when no video is sent):
```json
{"error": "No video file provided"}
```

If you see this, the function is deployed! ✅

---

## Alternative: Use Local Supabase (for Development)

If you want to test locally without deploying:

### Install Supabase CLI
```bash
npm install -g supabase
```

### Start Local Supabase
```bash
supabase start
```

This will:
- Start a local Supabase instance
- Give you a local URL (e.g., `http://localhost:54321`)
- Provide local anon key

### Update `.env` for Local Development
```bash
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<local_anon_key_from_supabase_start>
```

### Serve Function Locally
```bash
supabase functions serve analyze-magic-trick --env-file .env.local
```

Create `.env.local` in your project root:
```bash
GEMINI_API_KEY=AIza...
```

---

## Current Configuration Summary

Based on your `.env` file:

```
Project URL: https://vnixswtxvuqtytnegqos.supabase.co
Project Ref: vnixswtxvuqtytnegqos
Function Path: /supabase/functions/analyze-magic-trick/
```

**What you need to do**:
1. ✅ Edge function code is ready (in `/app/supabase/functions/analyze-magic-trick/`)
2. ❌ Function needs to be deployed to Supabase
3. ❌ `GEMINI_API_KEY` needs to be set in Supabase secrets

---

## Quick Deploy Script

I've created a helper script for you:

```bash
# Make it executable
chmod +x deploy-function.sh

# Run it
./deploy-function.sh
```

This will:
1. Check if Supabase CLI is installed
2. Link to your project
3. Deploy the function
4. Prompt for Gemini API key
5. Set the secret

---

## Verification Steps

After deploying, test the full flow:

### 1. Check Function is Live
```bash
curl https://vnixswtxvuqtytnegqos.supabase.co/functions/v1/analyze-magic-trick
```

Should return: `{"error": "No video file provided"}`

### 2. Open Your App
```
http://localhost:5173
```

### 3. Record a Video
- Allow camera permissions
- Click Start → Record → Stop

### 4. Check Console (F12)
Look for:
- ✅ `"Received video file: magic-trick.webm..."`
- ✅ `"Converting video to base64 for Gemini..."`
- ✅ `"Calling Gemini API with video..."`

If you see:
- ❌ `"GEMINI_API_KEY not set, falling back to random analysis"`
  → Set the API key in Supabase Dashboard

---

## Common Errors & Fixes

### Error: `ERR_NAME_NOT_RESOLVED`
**Cause**: Wrong Supabase URL or function not deployed

**Fix**:
- Verify URL in `.env` matches your project
- Deploy the edge function

### Error: `404 Not Found`
**Cause**: Edge function not deployed

**Fix**: Deploy with `supabase functions deploy analyze-magic-trick`

### Error: `403 Forbidden`
**Cause**: Invalid anon key

**Fix**:
- Get correct anon key from Supabase Dashboard → Settings → API
- Update `VITE_SUPABASE_ANON_KEY` in `.env`

### Error: Function returns fallback analysis
**Cause**: `GEMINI_API_KEY` not set

**Fix**: Add secret in Supabase Dashboard → Settings → Edge Functions → Secrets

---

## Need Help?

1. **Check Supabase Logs**:
   - Dashboard → Edge Functions → analyze-magic-trick → Logs

2. **Check Browser Console**:
   - F12 → Console tab → Look for errors

3. **Verify Environment**:
   ```bash
   # Check .env file
   cat .env

   # Should show:
   # VITE_SUPABASE_URL=https://vnixswtxvuqtytnegqos.supabase.co
   # VITE_SUPABASE_ANON_KEY=eyJ...
   ```

---

## Next Steps

Once the function is deployed and working:

1. ✅ Get Gemini API key: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. ✅ Add to Supabase secrets: `GEMINI_API_KEY`
3. ✅ Test the app with real AI analysis
4. ✅ Enjoy! 🎩✨

---

**Updated**: 2026-01-05
