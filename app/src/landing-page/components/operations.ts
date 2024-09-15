import { HttpError } from 'wasp/server';
import OpenAI from 'openai/index.mjs';

const openai = setupOpenAI();

function setupOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key is not set');
    throw new HttpError(500, 'OpenAI API key is not set');
  }
  console.log('OpenAI client initialized successfully.');
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export const generateHeadline = async (_args: undefined, context: any): Promise<{ newHeadline: string }> => {
  try {
    if (openai instanceof Error) {
      throw openai;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 60,
      messages: [
        {
          role: 'user',
          content: 'Generate a catchy AI consulting services hero headline. No jargon or fluff. Make it attractive & Short and Simple and cool alpha chad confident. Attract leaders, developers, innovators. Do not use Quotes in the response, just give the headline and no other prose.',
        },
      ],
      temperature: 1.5,
    });

    const newHeadline = completion.choices[0]?.message?.content.trim();

    if (!newHeadline) {
      console.error('Bad response from OpenAI');
      throw new HttpError(500, 'Bad response from OpenAI');
    }

    console.log('Generated headline:', newHeadline);
    return { newHeadline };
  } catch (error: any) {
    console.error('Error generating headline:', error);
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'Internal server error';
    throw new HttpError(statusCode, errorMessage);
  }
};