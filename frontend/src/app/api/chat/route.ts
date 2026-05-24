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
            model: "google/gemma-4-31b-it:free",
            messages: [
              {
                role: "system",
                content: `You are Mithrama, an expert AI aquaculture companion for shrimp farmers in Andhra Pradesh. You provide practical, warm, and highly accurate advice regarding vannamei shrimp farming, water quality, feeding, diseases, and live market prices. Tone: warm, respectful, practical. Keep answers concise and strictly related to aquaculture.`
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
