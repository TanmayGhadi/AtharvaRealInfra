import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

// Setup OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API Key is missing. Please configure it in settings.' },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    // Fetch minimal property data to feed to the AI context
    const { data: properties } = await supabase
      .from('properties')
      .select('title, location:district, price_display, type:property_type, status')
      .eq('status', 'Available')
      .limit(10);

    const systemPrompt = `
      You are the AI Property Consultant for 'Atharva Real Infra', a luxury real estate and premium land investment company operating in Sindhudurg (Dodamarg, Sawantwadi, Vengurla, Kudal, Kankavli), Maharashtra, India.
      Your goal is to be extremely polite, professional, and helpful. Guide users to make inquiries and capture their contact info.
      
      Company Info:
      - We specialize in clear-title Agricultural Land, Farmhouse Plots, and Investment properties.
      - Strong ROI potential due to Mopa International Airport and NH-66.
      - Contact: +91 87888 18163, WhatsApp: +91 87888 18163, Email: ds200784@atharvarealinfra.com
      
      Available Properties in Database:
      ${JSON.stringify(properties || [])}
      
      Instructions:
      - Answer questions based on the available properties.
      - If you don't know, suggest they contact our experts.
      - Keep responses concise and highly professional.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return NextResponse.json({
      message: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request.' },
      { status: 500 }
    );
  }
}
