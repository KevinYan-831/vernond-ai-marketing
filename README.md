# 🎩 Vernond AI - Magic Trick Analyzer

An interactive theatrical experience where users record themselves performing close-up magic tricks and receive instant AI analysis from Claude.

![Status](https://img.shields.io/badge/status-ready-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Supabase](https://img.shields.io/badge/Supabase-Edge_Functions-green)

---

## ✨ Features

- 🎥 **Live Camera Recording** with theatrical spotlight effects
- 🎭 **Dramatic Countdown** (3-2-1) with flip-card animations
- 🤖 **AI-Powered Analysis** using Google Gemini 1.5 Flash
- ⚡ **Real-time Progress** with scanning laser animations
- 🎊 **Dynamic Verdicts** ("Caught" vs "Fooled") with particle effects
- 📱 **WeChat Integration** with ornate QR code display
- 🎬 **Silent Operation** with visual-only feedback
- 💫 **Smooth Animations** powered by Framer Motion

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 3. Test Camera & Recording
If you encounter issues, open the test page:
```
http://localhost:5173/test-recording.html
```

This standalone diagnostic tool helps verify:
- Camera permissions
- Codec support
- MediaRecorder API functionality

---

## 📋 Project Structure

```
/app
├── src/
│   ├── components/
│   │   ├── magic/
│   │   │   ├── VideoStage.tsx          # Camera feed & spotlight
│   │   │   ├── RecordingControls.tsx   # Start/Stop buttons
│   │   │   ├── Countdown.tsx            # 3-2-1 animation
│   │   │   ├── AnalysisOverlay.tsx     # AI scanning effect
│   │   │   ├── VerdictDisplay.tsx      # Verdict reveal screen
│   │   │   └── BackgroundEffects.tsx   # Ambient atmosphere
│   │   └── pages/
│   │       └── magic-analyzer.tsx      # Main orchestrator
│   ├── utils/
│   │   └── sounds.ts                   # Web Audio sound effects
│   └── index.css                       # Custom animations & fonts
├── supabase/
│   └── functions/
│       └── analyze-magic-trick/        # Claude API integration
│           ├── index.ts
│           └── deno.json
├── MAGIC_ANALYZER.md                   # Full design documentation
├── DEBUGGING.md                        # Troubleshooting guide
├── SETUP_CLAUDE_API.md                 # AI integration guide
└── test-recording.html                 # Diagnostic test page
```

---

## 🎨 Design System

### Color Palette
```css
--magic-charcoal: #0A0A0F;   /* Deep background */
--magic-gold: #D4AF37;        /* Accent & success */
--magic-crimson: #8B0000;     /* Alert & "caught" */
--magic-amber: #FFD700;       /* Spotlight glow */
--magic-purple: #1A0A2E;      /* Ambient shadows */
```

### Typography
- **Display**: Syne Extra Bold (900) — Headings, verdicts
- **Body**: Space Grotesk (400, 500) — UI text, instructions
- **Accent**: Crimson Pro Italic — Mystical taglines

### Motion Principles
- **Reveals over fades**: Radial wipes, spotlight sweeps
- **Weight in interactions**: Buttons scale down on press (0.95)
- **Theatrical timing**: 8-12 second analysis for dramatic tension
- **Champagne bubbles**: Slow, floating particles on "fooled"

---

## 🎬 User Flow

```
1. Load Page → Spotlight sweeps across stage
              ↓
2. Grant Camera → Live feed appears with vignette
              ↓
3. Click Start → 3-2-1 countdown (flip-card animation)
              ↓
4. Recording → Red indicator pulses, user performs trick
              ↓
5. Click Stop → Shutter sound, frame freezes
              ↓
6. Upload → Progress ring animation
              ↓
7. Analysis → Scanning laser, 8-12s dramatic tension
              ↓
8. Verdict → White flash, then:
   • "CAUGHT": Red spotlight, timestamps, ominous sound
   • "FOOLED": Golden confetti, applause, skill badge
              ↓
9. WeChat CTA → QR code in ornate frame with 3D tilt
              ↓
10. Try Again → Curtain-wipe transition back to stage
```

---

## 🤖 AI Integration

### Current State: Real AI with Gemini
The app uses **Google Gemini 1.5 Flash** for real AI video analysis with native video support.

### Enable Gemini AI:
See **[SETUP_GEMINI_API.md](./SETUP_GEMINI_API.md)** for detailed instructions.

Quick version:
```bash
# 1. Get API key from aistudio.google.com/app/apikey
# 2. Add to Supabase: GEMINI_API_KEY=AIza...
# 3. Deploy function:
supabase functions deploy analyze-magic-trick
```

### Why Gemini?
- ✅ **Native video analysis** - analyzes actual video frames directly
- ✅ **No FFmpeg required** - Gemini handles video natively
- ✅ **Fast & affordable** - ~$0.00002 per 10-second video
- ✅ **High accuracy** - detects sleight of hand and timestamps
- ✅ **Easy integration** - single API call with video data

### Fallback Mode
If `GEMINI_API_KEY` is not set, the app falls back to simulated analysis (60% caught, 40% fooled) for testing.

---

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start dev server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Variables
```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Supabase Edge Function (set in dashboard)
GEMINI_API_KEY=AIza-your-key-here
```

### Browser Requirements
- Modern browser with `MediaRecorder` API support
- Camera permission required
- HTTPS or localhost (for getUserMedia)

### Tested On:
- ✅ Chrome 90+ (Desktop & Mobile)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 🐛 Troubleshooting

### Camera Not Working?
1. Check permissions (click camera icon in address bar)
2. Ensure running on HTTPS or localhost
3. Try the test page: `/test-recording.html`
4. See **[DEBUGGING.md](./DEBUGGING.md)** for full guide

### Recording Not Starting?
1. Wait 2-3 seconds for camera to initialize
2. Check browser console for codec support
3. Try refreshing the page
4. See **[DEBUGGING.md](./DEBUGGING.md)** → "Recording Doesn't Start"

### Stop Button Not Clickable?
1. Verify recording actually started (red indicator visible?)
2. Check console for "Recording started, state: recording"
3. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

### AI Analysis Stuck?
1. Check network tab for Supabase function call
2. Fallback analysis should always work (random verdict)
3. For real AI: verify `GEMINI_API_KEY` is set in Supabase
4. See **[SETUP_GEMINI_API.md](./SETUP_GEMINI_API.md)**

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[MAGIC_ANALYZER.md](./MAGIC_ANALYZER.md)** | Complete design spec, visual direction, architecture |
| **[DEBUGGING.md](./DEBUGGING.md)** | Troubleshooting guide, common issues, diagnostics |
| **[SETUP_GEMINI_API.md](./SETUP_GEMINI_API.md)** | Gemini API integration, setup guide, configuration |
| **[REAL_VIDEO_UPLOAD.md](./REAL_VIDEO_UPLOAD.md)** | Video upload implementation details |
| **test-recording.html** | Standalone camera/recording test page |

---

## 🎯 Performance

### Optimizations
- Lazy loading of verdict components
- GPU-accelerated CSS transforms
- Efficient particle system (30 particles max)
- Web Audio API sound caching
- WebM VP9/VP8 codec with fallback

### Bundle Size
- Main JS: ~666 KB (gzipped: 197 KB)
- CSS: ~99 KB (gzipped: 17 KB)

### Network
- Single video upload per session
- Supabase Edge Function: <3s response time
- Artificial 8-12s delay for UX drama

---

## 🚢 Deployment

### Build for Production
```bash
npm run build
```
Output in `/dist` folder.

### Deploy Edge Function
```bash
# Requires Supabase CLI
supabase functions deploy analyze-magic-trick

# Verify
supabase functions list
```

### Environment Setup
1. **Frontend**: Deploy `/dist` to Vercel, Netlify, or Cloudflare Pages
2. **Backend**: Supabase Edge Functions (already handled)
3. **API Key**: Set `GEMINI_API_KEY` in Supabase Dashboard

---

## 🎨 Customization

### Adjust Verdict Probability
```typescript
// supabase/functions/analyze-magic-trick/index.ts:103
const isCaught = Math.random() > 0.4; // 60% caught, change as needed
```

### Change Analysis Duration
```typescript
// src/components/pages/magic-analyzer.tsx:123
const totalDuration = 8000 + Math.random() * 4000; // 8-12s, adjust range
```

### Modify Particle Count
```typescript
// src/components/magic/VerdictDisplay.tsx:191
{Array.from({ length: 30 }).map(...)} // Change 30 to desired count
```

### Update WeChat QR Code
```typescript
// src/components/magic/VerdictDisplay.tsx:55
navigator.clipboard.writeText("YOUR_WECHAT_ID");
// Also replace QR code image in line 98-105
```

---

## 📄 License

Proprietary — Vernond AI Marketing Experience

---

## 🙏 Acknowledgments

**Built with**:
- [React](https://react.dev) — UI framework
- [TypeScript](https://www.typescriptlang.org) — Type safety
- [Framer Motion](https://www.framer.com/motion) — Animations
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Supabase](https://supabase.com) — Backend & Edge Functions
- [Gemini API](https://ai.google.dev) — AI video analysis
- [Vite](https://vitejs.dev) — Build tool
- [Lucide Icons](https://lucide.dev) — Icon set

**Design Inspiration**:
- Vintage magic posters
- Penn & Teller stage shows
- Film noir lighting
- Art Deco typography

---

## 🎪 Ready to Test!

```bash
npm run dev
```

Then visit:
- **Main App**: [http://localhost:5173](http://localhost:5173)
- **Test Page**: [http://localhost:5173/test-recording.html](http://localhost:5173/test-recording.html)

**Need help?** Check [DEBUGGING.md](./DEBUGGING.md) first!

---

**Made with ✨ for Vernond AI**
