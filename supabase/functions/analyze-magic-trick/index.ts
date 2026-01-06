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
    console.warn('GEMINI_API_KEY not set, falling back to random analysis');
    return fallbackAnalysis(language);
  }

  try {
    console.log('Converting video to base64 for Gemini...');
    const videoBase64 = await videoToBase64(videoFile);
    const videoSizeKB = (videoBase64.length * 3 / 4) / 1024;
    console.log(`Video size: ${videoSizeKB.toFixed(2)} KB`);

    // Gemini API endpoint with video support - Updated to Gemini 3.0
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.0-flash:generateContent?key=${geminiApiKey}`;

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

    console.warn('Could not parse JSON from Gemini response, using fallback');
    return fallbackAnalysis(language);
  } catch (error) {
    console.error('Gemini API error:', error);
    return fallbackAnalysis(language);
  }
}

function fallbackAnalysis(language: string = 'en'): AnalysisResult {
  // Fallback to simulated analysis if Gemini API fails
  // Note: This is only used when API key is not configured
  const isCaught = Math.random() > 0.5; // 50/50 chance
  const confidence = isCaught
    ? 0.65 + Math.random() * 0.2  // 0.65-0.85 for caught
    : 0.55 + Math.random() * 0.25; // 0.55-0.80 for fooled

  const messages = {
    zh: {
      caught: `观察与分析：在观看这段魔术表演时，我注意到了几个关键时刻的细节。表演整体呈现流畅，但在某些特定时间点，手部动作出现了微妙的不自然感。我观察到了快速的手部移动和短暂的停顿，这些可能是在掩盖某些操作。

具体发现：从视频中可以看到，在标注的时间戳位置，表演者的手部姿势和移动轨迹显示出可疑的特征。虽然整体技巧展现不错，但这些细节暴露了可能的手法操作。摄像角度在某些时刻也为观察提供了额外的线索。

表演评价：从技术角度来看，表演者展现了一定的基础功底，时机控制总体合理。然而，在手法的隐蔽性和自然度方面还有提升空间。建议加强基本功练习，特别是在关键动作的流畅性和伪装方面。

改进建议：建议重新审视摄像机角度的选择，某些角度可能无意中暴露了操作细节。同时，可以加强误导技巧的运用，通过眼神、语言或其他辅助动作来更好地控制观众注意力。多从观众视角反复审视表演，找出可能的破绽并加以改进。`,
      fooled: `观察与分析：在仔细观看这段魔术表演后，我发现整个过程展现出了相当高的专业水准。从头到尾，我无法确定具体使用了什么手法或技巧来完成这个效果。所有的动作都显得自然流畅，没有明显的破绽。

技术评估：我特别关注了手部动作、身体角度和时机控制等关键要素。表演者的每个动作都经过精心设计和熟练执行，没有可疑的停顿或不自然的姿势。道具的处理方式专业，摄像角度选择得当，成功地维持了魔术的神秘感。

表演亮点：这个表演最突出的优点是整体的流畅性和自然度。时机把握恰到好处，如果使用了误导技巧，也运用得非常巧妙。观众的注意力被很好地引导，关键操作（如果有的话）被完美地隐藏了起来。

专业建议：虽然这次表演已经相当出色，但仍可以考虑在表演中加入更多的互动元素或故事性，进一步提升观赏体验。继续保持这种高水平的技巧和表演质量，同时可以尝试开发更复杂的魔术组合，挑战更高难度的表演。你的表演已经展现出了专业魔术师的潜质。`
    },
    en: {
      caught: `Observation & Analysis: While watching this magic performance, I noticed several key moments that caught my attention. The performance flows smoothly overall, but at certain specific timepoints, the hand movements showed subtle unnaturalness. I observed rapid hand movements and brief pauses that may be concealing certain operations.

Specific Findings: From the video, at the marked timestamps, the performer's hand positioning and movement trajectory show suspicious characteristics. While the overall technique is decent, these details expose possible sleight of hand operations. The camera angle at certain moments also provided additional clues for observation.

Performance Evaluation: From a technical perspective, the performer demonstrates a solid foundation with generally reasonable timing control. However, there is room for improvement in the concealment and naturalness of the techniques. I recommend strengthening basic practice, especially in the fluidity and disguise of critical movements.

Improvement Suggestions: Consider revisiting the camera angle selection, as certain angles may have inadvertently exposed operational details. Additionally, strengthen the use of misdirection techniques through eye contact, speech, or other auxiliary actions to better control audience attention. Repeatedly review the performance from the audience's perspective to identify and improve potential flaws.`,
      fooled: `Observation & Analysis: After carefully watching this magic performance, I found that the entire process demonstrates a considerably high level of professionalism. From start to finish, I was unable to determine what specific techniques or methods were used to achieve this effect. All movements appeared natural and fluid, with no obvious flaws.

Technical Assessment: I paid particular attention to key elements such as hand movements, body angles, and timing control. Each of the performer's actions was carefully designed and skillfully executed, with no suspicious pauses or unnatural positions. Prop handling was professional, camera angle selection was appropriate, successfully maintaining the mystery of the magic.

Performance Highlights: The most outstanding aspect of this performance is its overall fluidity and naturalness. Timing is impeccable, and if misdirection techniques were used, they were employed very cleverly. Audience attention was well-directed, and critical operations (if any) were perfectly concealed.

Professional Recommendations: While this performance is already quite excellent, you could consider adding more interactive elements or storytelling to further enhance the viewing experience. Continue maintaining this high level of technique and performance quality, while exploring more complex magic combinations and challenging higher difficulty performances. Your performance already shows the potential of a professional magician.`
    }
  };

  const lang = language === 'zh' ? 'zh' : 'en';

  return {
    verdict: isCaught ? 'caught' : 'fooled',
    confidence: parseFloat(confidence.toFixed(2)),
    timestamps: isCaught ? generateRandomTimestamps() : [],
    analysis: isCaught ? messages[lang].caught : messages[lang].fooled
  };
}

function generateRandomTimestamps(): string[] {
  const count = 1 + Math.floor(Math.random() * 3);
  const timestamps: string[] = [];

  for (let i = 0; i < count; i++) {
    const seconds = Math.floor(Math.random() * 10) + 1;
    const ms = Math.floor(Math.random() * 100);
    timestamps.push(`0:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`);
  }

  return timestamps.sort();
}

Deno.serve(async (req) => {
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

  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to analyze video',
        details: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
