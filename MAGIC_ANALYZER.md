# Vernond AI — Magic Trick Analyzer

A theatrical, interactive marketing experience where users record themselves performing close-up magic tricks and receive instant AI analysis of whether they fooled the artificial eye.

## 🎭 Design Philosophy

**Neo-Mysticism / Stage Magic** — Dark theatrical aesthetic inspired by vintage magic posters and modern stage lighting. Deep velvety blacks with sharp spotlights, gold foil accents, and subtle playing card motifs. Every interaction is a reveal, every button press is a choice with weight.

### Color Palette
- **Base**: Rich charcoal (`#0A0A0F`) with deep purple undertones
- **Accent Gold**: Warm gold (`#D4AF37`) for success states and magical sparkle
- **Alert**: Deep crimson (`#8B0000`) for "caught" moments
- **Atmospheric**: Soft amber spotlight glow for vignettes and halos

### Typography
- **Display**: Syne Extra Bold (900) — Geometric, commands attention
- **Body**: Space Grotesk (400, 500) — Technical yet approachable
- **Accent**: Crimson Pro Italic — Vintage editorial feel for taglines

## 🎪 User Flow

### 1. Initial Load
- Dark stage with pulsing ambient glow
- Single spotlight beam sweeps across, landing on "Start Recording" button
- Button glows brighter on hover

### 2. Recording Flow
```
Click Start → 3-2-1 Countdown (flip-card style)
           ↓
     Recording begins (red indicator pulses)
           ↓
     User performs magic trick
           ↓
     Click Stop → Camera shutter sound → Frozen frame
           ↓
     Auto-upload with progress ring
```

### 3. Analysis Phase (8-12 seconds)
- Stage dims further
- Scanning laser line sweeps vertically across frozen video
- Cryptic status messages cycle through:
  - "Analyzing hand movements..."
  - "Detecting misdirection patterns..."
  - "Cross-referencing 10,000+ trick databases..."
- AI "eye" animation with rotating rings

### 4. Verdict Reveal
**Screen flashes white** → Resolves into verdict state

#### "CAUGHT" State
- Red spotlight effect
- Ominous drone sound
- Exposed frame highlights with specific timestamps
- Playful "busted" messaging
- WeChat CTA: "Learn advanced techniques in our WeChat group"

#### "FOOLED" State
- Golden spotlight effect
- Applause sound + sparkle effects
- Champagne-bubble particles (slow, floating, elegant)
- Congratulatory message + skill rating badge
- WeChat CTA: "Join our community of master magicians"

### 5. WeChat Integration
- QR code presented in ornate picture frame graphic
- 3D tilt effect on hover (parallax)
- Pulsing golden glow every 3 seconds
- Copy button for WeChat ID

### 6. Retry Flow
- "Try Another Trick" button below verdict
- Curtain-wipe transition animation back to stage
- Whoosh sound effect

## 🎨 Key Visual Effects

### Particle System
- **Caught**: Sharp red particles falling straight down
- **Fooled**: Golden sparkles with horizontal drift (champagne bubbles)
  - Slower animation (4-7 seconds)
  - Subtle blur and glow
  - Elegant floating motion

### Transitions
- **Flash Effect**: White screen flash (200ms) before verdict
- **Spotlight Sweeps**: Radial wipes instead of generic fades
- **Curtain Wipe**: scaleY animation from top when exiting verdict
- **Button Press**: Scale down to 0.95 with shadow shift

### Ambient Effects
- Noise texture overlay (3% opacity) for depth
- Floating card suits (♠ ♥ ♦ ♣) at 5% opacity, off-grid
- Radial gradient background with pulsing glow spots
- Subtle vignette darkening edges

## 🔊 Sound Design

All sounds are procedurally generated using Web Audio API:

- **Shutter**: Camera click when stopping recording
- **Applause**: White noise bandpass filtered for "fooled" verdict
- **Ominous Drone**: Low sawtooth wave for "caught" verdict
- **Flash**: High-to-low frequency sweep for verdict reveal
- **Sparkle**: Rising sine wave for particle effects
- **Whoosh**: Highpass filtered noise for transitions

## 🤖 AI Analysis

### Current Implementation
The system uses a fallback analysis with randomized verdicts (60% caught, 40% fooled) to ensure smooth UX even without AI backend.

### Production-Ready AI Integration
Located in `/app/supabase/functions/analyze-magic-trick/index.ts`:

```typescript
// To enable real AI analysis:
// 1. Set ANTHROPIC_API_KEY environment variable in Supabase
// 2. Implement video frame extraction (requires FFmpeg)
// 3. Convert frames to base64
// 4. Send to Claude Vision API with analysis prompt

const result = await analyzeWithClaude();
```

The function is designed to:
1. Extract 5-10 key frames from the video
2. Send frames to Claude Vision API
3. Receive structured JSON with verdict, timestamps, and analysis
4. Return formatted result to frontend

### AI Prompt Structure
```
You are analyzing a video of someone performing a close-up magic trick.

Your task:
1. Look for visible sleight of hand, palming, misdirection
2. Identify specific moments where trick might be detected
3. Determine if performance is clean or if you caught the method

Respond in JSON format with:
- verdict: "caught" or "fooled"
- confidence: 0.0-1.0
- timestamps: ["0:02.34", "0:05.12"] (if caught)
- analysis: Brief description
```

## 🏗️ Architecture

### Component Structure
```
src/components/
├── magic/
│   ├── VideoStage.tsx          # Camera feed with spotlight effects
│   ├── RecordingControls.tsx   # Theatrical start/stop buttons
│   ├── Countdown.tsx            # Flip-card countdown animation
│   ├── AnalysisOverlay.tsx     # Scanning animation + progress
│   ├── VerdictDisplay.tsx      # Full-screen verdict reveal
│   └── BackgroundEffects.tsx   # Ambient atmosphere layer
└── pages/
    └── magic-analyzer.tsx      # Main orchestration component
```

### State Machine
```typescript
type AppState = "idle" | "countdown" | "recording" | "uploading" | "analyzing";

idle → countdown (3s) → recording → uploading → analyzing (8-12s) → verdict
                                                                      ↓
                                                                   retry → idle
```

### Supabase Edge Function
```
supabase/functions/
└── analyze-magic-trick/
    ├── index.ts       # Main analysis endpoint
    └── deno.json      # Deno configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for deployment)

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
# Opens on http://localhost:5173
```

### Environment Variables
```bash
# .env.local (for Supabase)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Supabase Edge Function (set in Supabase dashboard)
ANTHROPIC_API_KEY=your_anthropic_key
```

### Build for Production
```bash
npm run build
# Output in /dist
```

### Deploy Supabase Function
```bash
supabase functions deploy analyze-magic-trick --no-verify-jwt
```

## 🎯 Performance Optimizations

- **Lazy Loading**: Verdict display components only mount when needed
- **Memoization**: Camera stream initialization happens once
- **Efficient Particles**: 30 particles with CSS transforms (GPU-accelerated)
- **Sound Caching**: Web Audio API contexts reused across playbacks
- **Video Codec**: WebM with VP9 for optimal compression

## 📱 Browser Compatibility

- **Chrome/Edge**: Full support ✅
- **Firefox**: Full support ✅
- **Safari**: Full support ✅ (with getUserMedia permission)
- **Mobile Chrome/Safari**: Full support ✅

### Required Permissions
- Camera access (via `navigator.mediaDevices.getUserMedia`)
- Audio playback (auto-granted in modern browsers)

## 🎨 Customization Guide

### Adjusting Verdict Probability
```typescript
// In supabase/functions/analyze-magic-trick/index.ts
const isCaught = Math.random() > 0.4; // 60% caught, 40% fooled
```

### Changing Analysis Duration
```typescript
// In src/components/pages/magic-analyzer.tsx
const totalDuration = 8000 + Math.random() * 4000; // 8-12 seconds
```

### Modifying Particle Count
```typescript
// In src/components/magic/VerdictDisplay.tsx
{Array.from({ length: 30 }).map((_, i) => ( // Change 30 to desired count
```

### Updating WeChat QR Code
```typescript
// In src/components/magic/VerdictDisplay.tsx
const handleCopy = () => {
  navigator.clipboard.writeText("YOUR_WECHAT_ID");
  // Replace with actual QR code image in the component
```

## 🐛 Troubleshooting

### Camera Not Starting
- Ensure HTTPS connection (required for getUserMedia)
- Check browser camera permissions
- Verify no other app is using the camera

### Recording Fails After Countdown
- Check browser console for MediaRecorder errors
- Verify VP9 codec support: `MediaRecorder.isTypeSupported('video/webm;codecs=vp9')`
- Fallback to VP8 if needed

### Sounds Not Playing
- User interaction required before audio playback
- Check browser autoplay policies
- Verify Web Audio API support

### Supabase Function Errors
- Check function logs: `supabase functions logs analyze-magic-trick`
- Verify CORS headers are correct
- Ensure FormData is being sent correctly

## 📄 License

Proprietary — Vernond AI Marketing Experience

## 🤝 Contributing

This is a marketing experience for Vernond AI. For bugs or feature requests, please contact the development team.

---

**Built with**: React, TypeScript, Framer Motion, Tailwind CSS, Supabase Edge Functions, Web Audio API

**Design Inspiration**: Vintage magic posters, Penn & Teller stage shows, noir lighting
