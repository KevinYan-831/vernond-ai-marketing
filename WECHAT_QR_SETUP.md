# WeChat QR Code Setup

## Adding Your WeChat QR Code

The application is configured to display your WeChat QR code when users complete a magic trick analysis.

### Step 1: Save Your QR Code Image

1. Save the WeChat QR code image you provided as: `wechat-qr.png`
2. Place it in: `/app/public/images/wechat-qr.png`

### Step 2: Verify the Image

The image should be:
- **Format**: PNG (recommended) or JPG
- **Size**: Square (recommended: 512x512px or larger)
- **Content**: Your WeChat group QR code

### Step 3: Test

1. Record a magic trick in the app
2. Complete the analysis
3. The verdict screen will display your QR code in an ornate frame

### Fallback

If the image is not found at `/app/public/images/wechat-qr.png`, the app will show a placeholder icon.

---

## File Location

```
/app/
├── public/
│   └── images/
│       └── wechat-qr.png  ← Place your QR code here
├── src/
│   └── components/
│       └── magic/
│           └── VerdictDisplay.tsx  ← Component that displays it
```

---

## Bilingual Support

The WeChat section displays in both Chinese and English based on the user's language selection:

**Chinese (中文)**:
- Title: "加入内测社群"
- Description: "我们正在开发 Vernond AI —— 一款面向魔术初学者与专业魔术师的 AI 近景魔术教练。欢迎加入内测社群，成为我们的最早期用户，期待与你学习、交流、共同进步。"
- Scan text: "扫码加入微信群"

**English**:
- Title: "Join Our Beta Community"
- Description: "We are developing Vernond AI — an AI close-up magic coach for beginners and professional magicians. Join our beta community, become our earliest user, and learn and grow together."
- Scan text: "Scan to Join WeChat Group"

---

## Customization

To customize the WeChat ID or text:

1. Open `/app/src/contexts/LanguageContext.tsx`
2. Find the `translations` object
3. Update the `wechat.*` keys for English and Chinese

Example:
```typescript
'wechat.title': 'Join Our Beta Community',
'wechat.description': 'Your custom description here...',
```

---

## Current Implementation

The QR code appears:
- ✅ After each verdict (caught or fooled)
- ✅ In an ornate frame with corner decorations
- ✅ With pulsing glow effect
- ✅ Bilingual text based on language selection
- ✅ Below the "Try Again" button

---

**Ready to add your QR code!** Just place `wechat-qr.png` in `/app/public/images/` and it will automatically appear.
