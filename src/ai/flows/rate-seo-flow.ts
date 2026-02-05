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
  prompt: `You are an SEO expert. Analyze the following metadata and provide an SEO score, a one-word rating, and concise, actionable feedback for improvement.

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
    if (!output) {
      throw new Error("The AI failed to rate the SEO. Please try again.");
    }
    return output;
  }
);
