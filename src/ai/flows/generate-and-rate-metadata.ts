'use server';

/**
 * @fileOverview An AI agent that generates SEO metadata from scratch and provides a rating.
 * - generateAndRateMetadata - A function that generates and rates metadata.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateMetadataFromScratchInputSchema,
  type GenerateMetadataFromScratchInput,
  GenerateAndRateMetadataOutputSchema,
  type GenerateAndRateMetadataOutput,
} from '@/ai/schemas';

export async function generateAndRateMetadata(
  input: GenerateMetadataFromScratchInput
): Promise<GenerateAndRateMetadataOutput> {
  return generateAndRateMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAndRateMetadataPrompt',
  input: {schema: GenerateMetadataFromScratchInputSchema},
  output: {schema: GenerateAndRateMetadataOutputSchema},
  prompt: `You are an SEO expert. 
  1. Generate comprehensive SEO metadata based on the provided website description.
  2. Then, analyze the newly generated metadata and provide an SEO score, a one-word rating, and concise, actionable feedback for improvement.

  Website Description: {{{websiteDescription}}}
  `,
});

const generateAndRateMetadataFlow = ai.defineFlow(
  {
    name: 'generateAndRateMetadataFlow',
    inputSchema: GenerateMetadataFromScratchInputSchema,
    outputSchema: GenerateAndRateMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI failed to generate and rate metadata. Please try again.");
    }
    return output;
  }
);
