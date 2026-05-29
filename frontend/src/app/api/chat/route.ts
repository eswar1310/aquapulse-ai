import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, language, history, image, marketContext } = body;

    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (openRouterKey) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "AquaPulse AI",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "google/gemma-2-9b-it:free",
            messages: [
              {
                role: "system",
                content: `You are Mithrama, an expert AI aquaculture companion for shrimp farmers in Andhra Pradesh. You provide practical, warm, and highly accurate advice regarding vannamei shrimp farming, water quality, feeding, diseases, and live market prices.
Tone: warm, respectful, practical. Keep answers concise and strictly related to aquaculture.

Shrimp Count Estimation:
If the farmer asks to estimate or guess their shrimp count size based on Days of Culture (DOC), use the standard Vannamei growth estimation table:
- DOC 30: ~150 to 200 count
- DOC 45: ~100 to 120 count
- DOC 50: ~90 to 100 count
- DOC 53-55: ~80 to 90 count
- DOC 60: ~70 to 80 count
- DOC 70: ~60 to 70 count
- DOC 80: ~50 to 60 count
- DOC 90: ~45 to 50 count
- DOC 100: ~35 to 40 count
- DOC 110-120: ~25 to 30 count
Always mention that this is a general benchmark estimate, and actual counts will depend on stocking density, feed management, pond temperature, and aeration.`
              },
              {
                role: "user",
                content: message
              }
            ]
          })
        });

        if (response.ok) {
          const aiData = await response.json();
          const aiText = aiData.choices?.[0]?.message?.content;
          
          if (aiText) {
            return NextResponse.json({
              text: aiText,
              language: language || "EN",
              voiceUrl: null,
              citations: [],
              suggestedFollowUps: []
            });
          }
        }
        
        // If response is not ok (e.g. 429 Too Many Requests) or no text, fall through to scaffold
        console.warn(`OpenRouter API failed (${response.status}): ${response.statusText}. Falling back to scaffold.`);
      } catch (e) {
        console.warn("OpenRouter fetch failed, falling back to scaffold.", e);
      }
    }

    // --- FALLBACK (If no API key is provided) ---
    await new Promise(resolve => setTimeout(resolve, 1500));

    let responseText = "Namaskaram! I am Mithrama, your aquaculture companion. I am currently operating in scaffold mode because no OpenRouter API key was found in .env.local. How can I assist with your ponds today?";

    if (message.toLowerCase().includes("market") || message.toLowerCase().includes("price")) {
      responseText = "Currently, the 40C Vannamei price is showing strong bullish momentum in Bhimavaram at ₹365/kg. Export demand is driving this trend. Would you like a detailed 7-day forecast?";
    } else if (message.toLowerCase().includes("feed")) {
      responseText = "Based on current weather and your typical pond conditions, I recommend a slight reduction in the afternoon feed by 10% to prevent ammonia buildup. Let me know your current feed tray observations.";
    } else if (message.toLowerCase().includes("count") || message.toLowerCase().includes("culture") || message.toLowerCase().includes("days") || message.toLowerCase().includes("doc")) {
      responseText = "Namaskaram! At 53 days of culture (DOC 53) for Vannamei shrimp, the standard benchmark count size is typically between 80 to 90 count (meaning 80-90 shrimp per kg). Note that actual growth depends on stocking density, feed conversion, and water temperature. How are your current feed tray checks?";
    }

    return NextResponse.json({
      text: responseText,
      language: language || "EN",
      voiceUrl: null, // Scaffold for future TTS integration
      citations: [
        { source: "AquaPulse Market Intelligence", type: "market_data" }
      ],
      suggestedFollowUps: [
        "Show me the 7-day forecast",
        "How do I manage ammonia?",
        "Latest 60C prices"
      ]
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
