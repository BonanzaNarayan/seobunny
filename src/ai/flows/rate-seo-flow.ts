'use server';

/**
 * @fileOverview An AI agent that rates SEO metadata and provides feedback.
 * - rateSeo - A function that rates the given metadata.
 */

import {ai} from '@/ai/genkit';
import {
  RateSeoInputSchema,
  type RateSeoInput,
  RateSeoOutputSchema,
  type RateSeoOutput,
} from '@/ai/schemas';

export async function rateSeo(input: RateSeoInput): Promise<RateSeoOutput> {
  return rateSeoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rateSeoPrompt',
  input: {schema: RateSeoInputSchema},
  output: {schema: RateSeoOutputSchema},
  prompt: `You are an SEO expert. Analyze the following metadata and provide a score from 0 to 100, a one-word rating (e.g., Poor, Average, Good, Excellent), and concise, actionable feedback for improvement.

  Factors to consider for scoring:
  - Title length (50-60 characters is ideal).
  - Description length (150-160 characters is ideal).
  - Keyword presence and relevance in title and description.
  - Compelling and clickable language.

  Metadata:
  Title: {{{title}}}
  Description: {{{description}}}
  Keywords: {{{keywords}}}
  `,
});

const rateSeoFlow = ai.defineFlow(
  {
    name: 'rateSeoFlow',
    inputSchema: RateSeoInputSchema,
    outputSchema: RateSeoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
