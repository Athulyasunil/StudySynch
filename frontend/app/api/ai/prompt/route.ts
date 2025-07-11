import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt, context } = await req.json();

  const API_KEY = process.env.GEMINI_API_KEY;
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-001:generateContent?key=${API_KEY}`;

  const messages = [
    ...(context ? [{ role: 'user', parts: [{ text: context }] }] : []),
    { role: 'user', parts: [{ text: prompt }] }
  ];

  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: messages }),
    });

    const data = await res.json();

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ reply: 'Error contacting Gemini API' }, { status: 500 });
  }
}
