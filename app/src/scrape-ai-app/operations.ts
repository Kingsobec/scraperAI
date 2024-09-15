import type { GenerateScrapeGptResponse } from 'wasp/server/operations'; // Removed GetScrapeGptResponses
import { HttpError } from 'wasp/server';
import OpenAI from 'openai/index.mjs';
import axios from 'axios';
import * as cheerio from 'cheerio';

const openai = setupOpenAI();
function setupOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    return new HttpError(500, 'OpenAI API key is not set');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

//#region Actions
type GptPayload = {
  urls: string;
  userPrompt: string;
};

// Modified action without `GptResponse`
export const generateScrapeGptResponse: GenerateScrapeGptResponse<GptPayload, string> = async ({ urls, userPrompt }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // Check user's credit and subscription status
  if (
    !context.user.credits &&
    (!context.user.subscriptionStatus ||
      context.user.subscriptionStatus === 'deleted' ||
      context.user.subscriptionStatus === 'past_due')
  ) {
    throw new HttpError(402, 'User has not paid or is out of credits');
  } else if (context.user.credits && !context.user.subscriptionStatus) {
    console.log('decrementing credits');
    await context.entities.User.update({
      where: { id: context.user.id },
      data: {
        credits: {
          decrement: 1,
        },
      },
    });
  }

  const urlArray = urls.split(',').map(url => url.trim());
  const htmlSummaries = [];

  try {
    // Check if OpenAI is initialized correctly with the API key
    if (openai instanceof Error) {
      throw openai;
    }

    // Loop through each URL to fetch and summarize HTML content
    for (const url of urlArray) {
      const { data: html } = await axios.get(url);
      const $ = cheerio.load(html);
      const content = $('body').text(); // Extracts text content from body
      
      // First GPT call: Summarize the HTML content
      const summaryCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 1500,
        messages: [
          {
            role: 'system',
            content: `
              You are an AI assistant that summarizes web content. Given a block of text extracted from a webpage, summarize the key points in a concise and clear manner. Focus on important information only.`,
          },
          {
            role: 'user',
            content: `Here is the text extracted from the webpage: ${content}`,
          },
        ],
        temperature: 1,
      });

      const summaryContent = summaryCompletion?.choices[0]?.message?.content;
      if (summaryContent) {
        htmlSummaries.push(summaryContent);
      } else {
        throw new HttpError(500, 'Failed to generate summary from OpenAI');
      }
    }

    // Second GPT call: Combine all summaries with user prompt
    const finalCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 4000,
      messages: [
        {
          role: 'system',
          content: `
            You are an expert AI that combines context from multiple sources. Given a set of summaries and a user prompt, provide a comprehensive and insightful response to the user's query.`,
        },
        {
          role: 'user',
          content: `Summaries from websites: ${htmlSummaries.join(' ')}. User prompt: ${userPrompt}`,
        },
      ],
      temperature: 1,
    });

    const finalResponseContent = finalCompletion?.choices[0]?.message?.content;

    if (!finalResponseContent) {
      throw new HttpError(500, 'Failed to generate final response from OpenAI');
    }

    return finalResponseContent; // Return the response directly without storing it
  } catch (error: any) {
    // Increment credits back in case of an unexpected error except for payment-related errors
    if (!context.user.subscriptionStatus && error?.statusCode != 402) {
      await context.entities.User.update({
        where: { id: context.user.id },
        data: {
          credits: {
            increment: 1,
          },
        },
      });
    }
    console.error(error);
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'Internal server error';
    throw new HttpError(statusCode, errorMessage);
  }
};

//#endregion