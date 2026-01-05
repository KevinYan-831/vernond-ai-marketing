# ⚡ Quick Fix - ERR_NAME_NOT_RESOLVED

## The Problem

Your app can't find the Supabase edge function because **it's not deployed yet**.

---

## The Solution (2 Steps)

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 2: Run the Deployment Script

```bash
./deploy-function.sh
```

This will:
1. Log you into Supabase
2. Link to your project
3. Deploy the edge function
4. Set up your Gemini API key

---

## Alternative: Manual Deployment

If the script doesn't work, do it manually:

### 1. Login
```bash
supabase login
```

### 2. Link Project
```bash
supabase link --project-ref vnixswtxvuqtytnegqos
```

### 3. Deploy
```bash
supabase functions deploy analyze-magic-trick
```

### 4. Set API Key
```bash
# Get key from: https://aistudio.google.com/app/apikey
supabase secrets set GEMINI_API_KEY=AIza...
```

---

## After Deployment

### 1. Restart Dev Server
Your dev server is already running at `http://localhost:5173`

Just hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

### 2. Test
- Record a magic trick video
- Watch the console (F12)
- You should see: `"Calling Gemini API with video..."`

---

## Still Having Issues?

Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed help.

---

**Quick Links**:
- Get Gemini API Key: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- Supabase Dashboard: [supabase.com/dashboard](https://supabase.com/dashboard)
- Your App: [localhost:5173](http://localhost:5173)
