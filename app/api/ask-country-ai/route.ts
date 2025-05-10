import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
// Ensure your OPENAI_API_KEY is set in your .env.local file
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

export async function POST(request: NextRequest) {
  if (!process.env.OPEN_AI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured.' }, { status: 500 });
  }

  try {
    const { countryName, question } = await request.json();

    if (!countryName || !question) {
      return NextResponse.json(
        { error: 'Missing countryName or question in request body.' },
        { status: 400 },
      );
    }

    const prompt = `You are a helpful assistant providing concise information about countries.
User wants to know about "${countryName}".
Question: ${question}
Answer concisely and factually. If the question is unrelated to the country, politely state that you can only answer questions about the specified country.`;

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo', // Or your preferred model
      max_tokens: 150, // Adjust as needed for concise answers
      temperature: 0.3, // Lower temperature for more factual/less creative answers
    });

    const answer = chatCompletion.choices[0]?.message?.content?.trim();

    if (answer) {
      return NextResponse.json({ answer });
    } else {
      return NextResponse.json(
        { error: 'Failed to get a valid answer from OpenAI.' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // Check for specific OpenAI API errors if needed, e.g., error.status
    return NextResponse.json(
      { error: 'Failed to communicate with OpenAI API.', details: errorMessage },
      { status: 500 },
    );
  }
}
