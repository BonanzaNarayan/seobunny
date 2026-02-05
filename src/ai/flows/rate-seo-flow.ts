'use server';

/**
 * @fileOverview An AI agent that rates SEO metadata and provides feedback.
 * - rateSeo - A function that rates the given metadata.
 * - RateSeoInput - The input type for the rateSeo function.
 * - RateSeoOutput - The return type for the rateSeo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RateSeoInputSchema = z.object({
  title: z.string().describe('The title tag of the webpage.'),
  description: z.string().describe('The meta description of the webpage.'),
  keywords: z.string().optional().describe('The keywords for the webpage.'),
});
export type RateSeoInput = z.infer<typeof RateSeoInputSchema>;

const RateSeoOutputSchema = z.object({
  score: z.number().min(0).max(100).describe('The SEO score from 0 to 100.'),
  rating: z
    .string()
    .describe('A one-word rating like "Excellent", "Good", "Average", "Poor".'),
  feedback: z.string().describe('Actionable feedback to improve the SEO score.'),
});
export type RateSeoOutput = z.infer<typeof RateSeoOutputSchema>;

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
