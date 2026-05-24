import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Scaffold API response
    return NextResponse.json({
      success: true,
      data: {
        issue: "Early signs of White Spot Syndrome Virus (WSSV)",
        confidence: 85,
        warningLevel: "high",
        nextStep: "Isolate affected pond immediately. Do not share equipment.",
        questions: ["When did you first notice the white spots?", "Has there been a sudden drop in feeding?"]
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to scan disease" }, { status: 500 });
  }
}
