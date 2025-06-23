// src/app/api/generate-question/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { content } = await request.json();
  if (!content) {
    return new Response("Bad Request: content is required", { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Based on this user's recent journal entry, generate a single, gentle, and insightful follow-up question for their next session. The user is on a self-reflection journey. The question should be in Korean and must be only the question text itself, without any prefixes like "다음 질문:". User's entry: "${content}"`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const nextQuestion = response.text();

    await supabase
      .from("profiles")
      .update({ next_question: nextQuestion })
      .eq("id", user.id);

    return NextResponse.json({ success: true, question: nextQuestion });
  } catch (error) {
    console.error("AI Question Generation Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}