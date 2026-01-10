const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisResult {
  verdict: 'caught' | 'fooled';
  confidence: number;
  timestamps: string[];
  analysis: string;
}

// Helper to convert video to base64 for Gemini
async function videoToBase64(videoFile: File): Promise<string> {
  const arrayBuffer = await videoFile.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Convert to base64
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper to analyze video with Gemini API
async function analyzeWithGemini(videoFile: File, language: string = 'en'): Promise<AnalysisResult> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

  if (!geminiApiKey) {
    throw new Error(language === 'zh'
      ? 'AI 服务未配置，请联系管理员设置 GEMINI_API_KEY'
      : 'AI service not configured. Please contact administrator to set up GEMINI_API_KEY');
  }

  console.log('Converting video to base64 for Gemini...');
  const videoBase64 = await videoToBase64(videoFile);
  const videoSizeKB = (videoBase64.length * 3 / 4) / 1024;
  console.log(`Video size: ${videoSizeKB.toFixed(2)} KB`);

  // Gemini API endpoint with video support - Use gemini-2.0-flash-exp for best video analysis
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`;

  // Bilingual prompt - Let AI analyze and determine verdict naturally
  const promptText = language === 'zh'
      ? `你是一位专业的魔术分析师和表演艺术专家，拥有多年分析近景魔术的经验。请仔细观看这段魔术表演视频并进行深入分析。

请完整观看视频，注意以下方面：
- 表演者的手部动作、姿势、时机控制
- 道具的处理方式和移动轨迹
- 身体角度、摄像机角度与视线管理
- 任何可疑的停顿、快速移动或不自然的动作
- 误导技巧的使用（眼神、语言、身体语言）
- 整体表演的流畅度和专业性

根据你的专业判断，确定：
1. 你是否能够识破这个魔术的方法？（verdict）
   - 如果你明确看到了手法、藏牌、穿帮或角度问题 → "caught"
   - 如果表演干净，你无法确定具体方法 → "fooled"

2. 你的判断有多确定？（confidence，0到1之间的小数）
   - 基于你实际观察到的证据程度
   - 如果有明确的时间戳证据，confidence应该较高
   - 如果只是怀疑或不确定，confidence应该较低

3. 如果你发现了问题，请标注具体时间点（timestamps）
   - 格式：["0:02.34", "0:05.67"]
   - 只标注你真正观察到问题的时刻
   - 如果没有发现问题，留空数组 []

4. 撰写详细的分析报告（analysis，多段落格式）：
   - 描述你看到了什么，你的观察过程
   - 解释你为什么做出这个判断
   - 分析表演的优点和可改进之处
   - 给出专业建议

请用以下 JSON 格式回复（不要有其他文字）：
{
  "verdict": "caught" 或 "fooled",
  "confidence": 0.75,
  "timestamps": ["0:02.34"],
  "analysis": "你的详细分析报告（多段落，至少150字）"
}

重要提示：
- 请基于视频内容真实分析，不要随意猜测
- 只在真正看到问题时才判定为"caught"
- 分析要具体、详细、有见地
- 如果不确定，请在分析中说明你的疑虑

现在请开始分析这个魔术视频：`
      : `You are a professional magic trick analyst and performance art expert with years of experience analyzing close-up magic. Please carefully watch this magic performance video and conduct an in-depth analysis.

Watch the entire video and pay attention to:
- Performer's hand movements, positioning, timing control
- How props are handled and their movement trajectory
- Body angles, camera angles, and sight-line management
- Any suspicious pauses, rapid movements, or unnatural actions
- Use of misdirection techniques (eye contact, speech, body language)
- Overall performance fluidity and professionalism

Based on your professional judgment, determine:
1. Can you identify how this magic trick was performed? (verdict)
   - If you clearly saw sleight of hand, palming, exposed methods, or angle issues → "caught"
   - If the performance was clean and you cannot determine the specific method → "fooled"

2. How confident are you in your judgment? (confidence, decimal between 0 and 1)
   - Based on the actual evidence you observed
   - If you have clear timestamp evidence, confidence should be higher
   - If you only have suspicions or uncertainty, confidence should be lower

3. If you found issues, mark the specific timestamps (timestamps)
   - Format: ["0:02.34", "0:05.67"]
   - Only mark moments where you actually observed problems
   - If no issues found, leave as empty array []

4. Write a detailed analysis report (analysis, multi-paragraph format):
   - Describe what you saw and your observation process
   - Explain why you reached this conclusion
   - Analyze the performance's strengths and areas for improvement
   - Provide professional recommendations

Respond in this EXACT JSON format (no other text):
{
  "verdict": "caught" or "fooled",
  "confidence": 0.75,
  "timestamps": ["0:02.34"],
  "analysis": "Your detailed analysis report (multi-paragraph, minimum 150 words)"
}

Important:
- Analyze based on actual video content, don't make random guesses
- Only judge as "caught" when you genuinely see issues
- Analysis should be specific, detailed, and insightful
- If uncertain, explain your doubts in the analysis

Now please begin analyzing this magic trick video:`;

  console.log('Calling Gemini API with video...');
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            text: promptText
          },
          {
            inline_data: {
              mime_type: videoFile.type,
              data: videoBase64
            }
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error response:', errorText);
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Gemini API response received');

  // Extract text from Gemini response
  const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  console.log('Gemini response:', resultText);

  // Parse JSON from Gemini's response
  const jsonMatch = resultText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      verdict: parsed.verdict,
      confidence: parsed.confidence || 0.75,
      timestamps: parsed.timestamps || [],
      analysis: parsed.analysis
    };
  }

  // If we can't parse the response, throw an error with the raw response for debugging
  throw new Error(language === 'zh'
    ? `AI 分析响应格式错误。原始响应：${resultText.substring(0, 200)}`
    : `AI analysis response format error. Raw response: ${resultText.substring(0, 200)}`);
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const formData = await req.formData();
    const videoFile = formData.get('video') as File;
    const language = formData.get('language') as string || 'en';

    if (!videoFile) {
      return new Response(
        JSON.stringify({ error: 'No video file provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json'}, status: 400 }
      );
    }

    console.log(`Received video file: ${videoFile.name}, size: ${videoFile.size} bytes, type: ${videoFile.type}, language: ${language}`);

    // Add a small delay for dramatic effect (AI is "thinking")
    await new Promise(resolve => setTimeout(resolve, 500));

    // Analyze the actual video with Gemini API (native video support!)
    const result = await analyzeWithGemini(videoFile, language);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: unknown) {
    console.error('Analysis error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({
        error: 'Failed to analyze video',
        details: errorMessage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
